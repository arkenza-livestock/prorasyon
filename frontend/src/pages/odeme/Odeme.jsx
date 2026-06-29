import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router-dom'

export default function Odeme() {
  const { profile, signOut } = useAuth()
  const daysLeft = profile?.plan_expires_at
    ? Math.ceil((new Date(profile.plan_expires_at) - new Date()) / 86400000)
    : null

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a1f0a,#1a3d1a)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', borderRadius: 24, padding: '40px 32px', width: '100%', maxWidth: 480, textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔒</div>
        <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 900, marginBottom: 8 }}>
          {daysLeft !== null && daysLeft < 0 ? 'Planınız Sona Erdi' : 'Pro Plana Geçin'}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 28, lineHeight: 1.7 }}>
          {daysLeft !== null && daysLeft < 0
            ? 'Kullanımınız askıya alındı. Devam etmek için Pro plana geçin.'
            : 'Tüm özelliklere erişmek için Pro plana geçin.'}
        </p>
        <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 16, padding: '20px', marginBottom: 24 }}>
          <div style={{ color: '#4ade80', fontSize: '2rem', fontWeight: 900 }}>₺299 / ay</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '.85rem', marginTop: 4 }}>30 günlük plan</div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Sınırsız çiftlik ve grup','Rasyon hesaplama','Tartım takibi','Kâr analizi','Word/Excel raporlar'].map(f => (
              <div key={f} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '.85rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#4ade80' }}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>
        <button style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: '#22c55e', color: '#fff', fontSize: '1rem', fontWeight: 800, cursor: 'pointer', marginBottom: 12 }}
          onClick={() => alert('Ödeme sistemi yakında aktif olacak.')}>
          Pro Plana Geç — ₺299/ay
        </button>
        <button onClick={signOut} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '.8rem', cursor: 'pointer' }}>
          Çıkış Yap
        </button>
      </div>
    </div>
  )
}