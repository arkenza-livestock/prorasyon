import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/app/panel')
    } catch (err) {
      setError('E-posta veya şifre hatalı.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.box}>
        <div style={styles.logo}>🌾</div>
        <h1 style={styles.title}>ProRasyon</h1>
        <p style={styles.sub}>Akıllı Besi Yönetimi</p>

        <form onSubmit={handleSubmit} style={{ marginTop: 28 }}>
          <div className="form-group">
            <label>E-posta</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="isletme@ornek.com" required autoFocus />
          </div>
          <div className="form-group">
            <label>Şifre</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
              placeholder="••••••••" required />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '12px' }}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p style={styles.footer}>
          Hesabınız yok mu?{' '}
          <Link to="/kayit" style={{ color: '#22663a', fontWeight: 700 }}>Kayıt Ol</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg,#eef2e8,#d4e8ca)',
    padding: 16,
  },
  box: {
    background: '#fff', borderRadius: 24, padding: '36px 32px',
    width: '100%', maxWidth: 400,
    boxShadow: '0 20px 60px rgba(0,0,0,.12)',
    textAlign: 'center',
  },
  logo: { fontSize: '2.8rem', marginBottom: 8 },
  title: { fontSize: '1.8rem', fontWeight: 900, color: '#163a27' },
  sub: { color: '#6b7280', fontSize: '.9rem', marginTop: 4 },
  footer: { marginTop: 20, color: '#6b7280', fontSize: '.85rem' },
}
