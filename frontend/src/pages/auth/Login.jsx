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
    options: {
      redirectTo: `${window.location.origin}/app/panel`
    }
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
      setError('Mail gönderilemedi. E-posta adresinizi kontrol edin.')
    } finally {
      setLoading(false)
    }
  }

  if (forgotSent) return (
    <div style={s.page}>
      <div style={s.box}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>📧</div>
        <h2 style={{ color: '#163a27', marginBottom: 8 }}>Mail Gönderildi</h2>
        <p style={{ color: '#6b7280', marginBottom: 20 }}>
          {email} adresine şifre sıfırlama bağlantısı gönderildi. Gelen kutunuzu kontrol edin.
        </p>
        <button onClick={() => { setForgotMode(false); setForgotSent(false) }}
          className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          Giriş Sayfasına Dön
        </button>
      </div>
    </div>
  )

  if (forgotMode) return (
    <div style={s.page}>
      <div style={s.box}>
        <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔑</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#163a27', marginBottom: 4 }}>Şifremi Unuttum</h1>
        <p style={{ color: '#6b7280', fontSize: '.85rem', marginBottom: 24 }}>E-posta adresinize sıfırlama bağlantısı gönderilecek.</p>
        <form onSubmit={handleForgot}>
          <div className="form-group">
            <label>E-posta</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="isletme@ornek.com" required autoFocus />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            {loading ? 'Gönderiliyor...' : 'Sıfırlama Maili Gönder'}
          </button>
        </form>
        <p style={{ marginTop: 16, textAlign: 'center', fontSize: '.85rem', color: '#6b7280' }}>
          <button onClick={() => setForgotMode(false)}
            style={{ background: 'none', border: 'none', color: '#22663a', fontWeight: 700, cursor: 'pointer' }}>
            ← Giriş sayfasına dön
          </button>
        </p>
      </div>
    </div>
  )

  return (
    <div style={s.page}>
      <div style={s.box}>
        <div style={s.logo}>🌾</div>
        <h1 style={s.title}>ProRasyon</h1>
        <p style={s.sub}>Akıllı Besi Yönetimi</p>
        <form onSubmit={handleSubmit} style={{ marginTop: 28 }}>
          <div className="form-group">
            <label>E-posta</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="isletme@ornek.com" required autoFocus />
          </div>
          <div className="form-group">
            <label>Şifre</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required />
          </div>
          <div style={{ textAlign: 'right', marginTop: -8, marginBottom: 12 }}>
            <button type="button" onClick={() => setForgotMode(true)}
              style={{ background: 'none', border: 'none', color: '#22663a', fontSize: '.82rem', fontWeight: 700, cursor: 'pointer' }}>
              Şifremi Unuttum
            </button>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
<div style={{ margin: '16px 0', textAlign: 'center', color: '#9ca3af', fontSize: '.8rem' }}>— veya —</div>
<button type="button" onClick={handleGoogle}
  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px', borderRadius: 12, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: '.9rem', fontWeight: 700, color: '#374151' }}>
  <img src="https://www.google.com/favicon.ico" width={18} height={18} alt="Google" />
  Google ile Giriş Yap
</button>
        <p style={s.footer}>
          Hesabınız yok mu?{' '}
          <Link to="/kayit" style={{ color: '#22663a', fontWeight: 700 }}>Kayıt Ol</Link>
        </p>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#eef2e8,#d4e8ca)', padding: 16 },
  box: { background: '#fff', borderRadius: 24, padding: '36px 32px', width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,.12)', textAlign: 'center' },
  logo: { fontSize: '2.8rem', marginBottom: 8 },
  title: { fontSize: '1.8rem', fontWeight: 900, color: '#163a27' },
  sub: { color: '#6b7280', fontSize: '.9rem', marginTop: 4 },
  footer: { marginTop: 20, color: '#6b7280', fontSize: '.85rem' },
}