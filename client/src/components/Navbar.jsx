import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Navbar.css'
import { useAuth } from '../context/useAuth'

const Navbar = ({
	brand = '★ UNIVERSE',
	brandTo = '/',
	links = [],
	rightContent = null,
	className = '',
	containerClassName = '',
}) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const { user, logout } = useAuth()
	const navigate = useNavigate()
	const isLoggedIn = Boolean(user?.token || localStorage.getItem('token'))
	const currentUserId = (() => {
		const token = user?.token || localStorage.getItem('token')
		if (!token) return null
		try {
			return JSON.parse(atob(token.split('.')[1])).userId || null
		} catch {
			return null
		}
	})()

	useEffect(() => {
		setIsMenuOpen(false)
	}, [])

	const defaultRightContent = isLoggedIn ? (
		<>
			<button
				type="button"
				className="app-navbar__action btn btn-outline-success rounded-pill"
				onClick={() => currentUserId && navigate(`/profile/${currentUserId}`)}
				disabled={!currentUserId}
			>
				Profile
			</button>
			<button
				type="button"
				className="app-navbar__action btn btn-success rounded-pill"
				onClick={() => {
					logout()
					navigate('/login', { replace: true })
				}}
			>
				Logout
			</button>
		</>
	) : (
		<>
			<NavLink to="/login" className={({ isActive }) => `app-navbar__action btn btn-outline-success rounded-pill${isActive ? ' active' : ''}`}>
				Log In
			</NavLink>
			<NavLink to="/register" className={({ isActive }) => `app-navbar__action btn btn-success rounded-pill${isActive ? ' active' : ''}`}>
				Sign Up
			</NavLink>
		</>
	)

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
	const closeMenu = () => setIsMenuOpen(false)

	return (
		<>
			<nav className={`app-navbar navbar navbar-expand-lg ${className}`.trim()} role="navigation">
				<div className={`app-navbar__inner container-fluid ${containerClassName}`.trim()}>
					<Link to={brandTo} className="app-navbar__brand navbar-brand" onClick={closeMenu}>
						{brand}
					</Link>

					<button
						className="app-navbar__toggle"
						onClick={toggleMenu}
						aria-label="Toggle navigation"
						aria-expanded={isMenuOpen}
					>
						<span className="app-navbar__toggle-icon" />
						<span className="app-navbar__toggle-icon" />
						<span className="app-navbar__toggle-icon" />
					</button>

					<div className={`app-navbar__links ${isMenuOpen ? 'active' : ''}`}>
						{links.map((link) => (
							<NavLink
								key={link.to}
								to={link.to}
								end={link.end}
								className={({ isActive }) => `app-navbar__link btn btn-link text-decoration-none${isActive ? ' active' : ''}`}
								onClick={closeMenu}
							>
								{link.label}
							</NavLink>
						))}
					</div>

					<div className={`app-navbar__actions ${isMenuOpen ? 'active' : ''}`}>
						{rightContent || defaultRightContent}
					</div>
				</div>
			</nav>

			{isMenuOpen && <div className="app-navbar__overlay" onClick={closeMenu} />}
		</>
	)
}

export default Navbar
