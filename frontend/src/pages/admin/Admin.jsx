import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { fmt } from '../../lib/utils'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [mailModal, setMailModal] = useState(null)
  const [mailText, setMailText] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
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

  async function startPro(userId, email) {
    if (!confirm(`"${email}" kullanıcısına 30 günlük Pro başlatılsın mı?`)) return
    const expires = new Date(Date.now() + 30 * 86400000).toISOString()
    await supabase.from('profiles').update({ plan: 'pro', plan_expires_at: expires }).eq('id', userId)
    await supabase.functions.invoke('send-mail', {
      body: {
        to: email,
        subject: 'ProRasyon Pro Planınız Başladı!',
        html: `<h2>Merhaba!</h2><p>30 günlük Pro planınız başarıyla başlatıldı.</p><p>Süreniz: <strong>${new Date(expires).toLocaleDateString('tr-TR')}</strong> tarihinde dolacak.</p><p><a href="https://prorasyon.com.tr/app/panel">Uygulamaya Git →</a></p>`
      }
    })
    await loadUsers()
    alert('Pro plan başlatıldı ve mail gönderildi!')
  }

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.company_name?.toLowerCase().includes(search.toLowerCase())
  )

  const expiringSoon = users.filter(u => {
    if (!u.plan_expires_at) return false
    const days = Math.ceil((new Date(u.plan_expires_at) - new Date()) / 86400000)
    return days <= 7 && days >= 0
  })

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>⚙️ Admin Paneli</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>Kullanıcı yönetimi, plan ve rol atamaları</p>

      <div className="metric-grid">
        <div className="metric-box"><div className="metric-label">Toplam Kullanıcı</div><div className="metric-value">{users.length}</div></div>
        <div className="metric-box"><div className="metric-label">Aktif (Pro)</div><div className="metric-value">{users.filter(u => u.plan === 'pro').length}</div></div>
        <div className="metric-box"><div className="metric-label">Ücretsiz</div><div className="metric-value">{users.filter(u => u.plan === 'free' || !u.plan).length}</div></div>
        <div className="metric-box"><div className="metric-label">Süresi Yakın</div><div className="metric-value" style={{ color: expiringSoon.length > 0 ? '#dc2626' : '#15803d' }}>{expiringSoon.length}</div></div>
      </div>

      {expiringSoon.length > 0 && (
        <div className="alert alert-warn">
          ⚠️ <strong>{expiringSoon.length} kullanıcının</strong> planı 7 gün içinde bitiyor: {expiringSoon.map(u => u.email).join(', ')}
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
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
                  <th>Plan</th><th>Plan Bitiş</th><th>Rol</th><th>Kayıt</th><th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const daysLeft = u.plan_expires_at ? Math.ceil((new Date(u.plan_expires_at) - new Date()) / 86400000) : null
                  return (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>{u.full_name || '—'}</td>
                      <td style={{ fontSize: '.78rem', color: '#6b7280' }}>{u.email}</td>
                      <td>{u.company_name || '—'}</td>
                      <td>
                        <span className={`pill ${u.plan === 'pro' ? 'pill-ok' : 'pill-warn'}`}>
                          {u.plan || 'free'}
                        </span>
                      </td>
                      <td style={{ fontSize: '.78rem', color: daysLeft !== null && daysLeft <= 7 ? '#dc2626' : '#6b7280' }}>
                        {u.plan_expires_at ? `${new Date(u.plan_expires_at).toLocaleDateString('tr-TR')} (${daysLeft} gün)` : '—'}
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
                         <button className="btn btn-secondary btn-sm"
                            onClick={() => { setMailModal(u); setMailText('') }}>
                            ✉️
</button>
<button className="btn btn-primary btn-sm"
  onClick={() => startPro(u.id, u.email)}
  style={{ background: '#16a34a' }}>
  🚀 Pro Başlat
</button>
<button className="btn btn-danger btn-sm"
  onClick={() => deleteUser(u.id, u.email)}>
  🗑
</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {mailModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
            <h3 style={{ marginBottom: 4 }}>✉️ Mesaj Gönder</h3>
            <p style={{ color: '#6b7280', fontSize: '.85rem', marginBottom: 16 }}>{mailModal.email}</p>
            <textarea value={mailText} onChange={e => setMailText(e.target.value)}
              placeholder="Mesajınızı yazın..."
              style={{ width: '100%', height: 140, borderRadius: 12, border: '1px solid #d1d5db', padding: 12, fontSize: '.85rem', fontFamily: 'inherit', resize: 'vertical' }} />
            <div style={{ display: 'flex', gap: 10, marginTop: 14, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setMailModal(null)}>İptal</button>
              <button className="btn btn-primary btn-sm" onClick={async () => {
                if (!mailText.trim()) return
                setSending(true)
                const { error } = await supabase.from('admin_messages').insert({
                  to_user_id: mailModal.id,
                  to_email: mailModal.email,
                  message: mailText,
                  sent_at: new Date().toISOString()
                })
                setSending(false)
                setMailModal(null)
                alert(error ? 'Hata oluştu.' : 'Mesaj kaydedildi!')
              }}>
                {sending ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}