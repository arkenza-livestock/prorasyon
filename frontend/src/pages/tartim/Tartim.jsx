import { useState, useEffect } from 'react'
import { FarmProvider, useFarm } from '../../hooks/useFarm'
import FarmHeader from '../../components/ui/FarmHeader'
import { supabase } from '../../lib/supabase'
import { fmt, formatTL, today } from '../../lib/utils'

function TartimInner() {
  const { selectedGroup, saving } = useFarm()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ date: today(), avg_weight: '', daily_feed: '', note: '' })
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!selectedGroup?.id) return
    loadRecords()
  }, [selectedGroup?.id])

  async function loadRecords() {
    setLoading(true)
    const { data } = await supabase
      .from('weighings')
      .select('*')
      .eq('group_id', selectedGroup.id)
      .order('date')
    setRecords(data || [])
    setLoading(false)
  }

  async function addRecord() {
    if (!form.date || !form.avg_weight) return alert('Tarih ve canlı ağırlık zorunlu.')
    setAdding(true)
    await supabase.from('weighings').insert({
      group_id:   selectedGroup.id,
      date:       form.date,
      avg_weight: parseFloat(form.avg_weight),
      daily_feed: parseFloat(form.daily_feed) || 0,
      note:       form.note,
    })
    setForm({ date: today(), avg_weight: '', daily_feed: '', note: '' })
    setShowForm(false)
    await loadRecords()
    setAdding(false)
  }

  async function deleteRecord(id) {
    if (!confirm('Bu tartı kaydı silinsin mi?')) return
    await supabase.from('weighings').delete().eq('id', id)
    await loadRecords()
  }

  // Hesaplamalar
  const enriched = records.map((rec, i) => {
    let gain = null, fcr = null
    if (i > 0) {
      const prev = records[i - 1]
      const days = Math.max(1, Math.ceil((new Date(rec.date) - new Date(prev.date)) / 86400000))
      gain = ((rec.avg_weight - prev.avg_weight) * 1000) / days
      if (rec.daily_feed > 0 && gain > 0) fcr = rec.daily_feed / (gain / 1000)
    }
    return { ...rec, gain, fcr }
  })

  const lastGain = enriched.length >= 2 ? enriched[enriched.length - 1].gain : null
  const avgGain = enriched.filter(r => r.gain !== null).length > 0
    ? enriched.filter(r => r.gain !== null).reduce((a, r) => a + r.gain, 0) / enriched.filter(r => r.gain !== null).length
    : null

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>⚖️ Tartım Kayıtları</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>Her tartım kaydı tarih damgasıyla saklanır, geriye dönük izlenebilir</p>

      <FarmHeader saving={saving} />

      {/* KPI */}
      {records.length >= 2 && (
        <div className="metric-grid">
          <div className="metric-box">
            <div className="metric-label">Son Günlük Artış</div>
            <div className="metric-value" style={{ color: lastGain < 1000 ? '#dc2626' : '#15803d' }}>
              {fmt(lastGain, 0)} g/gün
            </div>
          </div>
          <div className="metric-box">
            <div className="metric-label">Ortalama Günlük Artış</div>
            <div className="metric-value">{avgGain !== null ? `${fmt(avgGain, 0)} g/gün` : '—'}</div>
          </div>
          <div className="metric-box">
            <div className="metric-label">Toplam Tartı Sayısı</div>
            <div className="metric-value">{records.length}</div>
          </div>
          <div className="metric-box">
            <div className="metric-label">Son Canlı Ağırlık</div>
            <div className="metric-value">{fmt(records[records.length - 1]?.avg_weight)} kg</div>
          </div>
        </div>
      )}

      {/* Uyarılar */}
      {lastGain !== null && lastGain < 1000 && (
        <div className="alert alert-danger">⚠️ Son tartıda günlük artış <strong>{fmt(lastGain, 0)} g/gün</strong> — hedefin altında. Rasyon sayfasından yem oranlarını gözden geçirin.</div>
      )}
      {lastGain !== null && lastGain > 1500 && (
        <div className="alert alert-warn">⚠️ Günlük artış çok yüksek: <strong>{fmt(lastGain, 0)} g/gün</strong>. Rumen dengesi ve sindirim izlenmeli.</div>
      )}

      {/* Yeni kayıt */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showForm ? 16 : 0 }}>
          <h3>Tartım Kayıtları</h3>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(v => !v)}>
            {showForm ? '✕ Kapat' : '➕ Yeni Tartı Ekle'}
          </button>
        </div>

        {showForm && (
          <div style={{ background: '#f8faf4', borderRadius: 12, padding: 16, marginBottom: 16, border: '1px solid #dde8d4' }}>
            <div className="input-row">
              <div className="form-group" style={{ margin: 0 }}>
                <label>Tarih</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Ortalama Canlı Ağırlık (kg)</label>
                <input type="number" step="0.1" value={form.avg_weight} onChange={e => setForm(f => ({ ...f, avg_weight: e.target.value }))} placeholder="örn: 320" />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Günlük Yem (kg/baş)</label>
                <input type="number" step="0.1" value={form.daily_feed} onChange={e => setForm(f => ({ ...f, daily_feed: e.target.value }))} placeholder="örn: 8.5" />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Not (opsiyonel)</label>
                <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="örn: yağışlı hava" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={addRecord} disabled={adding}>
                {adding ? 'Kaydediliyor...' : '💾 Kaydet'}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>İptal</button>
            </div>
          </div>
        )}

        {/* Tablo */}
        {loading ? (
          <div style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>Yükleniyor...</div>
        ) : records.length === 0 ? (
          <div className="alert alert-info">Henüz tartı kaydı yok. Yeni Tartı Ekle butonuna basın.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tarih</th><th>Ort. CA (kg)</th><th>Günlük Artış (g)</th>
                  <th>Günlük Yem (kg/baş)</th><th>FCR</th><th>Durum</th><th>Not</th><th>Sil</th>
                </tr>
              </thead>
              <tbody>
                {enriched.map((rec, i) => (
                  <tr key={rec.id}>
                    <td>{rec.date}</td>
                    <td style={{ fontWeight: 700 }}>{fmt(rec.avg_weight)} kg</td>
                    <td>
                      {rec.gain !== null ? (
                        <span className={`pill ${rec.gain < 1000 ? 'pill-bad' : rec.gain > 1500 ? 'pill-warn' : 'pill-ok'}`}>
                          {fmt(rec.gain, 0)} g
                        </span>
                      ) : <span style={{ color: '#6b7280' }}>İlk tartı</span>}
                    </td>
                    <td>{rec.daily_feed > 0 ? `${fmt(rec.daily_feed)} kg` : '—'}</td>
                    <td>{rec.fcr ? fmt(rec.fcr, 2) : '—'}</td>
                    <td>
                      {rec.gain === null ? <span className="pill pill-info">İlk</span>
                        : rec.gain < 1000 ? <span className="pill pill-bad">Düşük</span>
                        : rec.gain > 1500 ? <span className="pill pill-warn">Yüksek</span>
                        : <span className="pill pill-ok">İdeal</span>}
                    </td>
                    <td style={{ color: '#6b7280', fontSize: '.78rem' }}>{rec.note || '—'}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => deleteRecord(rec.id)}>Sil</button></td>
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

export default function Tartim() {
  return <FarmProvider><TartimInner /></FarmProvider>
}
