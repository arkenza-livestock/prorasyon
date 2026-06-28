import { useState, useEffect, useCallback } from 'react'
import { FarmProvider, useFarm } from '../../hooks/useFarm'
import FarmHeader from '../../components/ui/FarmHeader'
import { fmt, formatTL, computeDailyMix, computePriceAndDM, periodsDef, getPeriodByDay, getDayFromStart, defaultFeeds, deepClone } from '../../lib/utils'

function RasyonInner() {
  const { groupData, saveGroupData, saving, loading } = useFarm()
  const [local, setLocal] = useState(null)
  const [saveTimer, setSaveTimer] = useState(null)

  useEffect(() => {
    if (groupData) setLocal(deepClone(groupData))
  }, [groupData])

  const scheduleSave = useCallback((data) => {
    clearTimeout(saveTimer)
    const t = setTimeout(() => saveGroupData(data), 800)
    setSaveTimer(t)
  }, [saveTimer, saveGroupData])

  function update(key, value) {
    const next = { ...local, [key]: value }
    setLocal(next)
    scheduleSave(next)
  }

  function updateShare(periodKey, index, value) {
    const shares = { ...local.periodShares }
    shares[periodKey] = [...(shares[periodKey] || [])]
    shares[periodKey][index] = parseFloat(value) || 0
    const next = { ...local, periodShares: shares }
    setLocal(next)
    scheduleSave(next)
  }

  function addFeed() {
    const feeds = [...local.feedItems, { name: 'Yeni Yem', type: 'Kesif Yem', price: 10, dm: 85 }]
    const shares = {}
    for (const k of ['starter', 'growth', 'finish']) shares[k] = [...(local.periodShares[k] || []), 0]
    const next = { ...local, feedItems: feeds, periodShares: shares }
    setLocal(next)
    scheduleSave(next)
  }

  function deleteFeed(index) {
    if (local.feedItems.length <= 1) return alert('En az bir yem kalmalı.')
    const feeds = local.feedItems.filter((_, i) => i !== index)
    const shares = {}
    for (const k of ['starter', 'growth', 'finish']) shares[k] = (local.periodShares[k] || []).filter((_, i) => i !== index)
    const next = { ...local, feedItems: feeds, periodShares: shares }
    setLocal(next)
    scheduleSave(next)
  }

  function updateFeed(index, field, value) {
    const feeds = local.feedItems.map((f, i) => i === index ? { ...f, [field]: field === 'name' || field === 'type' ? value : parseFloat(value) || 0 } : f)
    const next = { ...local, feedItems: feeds }
    setLocal(next)
    scheduleSave(next)
  }

  if (loading || !local) return <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>Yükleniyor...</div>

  const { selectedPeriod, animalCount, avgWeight, winterMode, dmRate, feedItems, periodShares } = local
  const day = getDayFromStart(local.startDate)
  const autoPeriod = getPeriodByDay(day)
  const mix = computeDailyMix(feedItems, periodShares, selectedPeriod, animalCount, avgWeight, winterMode)
  const priceData = computePriceAndDM(feedItems, periodShares, selectedPeriod, animalCount, avgWeight, dmRate, winterMode)

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}>🐄 Rasyon Yönetimi</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>Yem kalemleri ve dönemsel oranlar tamamen sizin kontrolünüzde</p>

      <FarmHeader saving={saving} />

      {/* Temel bilgiler */}
      <div className="card">
        <h3 style={{ marginBottom: 14 }}>Sürü Bilgileri</h3>
        <div className="input-row">
          <div className="form-group" style={{ margin: 0 }}>
            <label>Hayvan Sayısı</label>
            <input type="number" value={animalCount} onChange={e => update('animalCount', +e.target.value)} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Canlı Ağırlık (kg)</label>
            <input type="number" value={avgWeight} onChange={e => update('avgWeight', +e.target.value)} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Besi Başlama Tarihi</label>
            <input type="date" value={local.startDate} onChange={e => update('startDate', e.target.value)} />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>KM Tüketim Oranı (%CA)</label>
            <select value={dmRate} onChange={e => update('dmRate', +e.target.value)}>
              {[2.1, 2.2, 2.3, 2.4].map(v => <option key={v} value={v}>{v}%</option>)}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <input type="checkbox" id="wm" checked={winterMode} onChange={e => update('winterMode', e.target.checked)} style={{ width: 18, height: 18 }} />
            <label htmlFor="wm" style={{ cursor: 'pointer', textTransform: 'none', fontSize: '.85rem', color: '#374151' }}>Kış Modu (+8% enerji)</label>
          </div>
        </div>

        {day !== null && (
          <div className={`alert alert-${autoPeriod === 'starter' ? 'success' : autoPeriod === 'growth' ? 'warn' : 'info'}`}>
            📆 Besinin <strong>{fmt(day, 0)}. günü</strong> — Otomatik dönem: <strong>{periodsDef[autoPeriod].title} ({periodsDef[autoPeriod].range})</strong>
          </div>
        )}
      </div>

      {/* Dönem seçici */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <h3>📋 Rasyon Tablosu</h3>
          <button className="btn btn-primary btn-sm" onClick={addFeed}>+ Yem Satırı Ekle</button>
        </div>

        <div className="period-group">
          {Object.entries(periodsDef).map(([key, def]) => (
            <button key={key} className={`period-btn ${selectedPeriod === key ? 'active' : ''}`}
              onClick={() => update('selectedPeriod', key)}>
              {key === 'starter' ? '🌱' : key === 'growth' ? '📈' : '🏁'} {def.title} ({def.range})
              {autoPeriod === key && selectedPeriod !== key && <span style={{ fontSize: '.65rem', marginLeft: 4, opacity: .7 }}>● otomatik</span>}
            </button>
          ))}
        </div>

        {/* Rasyon tablosu */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Yem Kalemi</th><th>Tip</th><th>Fiyat (₺/kg)</th><th>KM %</th>
                <th>Karışım Oranı</th><th>% Payı</th><th>kg/baş</th><th>Toplam kg/gün</th><th>Sil</th>
              </tr>
            </thead>
            <tbody>
              {mix.rows.map((row, i) => (
                <tr key={i}>
                  <td><input value={feedItems[i]?.name || ''} onChange={e => updateFeed(i, 'name', e.target.value)} style={{ width: 140, padding: '5px 8px', fontSize: '.8rem' }} /></td>
                  <td>
                    <select value={feedItems[i]?.type || 'Kesif Yem'} onChange={e => updateFeed(i, 'type', e.target.value)} style={{ padding: '5px 8px', fontSize: '.8rem' }}>
                      <option>Kaba Yem</option>
                      <option>Kesif Yem</option>
                    </select>
                  </td>
                  <td><input type="number" step="0.1" value={feedItems[i]?.price || 0} onChange={e => updateFeed(i, 'price', e.target.value)} style={{ width: 80, textAlign: 'center', padding: '5px 6px', fontSize: '.8rem' }} /></td>
                  <td><input type="number" step="1" value={feedItems[i]?.dm || 0} onChange={e => updateFeed(i, 'dm', e.target.value)} style={{ width: 70, textAlign: 'center', padding: '5px 6px', fontSize: '.8rem' }} /></td>
                  <td><input type="number" step="0.1" value={row.rawShare} onChange={e => updateShare(selectedPeriod, i, e.target.value)} style={{ width: 90, textAlign: 'center', padding: '5px 6px', fontSize: '.8rem' }} /></td>
                  <td><span className={`pill ${row.type === 'Kaba Yem' ? 'pill-ok' : 'pill-info'}`}>%{fmt(row.sharePct, 1)}</span></td>
                  <td>{fmt(row.perAnimalKg)} kg</td>
                  <td style={{ fontWeight: 700 }}>{fmt(row.totalKg)} kg</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => deleteFeed(i)}>Sil</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Özet metrikler */}
        <div className="metric-grid" style={{ marginTop: 16 }}>
          <div className="metric-box"><div className="metric-label">Hayvan Başı Yaş Yem</div><div className="metric-value">{fmt(mix.wetPerAnimalTotal)} kg</div></div>
          <div className="metric-box"><div className="metric-label">Toplam Günlük Yaş Yem</div><div className="metric-value">{fmt(mix.totalWetFeed)} kg</div></div>
          <div className="metric-box"><div className="metric-label">Kaba Yem Toplam</div><div className="metric-value">{fmt(mix.totalRoughage)} kg</div></div>
          <div className="metric-box"><div className="metric-label">Kesif Yem Toplam</div><div className="metric-value">{fmt(mix.totalConcentrate)} kg</div></div>
          <div className="metric-box"><div className="metric-label">Günlük Yem Maliyeti</div><div className="metric-value">{formatTL(priceData.totalDailyCost)}</div></div>
          <div className="metric-box"><div className="metric-label">Hayvan Başı/Gün Maliyet</div><div className="metric-value">{formatTL(priceData.totalDailyCost / (animalCount || 1))}</div></div>
        </div>

        {/* Dönemsel maliyet özeti */}
        <h3 style={{ marginTop: 20, marginBottom: 10 }}>📆 Dönemsel Maliyet Tablosu</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Dönem</th><th>Yaş Yem/Baş (kg)</th><th>Maliyet/Baş/Gün</th><th>Toplam Maliyet/Gün</th><th>Süre (Gün)</th><th>Dönem Toplamı</th></tr>
            </thead>
            <tbody>
              {Object.entries(periodsDef).map(([k, def]) => {
                const pr = computePriceAndDM(feedItems, periodShares, k, animalCount, avgWeight, dmRate, winterMode)
                const mx = computeDailyMix(feedItems, periodShares, k, animalCount, avgWeight, winterMode)
                return (
                  <tr key={k}>
                    <td><strong>{def.title}</strong> <span style={{ color: '#6b7280', fontSize: '.75rem' }}>{def.range}</span></td>
                    <td>{fmt(mx.wetPerAnimalTotal)} kg</td>
                    <td>{formatTL(pr.totalDailyCost / (animalCount || 1))}</td>
                    <td>{formatTL(pr.totalDailyCost)}</td>
                    <td>{def.days}</td>
                    <td style={{ fontWeight: 700 }}>{formatTL(pr.totalDailyCost * def.days)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function Rasyon() {
  return <FarmProvider><RasyonInner /></FarmProvider>
}
