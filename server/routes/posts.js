const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const auth = require('../middleware/auth')

// GET /api/posts — get all posts, newest first, with author name
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name')
    res.json(posts)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/posts/:id — get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId', 'name')
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json(post)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/posts — create a post (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body
    if (!content || !content.trim())
      return res.status(400).json({ error: 'Content is required' })

    const post = new Post({ userId: req.user.id, content })
    await post.save()

    // populate author name before sending back
    await post.populate('userId', 'name')
    res.status(201).json(post)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/posts/:id — edit a post (only owner)
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ error: 'Post not found' })

    if (post.userId.toString() !== req.user.id)
      return res.status(403).json({ error: 'You can only edit your own posts' })

    const { content } = req.body
    if (!content || !content.trim())
      return res.status(400).json({ error: 'Content is required' })

    post.content = content
    await post.save()
    await post.populate('userId', 'name')
    res.json(post)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/posts/:id — delete a post (only owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ error: 'Post not found' })

    if (post.userId.toString() !== req.user.id)
      return res.status(403).json({ error: 'You can only delete your own posts' })

    await post.deleteOne()
    res.json({ message: 'Post deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router