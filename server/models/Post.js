const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caption: { type: String, default: '' },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  graphic: { type: String, default: null },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ 
    type: mongoose.Schema.Types.ObjectId,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now } , ref: 'Comment' }]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);