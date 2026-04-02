import axios from 'axios'

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

// Get all posts
export const getPosts = () =>
  axios.get('/api/posts').then(res => res.data)

// Get single post
export const getPost = (id) =>
  axios.get(`/api/posts/${id}`).then(res => res.data)

// Create a new post
export const createPost = (content) =>
  axios.post('/api/posts', { content }, authHeader()).then(res => res.data)

// Edit a post
export const updatePost = (id, content) =>
  axios.put(`/api/posts/${id}`, { content }, authHeader()).then(res => res.data)

// Delete a post
export const deletePost = (id) =>
  axios.delete(`/api/posts/${id}`, authHeader()).then(res => res.data)