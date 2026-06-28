import { useState, useEffect } from 'react'
import { FarmProvider, useFarm } from '../../hooks/useFarm'
import FarmHeader from '../../components/ui/FarmHeader'
import { supabase } from '../../lib/supabase'
import { fmt, formatTL, defaultExpenseNames } from '../../lib/utils'

const MONTHS = ['1.Ay','2.Ay','3.Ay','4.Ay','5.Ay','6.Ay','7.Ay','8.Ay']

function GiderInner() {
  const { selectedFarm, selectedGroup, saving } = useFarm()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [saveTimer, setSaveTimer] = useState(null)

  useEffect(() => {
    if (!selectedFarm?.id) return
    loadExpenses()
  }, [selectedFarm?.id])

  async function loadExpenses() {
    setLoading(true)
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('farm_id', selectedFarm.id)
      .order('created_at')

    if (data && data.length) {
      setRows(data.map(r => ({ ...r, months: Array.isArray(r.months) ? r.months : Array(8).fill(0) })))
    } else {
      // Initialize defaults
      const defaults = defaultExpenseNames.map(name => ({
        farm_id: selectedFarm.id,
        name,
        months: Array(8).fill(0),
      }))
      const { data: inserted } = await supabase.from('expenses').insert(defaults).select()
      setRows((inserted || defaults).map(r => ({ ...r, months: Array(8).fill(0) })))
    }
    setLoading(false)
  }

  function scheduleUpsert(updatedRows) {
    clearTimeout(saveTimer)
    const t = setTimeout(async () => {
      for (const row of updatedRows) {
        if (row.id) {
          await supabase.from('expenses').update({ name: row.name, months: row.months }).eq('id', row.id)
        } else {
          const { data } = await supabase.from('expenses').insert({ farm_id: selectedFarm.id, name: row.name, months: row.months }).select().single()
          if (data) row.id = data.id
        }
      }
    }, 800)
    setSaveTimer(t)
  }

  function updateMonth(rowIndex, monthIndex, value) {
    const updated = rows.map((r, i) => {
      if (i !== rowIndex) return r
      const months = [...r.months]
      months[monthIndex] = parseFloat(value) || 0
      return { ...r, months }
    })
    setRows(updated)
    scheduleUpsert(updated)
  }

  function updateName(rowIndex, value) {
    const updated = rows.map((r, i) => i === rowIndex ? { ...r, name: value } : r)
    setRows(updated)
    scheduleUpsert(updated)
  }

  async function addRow() {
    const newRow = { farm_id: selectedFarm.id, name: 'Yeni Gider', months: Array(8).fill(0) }
    const { data } = await supabase.from('expenses').insert(newRow).select().single()
    setRows(prev => [...prev, data || newRow])
  }

  async function deleteRow(rowIndex) {
    const row = rows[rowIndex]
    if (!confirm(`"${row.name}" gideri silinsin mi?`)) return
    if (row.id) await supabase.from('expenses').delete().eq('id', row.id)
    setRows(prev => prev.filter((_, i) => i !== rowIndex))
  }

  // Hesaplamalar
  const monthTotals = MONTHS.map((_, mi) => rows.reduce((sum, r) => sum + (r.months[mi] || 0), 0))
  const grandTotal = monthTotals.reduce((a, b) => a + b, 0)
  const groupCount = Math.max(1, selectedFarm?.groups?.length || 1)
  const allocatedTotal = grandTotal / groupCount
  const animalCount = 100 // group data'dan alınabilir

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>🧾 Gider Defteri</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>
        Çiftlik geneli giderler • {groupCount} gruba bölünerek kâr hesabına yansır
      </p>

      <FarmHeader saving={saving} />

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3>8 Aylık Gider Tablosu — {selectedFarm?.name}</h3>
          <button className="btn btn-primary btn-sm" onClick={addRow}>+ Gider Satırı Ekle</button>
        </div>

        <div className="alert alert-info" style={{ marginBottom: 14 }}>
          ℹ️ Bu giderler çiftlik geneline aittir. Aynı çiftlikte {groupCount} grup var; her gruba <strong>{formatTL(allocatedTotal)}</strong> gider düşmektedir.
        </div>

        {loading ? (
          <div style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>Yükleniyor...</div>
        ) : (
          <div className="table-wrap">
            <table style={{ minWidth: 900 }}>
              <thead>
                <tr>
                  <th style={{ minWidth: 140 }}>Gider Kalemi</th>
                  {MONTHS.map(m => <th key={m}>{m} (₺)</th>)}
                  <th>Toplam</th>
                  <th>Sil</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => {
                  const rowTotal = row.months.reduce((a, b) => a + (Number(b) || 0), 0)
                  return (
                    <tr key={ri}>
                      <td>
                        <input value={row.name} onChange={e => updateName(ri, e.target.value)}
                          style={{ width: 130, padding: '5px 8px', fontSize: '.8rem' }} />
                      </td>
                      {row.months.map((v, mi) => (
                        <td key={mi}>
                          <input type="number" step="0.01" value={v || ''}
                            onChange={e => updateMonth(ri, mi, e.target.value)}
                            style={{ width: 80, textAlign: 'right', padding: '5px 6px', fontSize: '.8rem' }}
                            placeholder="0" />
                        </td>
                      ))}
                      <td style={{ fontWeight: 700 }}>{formatTL(rowTotal)}</td>
                      <td><button className="btn btn-danger btn-sm" onClick={() => deleteRow(ri)}>Sil</button></td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Ay Toplamı</strong></td>
                  {monthTotals.map((t, i) => <td key={i} style={{ fontWeight: 700 }}>{formatTL(t)}</td>)}
                  <td style={{ fontWeight: 800, color: '#163a27' }}>{formatTL(grandTotal)}</td>
                  <td>—</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Özet */}
        <div className="metric-grid" style={{ marginTop: 16 }}>
          <div className="metric-box">
            <div className="metric-label">Çiftlik Toplam Gider (8 Ay)</div>
            <div className="metric-value">{formatTL(grandTotal)}</div>
          </div>
          <div className="metric-box">
            <div className="metric-label">Bu Gruba Düşen Gider</div>
            <div className="metric-value">{formatTL(allocatedTotal)}</div>
          </div>
          <div className="metric-box">
            <div className="metric-label">Grup Sayısı</div>
            <div className="metric-value">{groupCount}</div>
          </div>
          <div className="metric-box">
            <div className="metric-label">Aylık Ortalama Gider</div>
            <div className="metric-value">{formatTL(grandTotal / 8)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Gider() {
  return <FarmProvider><GiderInner /></FarmProvider>
}
