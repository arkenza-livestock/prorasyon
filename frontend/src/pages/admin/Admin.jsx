import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { fmt } from '../../lib/utils'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }

  async function updateRole(userId, role) {
    await supabase.from('profiles').update({ role }).eq('id', userId)
    await loadUsers()
  }

  async function updatePlan(userId, plan) {
    const expires = plan === 'free' ? null : new Date(Date.now() + 30 * 86400000).toISOString()
    await supabase.from('profiles').update({ plan, plan_expires_at: expires }).eq('id', userId)
    await loadUsers()
  }

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.company_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>⚙️ Admin Paneli</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>Kullanıcı yönetimi, plan ve rol atamaları</p>

      {/* Stats */}
      <div className="metric-grid">
        <div className="metric-box"><div className="metric-label">Toplam Kullanıcı</div><div className="metric-value">{users.length}</div></div>
        <div className="metric-box"><div className="metric-label">Aktif (Pro)</div><div className="metric-value">{users.filter(u => u.plan === 'pro').length}</div></div>
        <div className="metric-box"><div className="metric-label">Ücretsiz</div><div className="metric-value">{users.filter(u => u.plan === 'free' || !u.plan).length}</div></div>
        <div className="metric-box"><div className="metric-label">Admin</div><div className="metric-value">{users.filter(u => u.role === 'admin').length}</div></div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3>Kullanıcılar</h3>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="İsim, e-posta veya işletme ara..."
            style={{ width: 260, height: 36 }} />
        </div>

        {loading ? (
          <div style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>Yükleniyor...</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Ad Soyad</th><th>E-posta</th><th>İşletme</th>
                  <th>Plan</th><th>Plan Bitiş</th><th>Rol</th><th>Kayıt Tarihi</th><th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{u.full_name || '—'}</td>
                    <td style={{ fontSize: '.78rem', color: '#6b7280' }}>{u.email}</td>
                    <td>{u.company_name || '—'}</td>
                    <td>
                      <span className={`pill ${u.plan === 'pro' ? 'pill-ok' : 'pill-warn'}`}>
                        {u.plan || 'free'}
                      </span>
                    </td>
                    <td style={{ fontSize: '.78rem', color: '#6b7280' }}>
                      {u.plan_expires_at ? new Date(u.plan_expires_at).toLocaleDateString('tr-TR') : '—'}
                    </td>
                    <td>
                      <span className={`pill ${u.role === 'admin' ? 'pill-bad' : 'pill-info'}`}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td style={{ fontSize: '.78rem', color: '#6b7280' }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString('tr-TR') : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <select value={u.plan || 'free'} onChange={e => updatePlan(u.id, e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: 8, fontSize: '.75rem', height: 30 }}>
                          <option value="free">Ücretsiz</option>
                          <option value="pro">Pro (+30 gün)</option>
                          <option value="trial">Deneme</option>
                        </select>
                        <select value={u.role || 'user'} onChange={e => updateRole(u.id, e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: 8, fontSize: '.75rem', height: 30 }}>
                          <option value="user">Kullanıcı</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
