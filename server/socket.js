const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const Conversation = require('./models/Conversation')
const Message = require('./models/Message')

let io
const activeUsers = new Map()

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

const ensureParticipant = (conversation, userId) =>
  conversation.participants.some((participantId) => participantId.toString() === userId)

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1]

  if (!token) {
    return next(new Error('Authentication token missing'))
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    return next(new Error('JWT secret not set'))
  }

  try {
    socket.user = jwt.verify(token, secret)
    return next()
  } catch (err) {
    return next(new Error('Invalid or expired token'))
  }
}

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || true,
      credentials: true
    }
  })

  io.use(authenticateSocket)

  io.on('connection', (socket) => {
    const userId = socket.user.userId
    activeUsers.set(userId, socket.id)

    socket.join(`user:${userId}`)
    socket.emit('socket:ready', { userId })

    socket.on('conversation:join', ({ conversationId }) => {
      if (isValidObjectId(conversationId)) {
        socket.join(`conversation:${conversationId}`)
      }
    })

    socket.on('conversation:leave', ({ conversationId }) => {
      if (isValidObjectId(conversationId)) {
        socket.leave(`conversation:${conversationId}`)
      }
    })

    socket.on('message:send', async (payload, ack) => {
      try {
        const { conversationId, content, attachments = [] } = payload || {}

        if (!isValidObjectId(conversationId)) {
          return ack?.({ ok: false, error: 'Invalid conversation id' })
        }

        const trimmedContent = content?.trim()
        if (!trimmedContent) {
          return ack?.({ ok: false, error: 'Message content is required' })
        }

        const conversation = await Conversation.findById(conversationId)
        if (!conversation) {
          return ack?.({ ok: false, error: 'Conversation not found' })
        }

        if (!ensureParticipant(conversation, userId)) {
          return ack?.({ ok: false, error: 'Not authorized to send messages in this conversation' })
        }

        const message = await Message.create({
          conversationId,
          senderId: userId,
          content: trimmedContent,
          attachments: Array.isArray(attachments) ? attachments : []
        })

        conversation.latestMessage = message._id
        await conversation.save()

        const populatedMessage = await Message.findById(message._id).populate('senderId', 'name username avatar')

        io.to(`conversation:${conversationId}`).emit('message:new', populatedMessage)
        conversation.participants.forEach((participantId) => {
          io.to(`user:${participantId.toString()}`).emit('message:received', populatedMessage)
        })

        return ack?.({ ok: true, message: populatedMessage })
      } catch (err) {
        return ack?.({ ok: false, error: 'Server error' })
      }
    })

    socket.on('message:read', async ({ messageId }) => {
      try {
        if (!isValidObjectId(messageId)) return

        const message = await Message.findById(messageId)
        if (!message) return

        const conversation = await Conversation.findById(message.conversationId)
        if (!conversation || !ensureParticipant(conversation, userId)) return

        await Message.updateOne(
          { _id: messageId },
          { $addToSet: { readBy: userId } }
        )

        io.to(`conversation:${message.conversationId.toString()}`).emit('message:read', {
          messageId,
          userId
        })
      } catch (err) {
        return undefined
      }
    })

    socket.on('disconnect', () => {
      if (activeUsers.get(userId) === socket.id) {
        activeUsers.delete(userId)
      }
    })
  })

  return io
}

const getIo = () => io

module.exports = { initSocket, getIo }