import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)

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

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `https://prorasyon.vercel.app/app/panel` }
    })
    if (error) setError('Google ile giriş başarısız.')
  }

  async function handleForgot(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/sifre-sifirla`,
      })
      if (error) throw error
      setForgotSent(true)
    } catch (err) {
      setError('Mail gönderilemedi.')
    } finally {
      setLoading(false)
    }
  }

  if (forgotSent) return (
    <div style={s.page}>
      <Link to="/" style={s.back}>← Ana Sayfa</Link>
      <div style={s.box}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>📧</div>
        <h2 style={{ color: '#fff', marginBottom: 8 }}>Mail Gönderildi</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 20 }}>{email} adresine şifre sıfırlama bağlantısı gönderildi.</p>
        <button onClick={() => { setForgotMode(false); setForgotSent(false) }} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Giriş Sayfasına Dön</button>
      </div>
    </div>
  )

  if (forgotMode) return (
    <div style={s.page}>
      <Link to="/" style={s.back}>← Ana Sayfa</Link>
      <div style={s.box}>
        <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔑</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#163a27', marginBottom: 4 }}>Şifremi Unuttum</h1>
        <p style={{ color: '#6b7280', fontSize: '.85rem', marginBottom: 24 }}>E-posta adresinize sıfırlama bağlantısı gönderilecek.</p>
        <form onSubmit={handleForgot}>
          <div className="form-group">
            <label>E-posta</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="isletme@ornek.com" required autoFocus />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            {loading ? 'Gönderiliyor...' : 'Sıfırlama Maili Gönder'}
          </button>
        </form>
        <p style={{ marginTop: 16, textAlign: 'center', fontSize: '.85rem' }}>
          <button onClick={() => setForgotMode(false)} style={{ background: 'none', border: 'none', color: '#22663a', fontWeight: 700, cursor: 'pointer' }}>← Giriş sayfasına dön</button>
        </p>
      </div>
    </div>
  )

  return (
    <div style={s.page}>
      <Link to="/" style={s.back}>← Ana Sayfa</Link>
      <div style={s.box}>
        <div style={s.logo}>🌾</div>
        <h1 style={s.title}>ProRasyon</h1>
        <p style={s.sub}>Akıllı Besi Yönetimi</p>
        <form onSubmit={handleSubmit} style={{ marginTop: 28 }}>
          <div className="form-group">
            <label>E-posta</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="isletme@ornek.com" required autoFocus />
          </div>
          <div className="form-group">
            <label>Şifre</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <div style={{ textAlign: 'right', marginTop: -8, marginBottom: 12 }}>
            <button type="button" onClick={() => setForgotMode(true)} style={{ background: 'none', border: 'none', color: '#4ade80', fontSize: '.82rem', fontWeight: 700, cursor: 'pointer' }}>Şifremi Unuttum</button>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
        <div style={{ margin: '16px 0', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '.8rem' }}>— veya —</div>
        <button type="button" onClick={handleGoogle} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: '.9rem', fontWeight: 700, color: '#fff' }}>
          <img src="https://www.google.com/favicon.ico" width={18} height={18} alt="Google" />
          Google ile Giriş Yap
        </button>
        <p style={s.footer}>Hesabınız yok mu? <Link to="/kayit" style={{ color: '#4ade80', fontWeight: 700 }}>Kayıt Ol</Link></p>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0a1f0a 0%,#1a3d1a 50%,#0f2d0f 100%)', padding: 16, position: 'relative' },
  box: { background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', borderRadius: 24, padding: '36px 32px', width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,.4)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' },
  logo: { fontSize: '2.8rem', marginBottom: 8 },
  title: { fontSize: '1.8rem', fontWeight: 900, color: '#fff' },
  sub: { color: 'rgba(255,255,255,0.6)', fontSize: '.9rem', marginTop: 4 },
  footer: { marginTop: 20, color: 'rgba(255,255,255,0.5)', fontSize: '.85rem' },
  back: { position: 'absolute', top: 20, left: 20, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 },
}