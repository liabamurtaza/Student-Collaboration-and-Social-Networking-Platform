import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f0f4ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 4px 40px rgba(55, 138, 221, 0.10)',
    border: '1px solid #e0eaff',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '1.8rem',
  },
  brandDot: {
    width: '32px',
    height: '32px',
    borderRadius: '9px',
    background: '#378ADD',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandDotInner: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#fff',
  },
  brandName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a2840',
    letterSpacing: '-0.01em',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f1c2e',
    marginBottom: '4px',
    letterSpacing: '-0.02em',
    fontFamily: "'Syne', sans-serif",
  },
  subheading: {
    fontSize: '13px',
    color: '#6b7a99',
    marginBottom: '1.8rem',
  },
  error: {
    background: '#fff0f0',
    border: '1px solid #ffc5c5',
    color: '#c0392b',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '13px',
    marginBottom: '1.2rem',
  },
  group: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#3a4a6b',
    marginBottom: '6px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    fontSize: '14px',
    border: '1.5px solid #dce6f5',
    borderRadius: '10px',
    outline: 'none',
    color: '#0f1c2e',
    background: '#f7faff',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
    fontFamily: "'DM Sans', sans-serif",
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    background: '#378ADD',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    marginTop: '0.5rem',
    letterSpacing: '0.01em',
    transition: 'background 0.15s, transform 0.1s',
    fontFamily: "'DM Sans', sans-serif",
  },
  buttonDisabled: {
    background: '#a0c4e8',
    cursor: 'not-allowed',
    transform: 'none',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.4rem',
    fontSize: '13px',
    color: '#6b7a99',
  },
  link: {
    color: '#378ADD',
    fontWeight: '600',
    textDecoration: 'none',
  },
  divider: {
    height: '1px',
    background: '#e8f0fb',
    margin: '1.4rem 0',
  },
}

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) return setError('Name is required')
    if (!email.trim()) return setError('Email is required')
    if (password.length < 6) return setError('Password must be at least 6 characters')

    try {
    const data = await registerUser(name, email, password);

    login(data.user, data.token); 
    navigate('/');
} catch (err) {
  setError(err.response?.data?.error || 'Registration failed. Try again.')
} finally {
  setLoading(false)
}
  }

  const inputStyle = (field) => ({
    ...styles.input,
    borderColor: focusedField === field ? '#378ADD' : '#dce6f5',
    background: focusedField === field ? '#fff' : '#f7faff',
  })

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700&family=DM+Sans:wght@400;600&display=swap" rel="stylesheet" />
      <div style={styles.page}>
        <div style={styles.card}>

          <div style={styles.brand}>
            <div style={styles.brandDot}>
              <div style={styles.brandDotInner} />
            </div>
            <span style={styles.brandName}>CampusConnect</span>
          </div>

          <h2 style={styles.heading}>Create account</h2>
          <p style={styles.subheading}>Join your academic community today</p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.group}>
              <label style={styles.label}>Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                placeholder="Ayesha Saleem"
                style={inputStyle('name')}
              />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="you@university.edu"
                style={inputStyle('email')}
              />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="Min 6 characters"
                style={inputStyle('password')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div style={styles.divider} />

          <p style={styles.footer}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>Sign in</Link>
          </p>

        </div>
      </div>
    </>
  )
}

export default Register