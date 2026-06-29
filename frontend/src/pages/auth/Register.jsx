import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', companyName: '', email: '', phone: '', password: '', password2: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.password2) { setError('Sifreler eslesmiyor.'); return }
    if (form.password.length < 6) { setError('Sifre en az 6 karakter olmali.'); return }
    setLoading(true)
    try {
      await signUp(form.email, form.password, form.fullName, form.companyName, form.phone)
      setDone(true)
    } catch (err) {
      setError(err.message || 'Kayit basarisiz.')
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div style={s.page}>
      <Link to="/" style={s.back}>← Ana Sayfa</Link>
      <div style={s.box}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
        <h2 style={{ color: '#fff', marginBottom: 8 }}>Kayit Tamamlandi</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>
          E-posta adresinize dogrulama baglantisi gonderildi. Onayladiktan sonra giris yapabilirsiniz.
        </p>
        <Link to="/giris" className="btn btn-primary" style={{ display: 'inline-flex', justifyContent: 'center', width: '100%' }}>
          Giris Sayfasina Git
        </Link>
      </div>
    </div>
  )

  return (
    <div style={s.page}>
      <Link to="/" style={s.back}>← Ana Sayfa</Link>
      <div style={s.box}>
        <div style={{ fontSize: '2.4rem', marginBottom: 6 }}>🌾</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', marginBottom: 4 }}>ProRasyon'a Uye Ol</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '.85rem', marginBottom: 24 }}>Isletme bilgilerinizi girin</p>

        <form onSubmit={handleSubmit}>
          <div className="input-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={s.label}>Ad Soyad</label>
              <input value={form.fullName} onChange={set('fullName')} placeholder="Ahmet Yilmaz" required style={s.input} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={s.label}>Isletme Adi</label>
              <input value={form.companyName} onChange={set('companyName')} placeholder="Yilmaz Ciftligi" required style={s.input} />
            </div>
          </div>
          <div className="input-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={s.label}>E-posta</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="isletme@ornek.com" required style={s.input} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={s.label}>Telefon</label>
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="05XX XXX XX XX" required style={s.input} />
            </div>
          </div>
          <div className="input-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={s.label}>Sifre</label>
              <input type="password" value={form.password} onChange={set('password')} placeholder="********" required style={s.input} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={s.label}>Sifre Tekrar</label>
              <input type="password" value={form.password2} onChange={set('password2')} placeholder="********" required style={s.input} />
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '12px' }}>
            {loading ? 'Kaydediliyor...' : 'Uye Ol'}
          </button>
        </form>

        <p style={{ marginTop: 18, color: 'rgba(255,255,255,0.5)', fontSize: '.85rem', textAlign: 'center' }}>
          Zaten hesabiniz var mi?{' '}
          <Link to="/giris" style={{ color: '#4ade80', fontWeight: 700 }}>Giris Yap</Link>
        </p>
      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg,#0a1f0a 0%,#1a3d1a 50%,#0f2d0f 100%)',
    padding: 16, position: 'relative',
  },
  box: {
    background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)',
    borderRadius: 24, padding: '32px 28px',
    width: '100%', maxWidth: 480,
    boxShadow: '0 20px 60px rgba(0,0,0,.4)',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  back: { position: 'absolute', top: 20, left: 20, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 },
  label: { display: 'block', fontSize: '.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 5 },
  input: { width: '100%', borderRadius: 10, padding: '9px 13px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '.85rem' },
}
