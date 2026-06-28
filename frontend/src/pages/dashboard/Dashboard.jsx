import { useEffect, useState } from 'react'
import { useFarm } from '../../hooks/useFarm'
import { useAuth } from '../../hooks/useAuth'
import { FarmProvider } from '../../hooks/useFarm'
import { supabase } from '../../lib/supabase'
import { formatTL, fmt, estimateFeedCost, getPeriodByDay, getDayFromStart } from '../../lib/utils'

function DashboardInner() {
  const { profile } = useAuth()
  const { farms, selectedFarm, selectedGroup, groupData, loading } = useFarm()
  const [weighings, setWeighings] = useState([])
  const [expenses, setExpenses] = useState([])

  useEffect(() => {
    if (!selectedGroup?.id) return
    supabase.from('weighings').select('*').eq('group_id', selectedGroup.id).order('date').then(({ data }) => setWeighings(data || []))
    supabase.from('expenses').select('*').eq('farm_id', selectedFarm?.id).then(({ data }) => setExpenses(data || []))
  }, [selectedGroup?.id, selectedFarm?.id])

  if (loading || !groupData) return <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>Yükleniyor...</div>

  const d = groupData
  const day = getDayFromStart(d.startDate)
  const period = getPeriodByDay(day)

  const feedCost = estimateFeedCost(d.feedItems, d.periodShares, d.purchaseWeight, d.finalWeight, d.analysisAnimalCount, d.dmRate, d.winterMode)
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.months || []).reduce((a, b) => a + (Number(b) || 0), 0), 0)
  const salesTotal = d.analysisAnimalCount * d.finalWeight * (d.carcassYield / 100) * d.carcassPrice
  const purchaseTotal = d.analysisAnimalCount * d.purchaseWeight * d.purchasePrice
  const netProfit = salesTotal - purchaseTotal - feedCost - totalExpenses

  const lastGain = (() => {
    if (weighings.length < 2) return null
    const last = weighings[weighings.length - 1]
    const prev = weighings[weighings.length - 2]
    const days = Math.max(1, Math.ceil((new Date(last.date) - new Date(prev.date)) / 86400000))
    return ((last.avg_weight - prev.avg_weight) * 1000) / days
  })()

  const periodLabels = { starter: 'Başlangıç (0-60 gün)', growth: 'Gelişme (60-150 gün)', finish: 'Bitiş (150-240 gün)' }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1>Hoş Geldiniz, {profile?.full_name || 'Kullanıcı'} 👋</h1>
        <p style={{ color: '#6b7280', marginTop: 4 }}>{profile?.company_name || ''} • {selectedFarm?.name} / {selectedGroup?.name}</p>
      </div>

      {/* KPI Cards */}
      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <div className="metric-box">
          <div className="metric-label">Tahmini Net Kâr</div>
          <div className="metric-value" style={{ color: netProfit >= 0 ? '#15803d' : '#dc2626', fontSize: '1.15rem' }}>{formatTL(netProfit)}</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Hayvan Sayısı</div>
          <div className="metric-value">{fmt(d.animalCount, 0)} baş</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Besi Günü</div>
          <div className="metric-value">{day !== null ? `${fmt(day, 0)}. gün` : '—'}</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Aktif Dönem</div>
          <div className="metric-value" style={{ fontSize: '.9rem' }}>{periodLabels[period]}</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Son Günlük Artış</div>
          <div className="metric-value" style={{ color: lastGain === null ? '#6b7280' : lastGain < 1000 ? '#dc2626' : '#15803d' }}>
            {lastGain !== null ? `${fmt(lastGain, 0)} g/gün` : '—'}
          </div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Toplam Yem Gideri</div>
          <div className="metric-value" style={{ fontSize: '1rem' }}>{formatTL(feedCost)}</div>
        </div>
      </div>

      {/* Alerts */}
      {lastGain !== null && lastGain < 1000 && (
        <div className="alert alert-danger">
          ⚠️ Son tartıda günlük canlı ağırlık artışı <strong>{fmt(lastGain, 0)} g/gün</strong> — hedefin altında. Rasyon sayfasından yem oranlarını kontrol edin.
        </div>
      )}
      {weighings.length < 2 && (
        <div className="alert alert-info">
          ℹ️ AI değerlendirmesi için en az 2 tartı kaydı gerekli. Tartım sayfasından kayıt ekleyin.
        </div>
      )}
      {day !== null && day > 240 && (
        <div className="alert alert-warn">
          ⏰ Besi süresi <strong>{fmt(day, 0)} gün</strong> — standart 240 günü geçti. Satış planlaması yapmanız önerilir.
        </div>
      )}

      {/* Farm summary */}
      <div className="card">
        <h3 style={{ marginBottom: 14 }}>📊 Tüm Çiftlikler Özeti</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Çiftlik</th><th>Grup</th><th>Hayvan</th><th>Besi Günü</th></tr>
            </thead>
            <tbody>
              {farms.flatMap(farm =>
                (farm.groups || []).map(group => (
                  <tr key={group.id}>
                    <td>{farm.name}</td>
                    <td>{group.name}</td>
                    <td>—</td>
                    <td>—</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return <FarmProvider><DashboardInner /></FarmProvider>
}
