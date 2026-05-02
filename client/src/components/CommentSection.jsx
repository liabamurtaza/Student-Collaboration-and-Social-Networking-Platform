import { Link } from 'react-router-dom'
import { useState } from 'react'
import api from '../api/index'
import Avatar from './Avatar'

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
    <div className="post-comment-section mt-3">
      {comments.length > 0 && (
        <div className="post-comments d-grid gap-2">
          {comments.map((comment) => (
            <div key={comment._id} className="post-comment d-flex align-items-start gap-2 p-2 rounded-3 border bg-white">
              <Avatar
                src={comment.userId?.avatar}
                name={comment.userId?.name || comment.userId?.username}
                size={28}
                className="post-comment-avatar flex-shrink-0"
              />
              <div className="post-comment-body flex-grow-1">
                <div className="post-comment-author fw-semibold small">
                  {comment.userId?._id ? (
                    <Link to={`/profile/${comment.userId._id}`} className="profile-link-inline">
                      {comment.userId?.name || comment.userId?.username || 'Unknown'}
                    </Link>
                  ) : (
                    comment.userId?.name || comment.userId?.username || 'Unknown'
                  )}
                </div>
                <div className="post-comment-text small text-body-secondary">{comment.content}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="post-error">{error}</p>}

      {currentUserId && (
        <form className="post-comment-form d-flex gap-2 align-items-center mt-3" onSubmit={handleSubmit}>
          <input
            type="text"
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Write a comment..."
            className="post-comment-input form-control"
            maxLength={280}
          />
          <button
            type="submit"
            disabled={loading || !commentText.trim()}
            className="post-comment-btn btn btn-primary rounded-pill px-4 flex-shrink-0"
          >
            {loading ? 'Posting...' : 'Comment'}
          </button>
        </form>
      )}
    </div>
  )
}

export default CommentSection