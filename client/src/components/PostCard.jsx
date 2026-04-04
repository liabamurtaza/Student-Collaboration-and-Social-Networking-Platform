import { useState } from 'react'
import api from '../api/index'

const PostCard = ({ post, currentUserId, onDelete, onUpdate }) => {
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // like state — start from what the database already has
  const [likes, setLikes] = useState(post.likes || [])
  const isLiked = currentUserId && likes.includes(currentUserId)

  const isMyPost = post.userId?._id === currentUserId || post.userId === currentUserId

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return
    try {
      setLoading(true)
      await api.delete(`/posts/${post._id}`)
      onDelete(post._id)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!editContent.trim()) return
    try {
      setLoading(true)
      setError('')
      const res = await api.put(`/posts/${post._id}`, { content: editContent })
      onUpdate(res.data)
      setEditing(false)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!currentUserId) return  // must be logged in
    try {
      await api.put(`/posts/${post._id}/like`)
      // update likes array locally without re-fetching everything
      setLikes(prev =>
        isLiked
          ? prev.filter(id => id !== currentUserId)  // remove your ID
          : [...prev, currentUserId]                  // add your ID
      )
    } catch (err) {
      console.error('Like failed:', err)
    }
  }

  return (
    <div className="post-card">

      {/* Author and date */}
      <div className="post-header">
        <strong className="post-author">
          {post.userId?.name || post.userId?.username || 'Unknown'}
        </strong>
        <span className="post-date">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Content */}
      {editing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          rows={3}
          className="post-edit-textarea"
        />
      ) : (
        <p className="post-content">{post.content}</p>
      )}

      {error && <p className="post-error">{error}</p>}

      {/* Bottom row */}
      <div className="post-footer">

        {/* Like button */}
        <button
          onClick={handleLike}
          className={`like-btn ${isLiked ? 'liked' : ''}`}
        >
          {isLiked ? '♥' : '♡'} {likes.length}
        </button>

        {/* Edit / Delete — only on your own posts */}
        {isMyPost && (
          <div className="post-actions">
            {editing ? (
              <>
                <button onClick={handleEdit} disabled={loading} className="btn-save">
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditing(false); setEditContent(post.content) }}
                  disabled={loading}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setEditing(true)} className="btn-edit">
                  Edit
                </button>
                <button onClick={handleDelete} disabled={loading} className="btn-delete">
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PostCard