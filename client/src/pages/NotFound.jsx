import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Key = ({ letter, color, style }) => (
	<div
		style={{
			position: 'absolute',
			width: 64,
			height: 64,
			borderRadius: 16,
			background: color,
			border: '3px solid #111',
			boxShadow: '4px 4px 0 #111',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			fontFamily: "'Playfair Display', Georgia, serif",
			fontWeight: 900,
			fontSize: '1.9rem',
			color: '#111',
			userSelect: 'none',
			pointerEvents: 'none',
			animation: 'floatKey 3.2s ease-in-out infinite',
			...style,
		}}
	>
		{letter}
	</div>
)

const NotFound = () => {
	const navigate = useNavigate()

	const s = {
		page: {
			minHeight: '100vh',
			background: '#eef3e2',
			backgroundImage:
				'linear-gradient(#c8d8a0 1px,transparent 1px),linear-gradient(90deg,#c8d8a0 1px,transparent 1px)',
			backgroundSize: '24px 24px',
			fontFamily: "'Nunito', sans-serif",
			display: 'flex',
			flexDirection: 'column',
		},
		nav: {
			background: '#d4e6a5',
			borderBottom: '2.5px solid #b5cc7a',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '0 36px',
			height: 60,
			flexShrink: 0,
		},
		logo: {
			fontFamily: "'Playfair Display', Georgia, serif",
			fontWeight: 900,
			fontSize: '1.35rem',
			color: '#1a4a1a',
			textDecoration: 'none',
		},
		navLinks: {
			display: 'flex',
			alignItems: 'center',
			gap: 8,
		},
		navA: {
			textDecoration: 'none',
			fontWeight: 700,
			fontSize: '0.92rem',
			color: '#1a4a1a',
			padding: '6px 14px',
		},
		navBtn: {
			fontWeight: 700,
			fontSize: '0.88rem',
			color: '#fff',
			padding: '8px 20px',
			background: '#1a4a1a',
			border: 'none',
			borderRadius: 999,
			cursor: 'pointer',
			fontFamily: "'Nunito', sans-serif",
		},
		body: {
			flex: 1,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			padding: '40px 20px 70px',
			position: 'relative',
		},
		shell: {
			width: '100%',
			maxWidth: 980,
			display: 'grid',
			gridTemplateColumns: '1.1fr 0.9fr',
			gap: 20,
			zIndex: 2,
		},
		card: {
			background: '#f9faf4',
			borderRadius: 22,
			border: '2.5px solid #1a4a1a',
			borderTop: '7px solid #f6c94e',
			boxShadow: '0 8px 36px rgba(0,0,0,0.12)',
			padding: '30px 30px 26px',
			animation: 'riseIn 0.5s ease both',
		},
		headline: {
			fontFamily: "'Playfair Display', Georgia, serif",
			fontWeight: 900,
			fontSize: '2.5rem',
			color: '#1a4a1a',
			marginBottom: 6,
		},
		sub: {
			color: '#6a8f4a',
			fontSize: '1rem',
			fontWeight: 700,
			marginBottom: 18,
		},
		big: {
			fontFamily: "'Playfair Display', Georgia, serif",
			fontWeight: 900,
			fontSize: '4.5rem',
			color: '#1a4a1a',
			lineHeight: 1,
			marginBottom: 8,
		},
		actions: { display: 'flex', gap: 10, flexWrap: 'wrap' },
		btnPrimary: {
			background: '#1a4a1a',
			color: '#fff',
			border: 'none',
			borderRadius: 999,
			padding: '10px 22px',
			fontWeight: 800,
			fontSize: '0.9rem',
			cursor: 'pointer',
			textDecoration: 'none',
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		btnOutline: {
			background: 'none',
			color: '#1a4a1a',
			border: '2px solid #1a4a1a',
			borderRadius: 999,
			padding: '9px 20px',
			fontWeight: 800,
			fontSize: '0.9rem',
			cursor: 'pointer',
			textDecoration: 'none',
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		sideCard: {
			background: 'linear-gradient(145deg, #f0f7e8, #e8f5d0)',
			borderRadius: 22,
			border: '2.5px solid #1a4a1a',
			borderTop: '7px solid #43a047',
			boxShadow: '0 8px 36px rgba(0,0,0,0.12)',
			padding: '26px 26px 22px',
			animation: 'riseIn 0.5s ease both',
			animationDelay: '0.08s',
		},
		list: { margin: '10px 0 0', paddingLeft: 18, color: '#1a4a1a', fontWeight: 700 },
	}

	return (
		<>
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link
				href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Nunito:wght@400;600;700;800&display=swap"
				rel="stylesheet"
			/>

			<style>{`
				@keyframes floatKey {
					0%,100% { transform: translateY(0); }
					50% { transform: translateY(-7px); }
				}
				@keyframes riseIn {
					from { opacity: 0; transform: translateY(10px); }
					to { opacity: 1; transform: translateY(0); }
				}
				@media (max-width: 900px) {
					.nf-shell { grid-template-columns: 1fr !important; }
				}
			`}</style>

			<div style={s.page}>
				<Navbar links={[
					{ to: '/feed', label: 'Feed' },
					{ to: '/explore', label: 'Explore' },
				]} />

				<div style={s.body}>
					<Key letter="4" color="#f4845f" style={{ left: '7%', top: '15%' }} />
					<Key letter="0" color="#f6c94e" style={{ left: '10%', top: '52%' }} />
					<Key letter="4" color="#5b9af5" style={{ right: '9%', top: '20%' }} />
					<Key letter="?" color="#49c4a0" style={{ right: '7%', top: '62%' }} />

					<div style={s.shell} className="nf-shell">
						<div style={s.card}>
							<div style={s.big}>404</div>
							<div style={s.headline}>Page Missing</div>
							<div style={s.sub}>
								The page you are looking for went off-grid. Let us get you back on track.
							</div>
							<div style={s.actions}>
								<Link to="/" style={s.btnPrimary}>Go Home</Link>
								<Link to="/feed" style={s.btnOutline}>Open Feed</Link>
							</div>
						</div>

						<div style={s.sideCard}>
							<div style={s.headline}>Try these instead</div>
							<div style={s.sub}>Popular spots around campus:</div>
							<ul style={s.list}>
								<li>Create a fresh post</li>
								<li>See new societies</li>
								<li>Jump into messages</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default NotFound