import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { defaultFeeds, defaultExpenseNames, deepClone } from '../lib/utils'

const FarmContext = createContext(null)

const defaultPeriodShares = {
  starter: [30, 20, 20, 15, 10, 5],
  growth:  [25, 10, 30, 20, 10, 5],
  finish:  [15,  5, 35, 30, 10, 5],
}

export function FarmProvider({ children }) {
  const { user } = useAuth()
  const [farms, setFarms] = useState([])
  const [selectedFarmId, setSelectedFarmId] = useState(null)
  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const [groupData, setGroupData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const selectedFarm  = farms.find(f => f.id === selectedFarmId) || farms[0] || null
  const selectedGroup = selectedFarm?.groups?.find(g => g.id === selectedGroupId) || selectedFarm?.groups?.[0] || null

  // Load farms from Supabase
  const loadFarms = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data: farmsData } = await supabase
      .from('farms')
      .select('*, groups(*, group_data(*))')
      .eq('user_id', user.id)
      .order('created_at')

    if (farmsData && farmsData.length) {
      setFarms(farmsData)
      const firstFarm = farmsData[0]
      setSelectedFarmId(firstFarm.id)
      const firstGroup = firstFarm.groups?.[0]
      if (firstGroup) {
        setSelectedGroupId(firstGroup.id)
        await loadGroupData(firstGroup.id)
      }
    } else {
      // Create default farm + group
      await createFarm('Çiftlik 1', true)
    }
    setLoading(false)
  }, [user])

  useEffect(() => { loadFarms() }, [loadFarms])

  async function loadGroupData(groupId) {
    const { data } = await supabase
      .from('group_data')
      .select('*')
      .eq('group_id', groupId)
      .single()

    if (data) {
      setGroupData({
        selectedPeriod: data.selected_period || 'starter',
        startDate:      data.start_date || '',
        animalCount:    data.animal_count || 100,
        avgWeight:      data.avg_weight || 300,
        winterMode:     data.winter_mode || false,
        dmRate:         data.dm_rate || 2.2,
        feedItems:      data.feed_items || deepClone(defaultFeeds),
        periodShares:   data.period_shares || deepClone(defaultPeriodShares),
        purchaseWeight: data.purchase_weight || 300,
        purchasePrice:  data.purchase_price || 260,
        finalWeight:    data.final_weight || 600,
        carcassYield:   data.carcass_yield || 58,
        carcassPrice:   data.carcass_price || 430,
        analysisAnimalCount: data.analysis_animal_count || 100,
      })
    } else {
      setGroupData({
        selectedPeriod: 'starter',
        startDate: '',
        animalCount: 100,
        avgWeight: 300,
        winterMode: false,
        dmRate: 2.2,
        feedItems: deepClone(defaultFeeds),
        periodShares: deepClone(defaultPeriodShares),
        purchaseWeight: 300,
        purchasePrice: 260,
        finalWeight: 600,
        carcassYield: 58,
        carcassPrice: 430,
        analysisAnimalCount: 100,
      })
    }
  }

  async function saveGroupData(data) {
    if (!selectedGroupId) return
    setSaving(true)
    const payload = {
      group_id:             selectedGroupId,
      selected_period:      data.selectedPeriod,
      start_date:           data.startDate,
      animal_count:         data.animalCount,
      avg_weight:           data.avgWeight,
      winter_mode:          data.winterMode,
      dm_rate:              data.dmRate,
      feed_items:           data.feedItems,
      period_shares:        data.periodShares,
      purchase_weight:      data.purchaseWeight,
      purchase_price:       data.purchasePrice,
      final_weight:         data.finalWeight,
      carcass_yield:        data.carcassYield,
      carcass_price:        data.carcassPrice,
      analysis_animal_count:data.analysisAnimalCount,
      updated_at:           new Date().toISOString(),
    }
    await supabase.from('group_data').upsert(payload, { onConflict: 'group_id' })
    setGroupData(data)
    setSaving(false)
  }

  async function createFarm(name, isFirst = false) {
    const { data: farm } = await supabase
      .from('farms')
      .insert({ user_id: user.id, name })
      .select()
      .single()

    if (farm) {
      const { data: group } = await supabase
        .from('groups')
        .insert({ farm_id: farm.id, name: 'Grup 1' })
        .select()
        .single()

      await loadFarms()
      if (isFirst || group) {
        setSelectedFarmId(farm.id)
        setSelectedGroupId(group?.id)
      }
    }
  }

  async function createGroup(name) {
    if (!selectedFarmId) return
    const { data: group } = await supabase
      .from('groups')
      .insert({ farm_id: selectedFarmId, name })
      .select()
      .single()
    await loadFarms()
    if (group) {
      setSelectedGroupId(group.id)
      await loadGroupData(group.id)
    }
  }

  async function renameFarm(id, name) {
    await supabase.from('farms').update({ name }).eq('id', id)
    await loadFarms()
  }

  async function renameGroup(id, name) {
    await supabase.from('groups').update({ name }).eq('id', id)
    await loadFarms()
  }

  async function deleteFarm(id) {
    await supabase.from('farms').delete().eq('id', id)
    await loadFarms()
  }

  async function deleteGroup(id) {
    await supabase.from('groups').delete().eq('id', id)
    await loadFarms()
  }

  async function switchFarm(farmId) {
    setSelectedFarmId(farmId)
    const farm = farms.find(f => f.id === farmId)
    const firstGroup = farm?.groups?.[0]
    if (firstGroup) {
      setSelectedGroupId(firstGroup.id)
      await loadGroupData(firstGroup.id)
    }
  }

  async function switchGroup(groupId) {
    setSelectedGroupId(groupId)
    await loadGroupData(groupId)
  }

  return (
    <FarmContext.Provider value={{
      farms, selectedFarm, selectedGroup,
      selectedFarmId, selectedGroupId,
      groupData, setGroupData,
      loading, saving,
      loadFarms,
      saveGroupData,
      createFarm, createGroup,
      renameFarm, renameGroup,
      deleteFarm, deleteGroup,
      switchFarm, switchGroup,
    }}>
      {children}
    </FarmContext.Provider>
  )
}

export const useFarm = () => useContext(FarmContext)
