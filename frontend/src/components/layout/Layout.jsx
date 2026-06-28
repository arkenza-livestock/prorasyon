import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useState } from 'react'

const navItems = [
  { to: '/panel',    icon: '🏠', label: 'Genel Durum'   },
  { to: '/rasyon',   icon: '🐄', label: 'Rasyon'         },
  { to: '/tartim',   icon: '⚖️', label: 'Tartım Kayıtları'},
  { to: '/gider',    icon: '🧾', label: 'Gider Defteri'  },
  { to: '/kar',      icon: '📈', label: 'Kâr Analizi'    },
  { to: '/raporlar', icon: '📄', label: 'Raporlar'        },
]

export default function Layout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/giris')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: 'linear-gradient(180deg,#163a27,#1f5130)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 100, boxShadow: '4px 0 20px rgba(0,0,0,.15)',
        overflowY: 'auto'
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#fff', letterSpacing: '-0.5px' }}>
            🌾 ProRasyon
          </div>
          <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.5)', marginTop: 2 }}>
            Akıllı Besi Yönetimi
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px' }}>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 12,
                marginBottom: 2, textDecoration: 'none',
                fontSize: '.85rem', fontWeight: 600,
                color: isActive ? '#fff' : 'rgba(255,255,255,.65)',
                background: isActive ? 'rgba(255,255,255,.15)' : 'transparent',
                transition: '.15s'
              })}>
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          {profile?.role === 'admin' && (
            <NavLink to="/admin"
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 12,
                marginTop: 8, marginBottom: 2, textDecoration: 'none',
                fontSize: '.85rem', fontWeight: 600,
                color: isActive ? '#fff' : 'rgba(255,255,255,.65)',
                background: isActive ? 'rgba(255,255,255,.15)' : 'transparent',
                borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 14
              })}>
              <span>⚙️</span> Admin Panel
            </NavLink>
          )}
        </nav>

        {/* User info */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.5)', marginBottom: 4 }}>Giriş yapan</div>
          <div style={{ fontSize: '.82rem', color: '#fff', fontWeight: 700, marginBottom: 10, wordBreak: 'break-all' }}>
            {profile?.full_name || profile?.email || '—'}
          </div>
          <button onClick={handleSignOut}
            style={{ width: '100%', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', color: '#fff', borderRadius: 10, padding: '8px', fontSize: '.78rem', fontWeight: 700, cursor: 'pointer' }}>
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 220, padding: '24px', minWidth: 0 }}>
        <Outlet />
      </main>

      {/* Mobile nav (bottom) */}
      <nav style={{
        display: 'none',
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(10px)',
        borderTop: '1px solid #d8e4d1', padding: '6px 8px',
        zIndex: 200, gap: 2,
        justifyContent: 'space-around'
      }} className="mobile-nav">
        {navItems.slice(0,5).map(item => (
          <NavLink key={item.to} to={item.to}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              padding: '6px 8px', borderRadius: 10, textDecoration: 'none',
              fontSize: '.65rem', fontWeight: 700,
              color: isActive ? '#22663a' : '#6b7280',
              background: isActive ? '#eef6ea' : 'transparent',
            })}>
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            {item.label.split(' ')[0]}
          </NavLink>
        ))}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          aside { display: none !important; }
          main  { margin-left: 0 !important; padding: 16px 12px 80px !important; }
          .mobile-nav { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
