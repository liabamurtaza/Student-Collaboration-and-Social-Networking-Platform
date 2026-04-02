const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const auth = require('../middleware/auth')

// PUT /api/posts/:id/like — toggle like
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ error: 'Post not found' })

    const userId = req.user.userId
    const alreadyLiked = post.likes.includes(userId)

    if (alreadyLiked) {
      await post.updateOne({ $pull: { likes: userId } })
      res.json({ message: 'Post unliked', liked: false, likes: post.likes.length - 1 })
    } else {
      await post.updateOne({ $push: { likes: userId } })
      res.json({ message: 'Post liked', liked: true, likes: post.likes.length + 1 })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router