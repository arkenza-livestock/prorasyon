export const fmt = (n, d = 2) =>
  new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(Number(n) || 0)

export const formatTL = (n) => fmt(n, 2) + ' ₺'

export const today = () => new Date().toISOString().slice(0, 10)

export const uuid = () => crypto.randomUUID()

export const deepClone = (v) => JSON.parse(JSON.stringify(v))

export const periodsDef = {
  starter: { title: 'Başlangıç',  range: '0–60 Gün',    feedRate: 2.8, days: 60  },
  growth:  { title: 'Gelişme',    range: '60–150 Gün',   feedRate: 3.2, days: 90  },
  finish:  { title: 'Bitiş',      range: '150–240 Gün',  feedRate: 3.5, days: 90  },
}

export const defaultFeeds = [
  { name: 'Mısır Silajı',   type: 'Kaba Yem',  price: 2.5,  dm: 35 },
  { name: 'Yonca Kuru Otu', type: 'Kaba Yem',  price: 6.0,  dm: 85 },
  { name: 'Arpa Ezme',      type: 'Kesif Yem', price: 11.0, dm: 89 },
  { name: 'Mısır Kırma',    type: 'Kesif Yem', price: 12.0, dm: 89 },
  { name: 'Soya Küspesi',   type: 'Kesif Yem', price: 18.0, dm: 90 },
  { name: 'Mineral + Tuz',  type: 'Kesif Yem', price: 9.0,  dm: 95 },
]

export const defaultExpenseNames = [
  'İşçilik','Veteriner','Elektrik','Su','Altlık','Nakliye','Kesim','Bakım','Sigorta','Diğer'
]

export const getPeriodByDay = (day) => {
  if (day === null) return 'starter'
  if (day <= 60) return 'starter'
  if (day <= 150) return 'growth'
  return 'finish'
}

export const getDayFromStart = (startDate) => {
  if (!startDate) return null
  const start = new Date(startDate + 'T00:00:00')
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.max(1, Math.floor((today - start) / 86400000) + 1)
}

export const computeDailyMix = (feedItems, periodShares, periodKey, animalCount, avgWeight, winter) => {
  const shares = periodShares[periodKey] || []
  const wetTotal = avgWeight * (periodsDef[periodKey].feedRate / 100)
  const used = shares.map((v, i) => (winter && feedItems[i]?.type === 'Kesif Yem' ? v * 1.08 : v))
  const sum = used.reduce((a, b) => a + b, 0) || 1
  let rough = 0, conc = 0
  const rows = feedItems.map((f, i) => {
    const per = wetTotal * (used[i] / sum)
    const total = per * animalCount
    if (f.type === 'Kaba Yem') rough += total; else conc += total
    return { name: f.name, type: f.type, sharePct: (used[i] / sum) * 100, rawShare: shares[i] || 0, perAnimalKg: per, totalKg: total, index: i }
  })
  return { rows, wetPerAnimalTotal: wetTotal, totalWetFeed: wetTotal * animalCount, totalRoughage: rough, totalConcentrate: conc }
}

export const computePriceAndDM = (feedItems, periodShares, periodKey, animalCount, avgWeight, dmRate, winter) => {
  const shares = periodShares[periodKey] || []
  const used = shares.map((v, i) => (winter && feedItems[i]?.type === 'Kesif Yem' ? v * 1.08 : v))
  const sum = used.reduce((a, b) => a + b, 0) || 1
  const dmNeed = avgWeight * (dmRate / 100)
  let totalDailyCost = 0
  const rows = feedItems.map((f, i) => {
    const dmPart = dmNeed * (used[i] / sum)
    const wetPerAnimal = dmPart / ((f.dm || 1) / 100)
    const wetTotal = wetPerAnimal * animalCount
    const cost = wetTotal * (f.price || 0)
    totalDailyCost += cost
    return { name: f.name, type: f.type, sharePct: (used[i] / sum) * 100, dmPercent: f.dm, wetPerAnimal, wetTotal, price: f.price, cost }
  })
  return { rows, totalDailyCost }
}

export const estimateFeedCost = (feedItems, periodShares, purchaseWeight, finalWeight, animalCount, dmRate, winter) => {
  const avgWeights = {
    starter: (purchaseWeight + (purchaseWeight + (finalWeight - purchaseWeight) * 0.25)) / 2,
    growth:  ((purchaseWeight + (finalWeight - purchaseWeight) * 0.25) + (purchaseWeight + (finalWeight - purchaseWeight) * 0.7)) / 2,
    finish:  ((purchaseWeight + (finalWeight - purchaseWeight) * 0.7) + finalWeight) / 2,
  }
  let totalCost = 0
  for (const k of ['starter', 'growth', 'finish']) {
    const pr = computePriceAndDM(feedItems, periodShares, k, animalCount, avgWeights[k], dmRate, winter)
    totalCost += pr.totalDailyCost * periodsDef[k].days
  }
  return totalCost
}
