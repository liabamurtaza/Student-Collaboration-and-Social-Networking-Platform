const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    directKey: { type: String, default: '' },
    type: {
      type: String,
      enum: ['direct', 'group'],
      default: 'direct'
    },
    name: { type: String, default: '' },
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null }
  },
  { timestamps: true }
)

conversationSchema.index({ participants: 1 })
conversationSchema.index({ directKey: 1 }, { unique: true, sparse: true })

module.exports = mongoose.model('Conversation', conversationSchema)