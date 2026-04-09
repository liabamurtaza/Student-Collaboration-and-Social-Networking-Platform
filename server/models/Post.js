const mongoose = require('mongoose');
const commentSchema = require('./Comment');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, default: '' },
  graphic: { type: String, default: null },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: { type: [commentSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);