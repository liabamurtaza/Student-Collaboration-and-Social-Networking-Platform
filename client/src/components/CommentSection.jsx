import { useState } from 'react'
import api from '../api/index'

const CommentSection = ({ postId, currentUserId, comments = [], onCommentAdded }) => {
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!currentUserId || !commentText.trim() || loading) return

    try {
      setLoading(true)
      setError('')
      const res = await api.post(`/posts/${postId}/comments`, { content: commentText })
      onCommentAdded?.(res.data.comments || [])
      setCommentText('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add comment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="post-comment-section">
      {comments.length > 0 && (
        <div className="post-comments">
          {comments.map((comment) => (
            <div key={comment._id} className="post-comment">
              <div className="post-comment-author">
                {comment.userId?.name || comment.userId?.username || 'Unknown'}
              </div>
              <div className="post-comment-text">{comment.content}</div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="post-error">{error}</p>}

      {currentUserId && (
        <form className="post-comment-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Write a comment..."
            className="post-comment-input"
            maxLength={280}
          />
          <button
            type="submit"
            disabled={loading || !commentText.trim()}
            className="post-comment-btn"
          >
            {loading ? 'Posting...' : 'Comment'}
          </button>
        </form>
      )}
    </div>
  )
}

export default CommentSection