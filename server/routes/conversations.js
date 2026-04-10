const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const Conversation = require('../models/Conversation')
const Message = require('../models/Message')
const User = require('../models/User')
const auth = require('../middleware/auth')

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

const conversationPopulateOptions = [
  { path: 'participants', select: 'name username avatar' },
  { path: 'latestMessage', select: 'content senderId createdAt', populate: { path: 'senderId', select: 'name username avatar' } }
]

const ensureParticipant = (conversation, userId) =>
  conversation.participants.some((participantId) => participantId.toString() === userId)

const getDirectKey = (participantIds) => participantIds
  .map((id) => String(id))
  .sort()
  .join(':')

const dedupeConversations = (conversations) => {
  const seen = new Map()

  conversations.forEach((conversation) => {
    const key = conversation.type === 'direct'
      ? conversation.directKey || getDirectKey(conversation.participants.map((participant) => participant._id || participant))
      : conversation._id.toString()

    const existing = seen.get(key)

    if (!existing) {
      seen.set(key, conversation)
      return
    }

    const currentUpdatedAt = new Date(conversation.updatedAt || conversation.createdAt || 0).getTime()
    const existingUpdatedAt = new Date(existing.updatedAt || existing.createdAt || 0).getTime()

    if (currentUpdatedAt > existingUpdatedAt) {
      seen.set(key, conversation)
    }
  })

  return Array.from(seen.values())
}

router.get('/', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.userId })
      .sort({ updatedAt: -1 })
      .populate(conversationPopulateOptions)

    res.json(dedupeConversations(conversations))
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid conversation id' })
    }

    const conversation = await Conversation.findById(req.params.id).populate(conversationPopulateOptions)
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    if (!ensureParticipant(conversation, req.user.userId)) {
      return res.status(403).json({ error: 'Not authorized to view this conversation' })
    }

    res.json(conversation)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { participantId, participantIds, name, type } = req.body || {}
    const requestedParticipants = Array.isArray(participantIds) ? participantIds : participantId ? [participantId] : []
    const cleanParticipants = [...new Set([req.user.userId, ...requestedParticipants].map((id) => String(id)))]

    if (cleanParticipants.length < 2) {
      return res.status(400).json({ error: 'At least one other participant is required' })
    }

    if (cleanParticipants.some((id) => !isValidObjectId(id))) {
      return res.status(400).json({ error: 'Invalid participant id' })
    }

    if (cleanParticipants.length === 2 && (type === undefined || type === 'direct')) {
      const directKey = getDirectKey(cleanParticipants)
      const existingConversation = await Conversation.findOne({
        $or: [
          { directKey },
          { type: 'direct', participants: { $all: cleanParticipants, $size: 2 } }
        ]
      })
        .sort({ updatedAt: -1 })
        .populate(conversationPopulateOptions)

      if (existingConversation) {
        return res.json(existingConversation)
      }
    }

    const userDocuments = await User.find({ _id: { $in: cleanParticipants } }).select('_id')
    if (userDocuments.length !== cleanParticipants.length) {
      return res.status(404).json({ error: 'One or more users were not found' })
    }

    const conversation = await Conversation.create({
      participants: cleanParticipants,
      directKey: cleanParticipants.length === 2 ? getDirectKey(cleanParticipants) : '',
      type: cleanParticipants.length === 2 ? 'direct' : (type === 'group' ? 'group' : 'direct'),
      name: name?.trim() || ''
    })

    await conversation.populate(conversationPopulateOptions)
    res.status(201).json(conversation)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/:id/messages', auth, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid conversation id' })
    }

    const conversation = await Conversation.findById(req.params.id)
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    if (!ensureParticipant(conversation, req.user.userId)) {
      return res.status(403).json({ error: 'Not authorized to view this conversation' })
    }

    const messages = await Message.find({ conversationId: req.params.id })
      .sort({ createdAt: 1 })
      .populate('senderId', 'name username avatar')

    res.json(messages)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router