import { Link } from 'react-router-dom'
import './Home.css'

const Key = ({ letter, color, style }) => (
  <div
    className="home-key"
    style={{
      background: color,
      ...style,
    }}
  >
    {letter}
  </div>
)

const highlights = [
  {
    title: 'Study together',
    text: 'A shared space for posts, profiles, messages, and quick coordination.'
  },
  {
    title: 'Stay connected',
    text: 'Open the feed, message classmates, and keep conversations in one place.'
  },
  {
    title: 'Prototype ready',
    text: 'This landing page is intentionally simple so it can evolve later.'
  }
]

const Home = () => {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Nunito:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div className="home-page">
        <div className="home-background" />

        <nav className="home-nav">
          <Link to="/" className="home-logo">★ UNIVERSE</Link>
          <div className="home-nav-links">
            <Link to="/about" className="home-nav-link">About</Link>
            <Link to="/contact" className="home-nav-link">Contact</Link>
            <Link to="/login" className="home-nav-button">Log In</Link>
            <Link to="/register" className="home-nav-outline">Sign Up</Link>
          </div>
        </nav>

        <div className="home-floating" aria-hidden="true">
          <Key letter="H" color="#f4845f" style={{ left: '0.5%', top: '18%' }} />
          <Key letter="O" color="#f6c94e" style={{ left: '1.5%', top: '70%' }} />
          <Key letter="M" color="#5b9af5" style={{ right: '1.5%', top: '22%' }} />
          <Key letter="E" color="#49c4a0" style={{ right: '0.5%', top: '68%' }} />
        </div>

        <main className="home-shell">
          <section className="home-hero">
            <div className="home-badge">Student Collaboration Platform</div>
            <h1>UNIVERSE</h1>
            <p className="home-lead">
              A lightweight campus network for posts, messages, and class connections.
              Jump into the feed, explore classmates, and build your campus presence.
            </p>

            <div className="home-actions">
              <Link to="/login" className="home-btn home-btn-primary">
                Login
              </Link>
              <Link to="/register" className="home-btn home-btn-secondary">
                Register
              </Link>
            </div>

            <div className="home-pills" aria-label="Platform highlights">
              <span>Feed</span>
              <span>Messages</span>
              <span>Profiles</span>
              <span>Explore</span>
            </div>
          </section>

          <aside className="home-showcase">
            <div className="home-showcase-card home-showcase-main">
              <div className="home-showcase-topline">Live preview</div>
              <h2>Classmates, posts, and conversations in one place</h2>
              <p>
                This mockup gives users a clear entry point while the richer experience is built out later.
              </p>

              <div className="home-mock-feed">
                <div className="home-mock-row">
                  <div className="home-mock-avatar">A</div>
                  <div>
                    <strong>Alex</strong>
                    <span>shared a project update</span>
                  </div>
                </div>
                <div className="home-mock-row">
                  <div className="home-mock-avatar home-mock-avatar-alt">M</div>
                  <div>
                    <strong>Mina</strong>
                    <span>sent a message about study group notes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="home-grid">
              {highlights.map((item, index) => (
                <div
                  key={item.title}
                  className={`home-showcase-card home-mini-card${index === 2 ? ' home-mini-card-wide' : ''}`}
                >
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </aside>
        </main>
      </div>
    </>
  )
}

export default Home