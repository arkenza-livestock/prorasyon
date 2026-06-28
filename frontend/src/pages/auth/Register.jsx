import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', companyName: '', email: '', password: '', password2: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.password2) { setError('Şifreler eşleşmiyor.'); return }
    if (form.password.length < 6) { setError('Şifre en az 6 karakter olmalı.'); return }
    setLoading(true)
    try {
      await signUp(form.email, form.password, form.fullName, form.companyName)
      setDone(true)
    } catch (err) {
      setError(err.message || 'Kayıt başarısız.')
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div style={styles.page}>
      <div style={styles.box}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
        <h2 style={{ color: '#163a27', marginBottom: 8 }}>Kayıt Tamamlandı</h2>
        <p style={{ color: '#6b7280', marginBottom: 20 }}>
          E-posta adresinize doğrulama bağlantısı gönderildi. Onayladıktan sonra giriş yapabilirsiniz.
        </p>
        <Link to="/giris" className="btn btn-primary" style={{ display: 'inline-flex', justifyContent: 'center' }}>
          Giriş Sayfasına Git
        </Link>
      </div>
    </div>
  )

  return (
    <div style={styles.page}>
      <div style={styles.box}>
        <div style={{ fontSize: '2.4rem', marginBottom: 6 }}>🌾</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#163a27', marginBottom: 4 }}>ProRasyon'a Kayıt Ol</h1>
        <p style={{ color: '#6b7280', fontSize: '.85rem', marginBottom: 24 }}>İşletme bilgilerinizi girin</p>

        <form onSubmit={handleSubmit}>
          <div className="input-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Ad Soyad</label>
              <input value={form.fullName} onChange={set('fullName')} placeholder="Ahmet Yılmaz" required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>İşletme Adı</label>
              <input value={form.companyName} onChange={set('companyName')} placeholder="Yılmaz Çiftliği" required />
            </div>
          </div>
          <div className="form-group">
            <label>E-posta</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="isletme@ornek.com" required />
          </div>
          <div className="input-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Şifre</label>
              <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Şifre Tekrar</label>
              <input type="password" value={form.password2} onChange={set('password2')} placeholder="••••••••" required />
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '12px' }}>
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p style={{ marginTop: 18, color: '#6b7280', fontSize: '.85rem', textAlign: 'center' }}>
          Zaten hesabınız var mı?{' '}
          <Link to="/giris" style={{ color: '#22663a', fontWeight: 700 }}>Giriş Yap</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg,#eef2e8,#d4e8ca)', padding: 16,
  },
  box: {
    background: '#fff', borderRadius: 24, padding: '32px 28px',
    width: '100%', maxWidth: 480,
    boxShadow: '0 20px 60px rgba(0,0,0,.12)',
  },
}
