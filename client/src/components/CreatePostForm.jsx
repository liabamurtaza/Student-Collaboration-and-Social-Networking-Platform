import { useState } from 'react'
import api from '../api/index'

const CreatePostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!content.trim()) return
    try {
      setLoading(true)
      setError('')
      await api.post('/posts', { content })
      setContent('')
      onPostCreated()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-post-card">
      {error && <p className="post-error">{error}</p>}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        rows={3}
        className="create-post-textarea"
      />
      <div className="create-post-footer">
        <span className="char-count">{content.length} / 500</span>
        <button
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          className="btn-post"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
}

export default CreatePostForm