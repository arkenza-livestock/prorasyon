import { useState, useEffect, useRef } from 'react'
import { FarmProvider, useFarm } from '../../hooks/useFarm'
import FarmHeader from '../../components/ui/FarmHeader'
import { supabase } from '../../lib/supabase'
import { fmt, formatTL, estimateFeedCost, deepClone } from '../../lib/utils'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

function KarInner() {
  const { selectedFarm, selectedGroup, groupData, saveGroupData, saving } = useFarm()
  const [local, setLocal] = useState(null)
  const [expenses, setExpenses] = useState([])
  const barRef  = useRef(null)
  const pieRef  = useRef(null)
  const barChart = useRef(null)
  const pieChart = useRef(null)
  const [saveTimer, setSaveTimer] = useState(null)

  useEffect(() => { if (groupData) setLocal(deepClone(groupData)) }, [groupData])

  useEffect(() => {
    if (!selectedFarm?.id) return
    supabase.from('expenses').select('*').eq('farm_id', selectedFarm.id).then(({ data }) => setExpenses(data || []))
  }, [selectedFarm?.id])

  function update(key, value) {
    const next = { ...local, [key]: value }
    setLocal(next)
    clearTimeout(saveTimer)
    setSaveTimer(setTimeout(() => saveGroupData(next), 800))
  }

  // Hesaplamalar
  const calc = () => {
    if (!local) return null
    const d = local
    const animal     = d.analysisAnimalCount || 100
    const startW     = d.purchaseWeight || 300
    const buyPrice   = d.purchasePrice  || 260
    const finalW     = d.finalWeight    || 600
    const yieldPct   = d.carcassYield   || 58
    const sellPrice  = d.carcassPrice   || 430

    const feedCost     = estimateFeedCost(d.feedItems, d.periodShares, startW, finalW, animal, d.dmRate, d.winterMode)
    const totalExpense = expenses.reduce((sum, e) => sum + (e.months || []).reduce((a, b) => a + (Number(b)||0), 0), 0)
    const groupCount   = Math.max(1, selectedFarm?.groups?.length || 1)
    const otherCost    = totalExpense / groupCount

    const purchaseTotal = animal * startW * buyPrice
    const salesTotal    = animal * finalW * (yieldPct / 100) * sellPrice
    const net           = salesTotal - purchaseTotal - feedCost - otherCost

    const totalCost = purchaseTotal + feedCost + otherCost
    const breakeven = (finalW * (yieldPct/100)) > 0 ? totalCost / (animal * finalW * (yieldPct/100)) : 0
    const roi    = totalCost > 0 ? (net / totalCost) * 100 : 0
    const margin = salesTotal > 0 ? (net / salesTotal) * 100 : 0

    return { animal, feedCost, otherCost, purchaseTotal, salesTotal, net, totalCost, breakeven, roi, margin }
  }

  const c = calc()

  useEffect(() => {
    if (!c || !barRef.current || !pieRef.current) return

    if (barChart.current) barChart.current.destroy()
    barChart.current = new Chart(barRef.current, {
      type: 'bar',
      data: {
        labels: ['Alış Maliyeti', 'Yem Gideri', 'Diğer Gider', 'Satış Geliri', 'Net Kâr/Zarar'],
        datasets: [{
          label: '₺',
          data: [c.purchaseTotal, c.feedCost, c.otherCost, c.salesTotal, c.net],
          backgroundColor: ['#f87171','#fb923c','#facc15','#4ade80', c.net >= 0 ? '#22c55e' : '#ef4444'],
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { callback: v => new Intl.NumberFormat('tr-TR').format(v) + ' ₺' } } }
      }
    })

    if (pieChart.current) pieChart.current.destroy()
    pieChart.current = new Chart(pieRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Alış', 'Yem', 'Diğer Gider'],
        datasets: [{ data: [c.purchaseTotal, c.feedCost, c.otherCost], backgroundColor: ['#f87171','#fb923c','#facc15'] }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    })

    return () => { barChart.current?.destroy(); pieChart.current?.destroy() }
  }, [c?.net, c?.feedCost])

  if (!local || !c) return <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>Yükleniyor...</div>

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>📈 Kâr Analizi</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>Alış, yem, gider ve satış hesabı — gerçek zamanlı</p>

      <FarmHeader saving={saving} />

      {/* Giriş parametreleri */}
      <div className="card">
        <h3 style={{ marginBottom: 14 }}>Parametreler</h3>
        <div className="input-row">
          <div className="form-group" style={{ margin: 0 }}>
            <label>Başlangıç CA (kg)</label>
            <input type="number" value={local.purchaseWeight} onChange={e => update('purchaseWeight', +e.target.value)} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Alış Fiyatı (₺/kg CA)</label>
            <input type="number" value={local.purchasePrice} onChange={e => update('purchasePrice', +e.target.value)} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Besi Sonu CA (kg)</label>
            <input type="number" value={local.finalWeight} onChange={e => update('finalWeight', +e.target.value)} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Karkas Randıman (%)</label>
            <input type="number" value={local.carcassYield} onChange={e => update('carcassYield', +e.target.value)} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Karkas Satış Fiyatı (₺/kg)</label>
            <input type="number" value={local.carcassPrice} onChange={e => update('carcassPrice', +e.target.value)} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Hayvan Sayısı</label>
            <input type="number" value={local.analysisAnimalCount} onChange={e => update('analysisAnimalCount', +e.target.value)} />
          </div>
        </div>
      </div>

      {/* Sonuç özeti */}
      <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))' }}>
        <div className="metric-box">
          <div className="metric-label">Toplam Alış Maliyeti</div>
          <div className="metric-value" style={{ fontSize: '1rem' }}>{formatTL(c.purchaseTotal)}</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">8 Aylık Yem Gideri</div>
          <div className="metric-value" style={{ fontSize: '1rem' }}>{formatTL(c.feedCost)}</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Bu Gruba Düşen Diğer Gider</div>
          <div className="metric-value" style={{ fontSize: '1rem' }}>{formatTL(c.otherCost)}</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Karkas Satış Geliri</div>
          <div className="metric-value" style={{ fontSize: '1rem', color: '#15803d' }}>{formatTL(c.salesTotal)}</div>
        </div>
        <div className="metric-box" style={{ background: c.net >= 0 ? '#f0fdf4' : '#fef2f2', border: `1px solid ${c.net >= 0 ? '#bbf7d0' : '#fecaca'}` }}>
          <div className="metric-label">Net Kâr / Zarar</div>
          <div className="metric-value" style={{ color: c.net >= 0 ? '#15803d' : '#dc2626' }}>{formatTL(c.net)}</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Hayvan Başı Net Sonuç</div>
          <div className="metric-value" style={{ fontSize: '1rem', color: c.net >= 0 ? '#15803d' : '#dc2626' }}>{formatTL(c.net / c.animal)}</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Başa Baş Karkas Fiyatı</div>
          <div className="metric-value" style={{ fontSize: '1rem' }}>{formatTL(c.breakeven)}</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">ROI</div>
          <div className="metric-value" style={{ color: c.roi >= 0 ? '#15803d' : '#dc2626' }}>%{fmt(c.roi, 1)}</div>
        </div>
        <div className="metric-box">
          <div className="metric-label">Kâr Marjı</div>
          <div className="metric-value" style={{ color: c.margin >= 0 ? '#15803d' : '#dc2626' }}>%{fmt(c.margin, 1)}</div>
        </div>
      </div>

      {/* Grafikler */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 8 }}>
        <div className="card" style={{ margin: 0 }}>
          <h3 style={{ marginBottom: 12 }}>📊 Gelir-Gider Karşılaştırması</h3>
          <div style={{ height: 280 }}><canvas ref={barRef} /></div>
        </div>
        <div className="card" style={{ margin: 0 }}>
          <h3 style={{ marginBottom: 12 }}>🥧 Maliyet Dağılımı</h3>
          <div style={{ height: 280 }}><canvas ref={pieRef} /></div>
        </div>
      </div>
    </div>
  )
}

export default function Kar() {
  return <FarmProvider><KarInner /></FarmProvider>
}
