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
    <div className="create-post-card card shadow-sm border-0">
      {error && <div className="alert alert-danger py-2 px-3 mb-3 post-error">{error}</div>}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        rows={3}
        className="create-post-textarea form-control"
      />
      <div className="create-post-footer d-flex align-items-center justify-content-between gap-3 flex-wrap">
        <span className="char-count text-secondary small fw-semibold">{content.length} / 500</span>
        <button
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
          className="btn-post btn btn-success rounded-pill px-4"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
}

export default CreatePostForm