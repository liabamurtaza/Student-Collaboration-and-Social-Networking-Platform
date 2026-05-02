import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { getPostById, getPostLikes, likePost } from '../api/posts'
import CommentSection from '../components/CommentSection'
import Avatar from '../components/Avatar'
import PostLikesModal from '../components/PostLikesModal'
import Navbar from '../components/Navbar'
import './Feed.css'
import './PostDetail.css'

const s = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, height: 60,
    background: '#d4e6a5', borderBottom: '2.5px solid #b5cc7a',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 36px', zIndex: 100,
  },
  navLeft: { display: 'flex', alignItems: 'center', gap: 4 },
  navRight: { display: 'flex', alignItems: 'center', gap: 8 },
  logo: {
    fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900,
    fontSize: '1.35rem', color: '#1a4a1a', textDecoration: 'none', marginRight: 14,
  },
  navA: {
    textDecoration: 'none', fontWeight: 700, fontSize: '0.92rem',
    color: '#1a4a1a', padding: '6px 14px', fontFamily: "'Nunito', sans-serif",
  },
  btnOutline: {
    fontWeight: 700, fontSize: '0.88rem', color: '#1a4a1a', padding: '7px 18px',
    border: '2px solid #1a4a1a', borderRadius: 999, background: 'none',
    cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
  },
  btnFill: {
    fontWeight: 700, fontSize: '0.88rem', color: '#fff', padding: '8px 20px',
    background: '#1a4a1a', border: 'none', borderRadius: 999,
    cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
  },
}

const PostDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user, logout } = useAuth()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [likeLoading, setLikeLoading] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [likesOpen, setLikesOpen] = useState(false)
  const [likers, setLikers] = useState([])
  const [likersLoading, setLikersLoading] = useState(false)
  const [likersError, setLikersError] = useState('')

  const currentUserId = useMemo(() => {
    const token = user?.token || localStorage.getItem('token')
    if (!token) return null

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.userId || null
    } catch {
      return null
    }
  }, [user])

  const societyName = post?.societyId?.name || ''
  const societySlug = post?.societyId?.slug || ''
  const authorName = post?.userId?.name || post?.userId?.username || 'Unknown'
  const hasSocietyContext = Boolean(societyName)

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getPostById(id)
      setPost(data)
      setLikesCount(data.likes?.length || 0)
      setIsLiked(data.likes?.some((likeId) => likeId?.toString() === currentUserId) || false)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load post')
    } finally {
      setLoading(false)
    }
  }, [id, currentUserId])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleLike = async () => {
    if (!currentUserId || likeLoading || !post) return

    const nextLiked = !isLiked
    const nextLikes = nextLiked ? likesCount + 1 : Math.max(0, likesCount - 1)
    const previousLiked = isLiked
    const previousLikes = likesCount

    setIsLiked(nextLiked)
    setLikesCount(nextLikes)

    try {
      setLikeLoading(true)
      const data = await likePost(post._id)
      setLikesCount(data.likes)
      setIsLiked(data.liked)
    } catch (err) {
      setIsLiked(previousLiked)
      setLikesCount(previousLikes)
      console.error('Like failed:', err)
    } finally {
      setLikeLoading(false)
    }
  }

  const handleOpenLikes = async () => {
    if (!post) return

    setLikesOpen(true)
    if (likers.length > 0 || likersLoading) return

    try {
      setLikersLoading(true)
      setLikersError('')
      const data = await getPostLikes(post._id)
      setLikers(data)
    } catch (err) {
      setLikersError(err.response?.data?.error || 'Failed to load likes')
    } finally {
      setLikersLoading(false)
    }
  }

  return (
    <div className="feed-page d-flex flex-column min-vh-100">
      <Navbar links={[
        { to: '/feed', label: 'Feed' },
        { to: '/create-post', label: 'Create Post' },
        { to: '/societies', label: 'Societies' },
        { to: '/explore', label: 'Explore' },
        { to: '/messages', label: 'Messages' },
        { to: '/settings', label: 'Settings' },
        { to: '/about', label: 'About' },
        { to: '/contact', label: 'Contact' },
      ]} />

      <div className="feed-container post-detail-shell container-lg flex-grow-1">
        <div className="post-detail-floating" aria-hidden="true">
          <span className="post-detail-key" style={{ '--rot': '-10deg', '--delay': '0s', left: '-18%', top: '18%', background: '#f4845f' }}>P</span>
          <span className="post-detail-key" style={{ '--rot': '8deg', '--delay': '0.3s', left: '-18%', top: '58%', background: '#f6c94e' }}>O</span>
          <span className="post-detail-key" style={{ '--rot': '12deg', '--delay': '0.5s', right: '-18%', top: '22%', background: '#49c4a0' }}>S</span>
          <span className="post-detail-key" style={{ '--rot': '-6deg', '--delay': '0.7s', right: '-18%', top: '62%', background: '#7bd9c7' }}>T</span>
        </div>
        {loading && <div className="feed-status alert alert-info text-center fw-semibold">Loading post...</div>}
        {error && <div className="feed-status feed-error alert alert-danger">{error}</div>}

        {!loading && post && (
          <article className="post-detail-card card shadow-sm border-0">
            <div className="post-detail-title-row">
              <h1 className="post-detail-title">Post</h1>
              <Link to="/feed" className="post-detail-link btn btn-outline-success rounded-pill">Back to feed</Link>
            </div>

            <div className="post-detail-meta">
              <span>
                <strong>Author:</strong>{' '}
                <span className="post-detail-author-wrap">
                  <Avatar
                    src={post.societyId?.picture || post.userId?.avatar}
                    name={societyName || authorName}
                    size={30}
                    className="post-detail-avatar"
                  />
                  <span className="post-detail-author-copy">
                    {hasSocietyContext ? (
                      <Link to={`/societies/${societySlug || post.societyId?._id}`} className="profile-link-inline">
                        {societyName}
                      </Link>
                    ) : post.userId?._id ? (
                      <Link to={`/profile/${post.userId._id}`} className="profile-link-inline">
                        {authorName}
                      </Link>
                    ) : (
                      authorName
                    )}
                    {hasSocietyContext && (
                      <span className="post-detail-author-subtitle">
                        by {post.userId?._id ? (
                          <Link to={`/profile/${post.userId._id}`} className="profile-link-inline">
                            {authorName}
                          </Link>
                        ) : (
                          authorName
                        )}
                      </span>
                    )}
                  </span>
                </span>
              </span>
              <span>
                <strong>Date:</strong> {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="post-detail-body">
              {post.graphic && (
                <div className="post-graphic-wrap">
                  <img src={post.graphic} alt="Attached to post" className="post-graphic" loading="lazy" />
                </div>
              )}
              <p className="post-content">{post.content}</p>
            </div>

            <div className="post-footer d-flex flex-wrap gap-2 align-items-center">
              <button
                type="button"
                onClick={handleLike}
                className={`like-btn btn btn-sm rounded-pill ${isLiked ? 'btn-success' : 'btn-outline-success'}`}
              >
                {isLiked ? '♥' : '♡'} {likesCount}
              </button>
              <button
                type="button"
                onClick={handleOpenLikes}
                className="post-like-count-btn btn btn-sm btn-outline-secondary rounded-pill"
              >
                👥 {likesCount}
              </button>
              <span className="post-comment-count badge rounded-pill text-bg-light text-body-secondary border">💬 {post.comments?.length || 0}</span>
            </div>

            <h2 className="post-detail-comments-title">Comments</h2>
            <CommentSection
              postId={post._id}
              currentUserId={currentUserId}
              comments={post.comments || []}
              onCommentAdded={(nextComments) => setPost((prev) => prev ? { ...prev, comments: nextComments } : prev)}
            />

            <PostLikesModal
              open={likesOpen}
              loading={likersLoading}
              error={likersError}
              users={likers}
              onClose={() => setLikesOpen(false)}
            />
          </article>
        )}
      </div>
    </div>
  )
}

export default PostDetail