import { useState, useEffect } from 'react'
import { FarmProvider, useFarm } from '../../hooks/useFarm'
import FarmHeader from '../../components/ui/FarmHeader'
import { supabase } from '../../lib/supabase'
import { fmt, formatTL, estimateFeedCost, periodsDef, computeDailyMix, computePriceAndDM, today } from '../../lib/utils'
import { useAuth } from '../../hooks/useAuth'

function trigger(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.style.display = 'none'
  document.body.appendChild(a); a.click()
  setTimeout(() => { URL.revokeObjectURL(url); a.remove() }, 1200)
}

function buildReportHtml({ farm, group, groupData: d, expenses, reportDate, profile }) {
  const groupCount = farm?.groups?.length || 1
  const totalExpense = expenses.reduce((sum, e) => sum + (e.months || []).reduce((a, b) => a + (Number(b)||0), 0), 0)
  const otherCost = totalExpense / groupCount
  const feedCost = estimateFeedCost(d.feedItems, d.periodShares, d.purchaseWeight, d.finalWeight, d.analysisAnimalCount, d.dmRate, d.winterMode)
  const purchaseTotal = d.analysisAnimalCount * d.purchaseWeight * d.purchasePrice
  const salesTotal = d.analysisAnimalCount * d.finalWeight * (d.carcassYield/100) * d.carcassPrice
  const net = salesTotal - purchaseTotal - feedCost - otherCost

  const periodRows = Object.entries(periodsDef).map(([k, def]) => {
    const pr = computePriceAndDM(d.feedItems, d.periodShares, k, d.animalCount, d.avgWeight, d.dmRate, d.winterMode)
    const mx = computeDailyMix(d.feedItems, d.periodShares, k, d.animalCount, d.avgWeight, d.winterMode)
    return `<tr><td>${def.title} (${def.range})</td><td>${fmt(mx.wetPerAnimalTotal)} kg</td><td>${formatTL(pr.totalDailyCost/(d.animalCount||1))}</td><td>${def.days} gün</td><td>${formatTL(pr.totalDailyCost*def.days)}</td></tr>`
  }).join('')

  const expenseRows = expenses.map(e => {
    const total = (e.months||[]).reduce((a,b)=>a+(Number(b)||0),0)
    return `<tr><td>${e.name}</td><td style="text-align:right">${formatTL(total)}</td></tr>`
  }).join('')

  return `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
  <title>ProRasyon Raporu — ${farm?.name} / ${group?.name}</title>
  <style>
    body{font-family:'Calibri',Arial,sans-serif;padding:30px;color:#1f2e1c;font-size:13px}
    h1{color:#163a27;font-size:20px;margin-bottom:4px}
    h2{color:#1f5130;font-size:15px;margin:20px 0 8px;border-bottom:2px solid #d4e8ca;padding-bottom:4px}
    table{width:100%;border-collapse:collapse;margin-bottom:16px}
    th{background:#eef3e9;padding:9px 10px;text-align:left;font-size:12px;color:#204b2d}
    td{padding:8px 10px;border-bottom:1px solid #e2ecd9;font-size:12px}
    .summary{background:#f4f9f1;border:1px solid #d4e8ca;border-radius:8px;padding:16px;margin-bottom:20px}
    .summary p{margin:4px 0}
    .net{font-size:16px;font-weight:bold;color:${net>=0?'#15803d':'#dc2626'}}
    .footer{margin-top:30px;font-size:11px;color:#6b7280;border-top:1px solid #e2ecd9;padding-top:10px}
  </style></head><body>
  <h1>🌾 ProRasyon — Besi Yönetim Raporu</h1>
  <p style="color:#6b7280;margin-bottom:16px">Rapor Tarihi: ${reportDate} &nbsp;|&nbsp; İşletme: ${profile?.company_name || ''} &nbsp;|&nbsp; ${farm?.name} / ${group?.name}</p>

  <div class="summary">
    <p><strong>Hayvan Sayısı:</strong> ${d.animalCount} baş &nbsp;|&nbsp; <strong>Canlı Ağırlık:</strong> ${d.avgWeight} kg &nbsp;|&nbsp; <strong>Besi Başlangıç:</strong> ${d.startDate || '—'}</p>
    <p><strong>Alış:</strong> ${d.purchaseWeight} kg × ${formatTL(d.purchasePrice)}/kg CA &nbsp;|&nbsp; <strong>Hedef Bitiş:</strong> ${d.finalWeight} kg</p>
    <p><strong>Karkas Randıman:</strong> %${d.carcassYield} &nbsp;|&nbsp; <strong>Karkas Satış:</strong> ${formatTL(d.carcassPrice)}/kg</p>
  </div>

  <h2>Kâr / Zarar Özeti</h2>
  <table><tbody>
    <tr><td><strong>Toplam Alış Maliyeti</strong></td><td style="text-align:right">${formatTL(purchaseTotal)}</td></tr>
    <tr><td><strong>8 Aylık Yem Gideri</strong></td><td style="text-align:right">${formatTL(feedCost)}</td></tr>
    <tr><td><strong>Bu Gruba Düşen Diğer Gider</strong></td><td style="text-align:right">${formatTL(otherCost)}</td></tr>
    <tr><td><strong>Karkas Satış Geliri</strong></td><td style="text-align:right">${formatTL(salesTotal)}</td></tr>
    <tr style="background:#f0fdf4"><td><strong class="net">Net Kâr / Zarar</strong></td><td style="text-align:right"><strong class="net">${formatTL(net)}</strong></td></tr>
    <tr><td>Hayvan Başı Net Sonuç</td><td style="text-align:right">${formatTL(net/(d.analysisAnimalCount||1))}</td></tr>
  </tbody></table>

  <h2>Dönemsel Yem Maliyeti</h2>
  <table><thead><tr><th>Dönem</th><th>Yaş Yem/Baş</th><th>Maliyet/Baş/Gün</th><th>Süre</th><th>Dönem Toplamı</th></tr></thead>
  <tbody>${periodRows}</tbody></table>

  <h2>Gider Detayı</h2>
  <table><thead><tr><th>Kalem</th><th style="text-align:right">8 Ay Toplam</th></tr></thead>
  <tbody>${expenseRows}</tbody>
  <tfoot><tr><td><strong>Toplam</strong></td><td style="text-align:right"><strong>${formatTL(totalExpense)}</strong></td></tr></tfoot>
  </table>

  <h2>Yem Listesi (Aktif Dönem)</h2>
  <table><thead><tr><th>Yem Kalemi</th><th>Tip</th><th>Fiyat (₺/kg)</th><th>KM %</th></tr></thead>
  <tbody>${d.feedItems.map(f=>`<tr><td>${f.name}</td><td>${f.type}</td><td>${formatTL(f.price)}</td><td>%${f.dm}</td></tr>`).join('')}</tbody>
  </table>

  <div class="footer">ProRasyon tarafından oluşturuldu • ${reportDate} • Bu rapor muhasebe belgesi yerine geçmez.</div>
  </body></html>`
}

function RaporlarInner() {
  const { profile } = useAuth()
  const { farms, selectedFarm, selectedGroup, groupData, saving } = useFarm()
  const [expenses, setExpenses] = useState([])
  const [reportDate, setReportDate] = useState(today())
  const [scope, setScope] = useState('group')

  useEffect(() => {
    if (!selectedFarm?.id) return
    supabase.from('expenses').select('*').eq('farm_id', selectedFarm.id).then(({ data }) => setExpenses(data || []))
  }, [selectedFarm?.id])

  function downloadWord() {
    const html = buildReportHtml({ farm: selectedFarm, group: selectedGroup, groupData, expenses, reportDate, profile })
    const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' })
    trigger(blob, `ProRasyon_${selectedFarm?.name}_${selectedGroup?.name}_${reportDate}.doc`)
  }

  function downloadExcel() {
    const html = buildReportHtml({ farm: selectedFarm, group: selectedGroup, groupData, expenses, reportDate, profile })
    const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel;charset=utf-8' })
    trigger(blob, `ProRasyon_${selectedFarm?.name}_${selectedGroup?.name}_${reportDate}.xls`)
  }

  function downloadAllWord() {
    let allHtml = ''
    farms.forEach(farm => {
      ;(farm.groups || []).forEach(group => {
        allHtml += buildReportHtml({ farm, group, groupData: groupData, expenses, reportDate, profile })
        allHtml += '<div style="page-break-after:always"></div>'
      })
    })
    const blob = new Blob(['\ufeff', allHtml], { type: 'application/msword;charset=utf-8' })
    trigger(blob, `ProRasyon_TumCiftlikler_${reportDate}.doc`)
  }

  if (!groupData) return <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>Yükleniyor...</div>

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>📄 Raporlar</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>Word veya Excel formatında indirin, yazdırın, arşivleyin</p>

      <FarmHeader saving={saving} />

      <div className="card">
        <h3 style={{ marginBottom: 14 }}>Rapor Ayarları</h3>
        <div className="input-row" style={{ maxWidth: 500 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Rapor Tarihi</label>
            <input type="date" value={reportDate} onChange={e => setReportDate(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
          <button className="btn btn-primary" onClick={downloadWord}>
            📄 Word İndir — {selectedFarm?.name} / {selectedGroup?.name}
          </button>
          <button className="btn btn-secondary" onClick={downloadExcel}>
            📊 Excel İndir — {selectedFarm?.name} / {selectedGroup?.name}
          </button>
          <button className="btn btn-amber" onClick={downloadAllWord}>
            📦 Tüm Çiftlikler Word
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 10 }}>Rapor Önizlemesi</h3>
        <p style={{ color: '#6b7280', fontSize: '.85rem', marginBottom: 14 }}>
          Seçili: <strong>{selectedFarm?.name} / {selectedGroup?.name}</strong> • Rapor Tarihi: {reportDate}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'İşletme', value: profile?.company_name || '—' },
            { label: 'Çiftlik / Grup', value: `${selectedFarm?.name} / ${selectedGroup?.name}` },
            { label: 'Hayvan Sayısı', value: `${groupData.animalCount} baş` },
            { label: 'Besi Başlangıç', value: groupData.startDate || '—' },
            { label: 'Başlangıç CA', value: `${groupData.purchaseWeight} kg` },
            { label: 'Hedef Bitiş CA', value: `${groupData.finalWeight} kg` },
            { label: 'Alış Fiyatı', value: formatTL(groupData.purchasePrice) + '/kg CA' },
            { label: 'Karkas Satış', value: formatTL(groupData.carcassPrice) + '/kg' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e8f0e3' }}>
              <span style={{ color: '#6b7280', fontSize: '.83rem' }}>{item.label}</span>
              <span style={{ fontWeight: 700, fontSize: '.83rem' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Raporlar() {
  return <FarmProvider><RaporlarInner /></FarmProvider>
}
