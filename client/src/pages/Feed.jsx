import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const Feed = () => {
	const navigate = useNavigate()
	const { user, logout } = useAuth()

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

	const posts = [
		{
			id: 1,
			author: 'john_doe',
			text: 'Welcome to the mock feed. Post creation is coming next.',
			likes: 5
		}
	]

	const handleProfileClick = () => {
		if (!currentUserId) return
		navigate(`/profile/${currentUserId}`)
	}

	const handleLogout = () => {
		logout()
		navigate('/login', { replace: true })
	}

	return (
		<div style={{ maxWidth: '700px', margin: '60px auto', padding: '1rem' }}>
			<div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
				<button onClick={handleProfileClick} disabled={!currentUserId} style={{ padding: '0.6rem 1rem' }}>
					Profile
				</button>
				<Link to="/explore" style={{ padding: '0.6rem 1rem', border: '1px solid #ccc', borderRadius: '6px', textDecoration: 'none', color: '#111' }}>
					Explore
				</Link>
				<button onClick={handleLogout} style={{ marginLeft: 'auto', padding: '0.6rem 1rem' }}>
					Logout
				</button>
			</div>

			<h2 style={{ marginBottom: '0.75rem' }}>Feed</h2>

			{posts.map((post) => (
				<div key={post.id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem', background: '#fff' }}>
					<div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>@{post.author}</div>
					<p style={{ marginBottom: '0.75rem' }}>{post.text}</p>
					<small style={{ color: '#666' }}>Likes: {post.likes}</small>
				</div>
			))}
		</div>
	)
}

export default Feed