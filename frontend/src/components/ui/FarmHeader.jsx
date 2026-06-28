import { useState } from 'react'
import { useFarm } from '../../hooks/useFarm'

export default function FarmHeader({ saving }) {
  const {
    farms, selectedFarm, selectedGroup,
    selectedFarmId, selectedGroupId,
    switchFarm, switchGroup,
    createFarm, createGroup,
    renameFarm, renameGroup,
    deleteFarm, deleteGroup,
  } = useFarm()

  const [modal, setModal] = useState(null) // { type, defaultValue, onSave }
  const [modalVal, setModalVal] = useState('')

  function openModal(type, defaultValue, onSave) {
    setModal({ type, onSave })
    setModalVal(defaultValue || '')
  }

  function saveModal() {
    if (modalVal.trim()) modal.onSave(modalVal.trim())
    setModal(null)
  }

  return (
    <>
      <div style={s.wrap}>
        {/* Farm selector */}
        <div style={s.group}>
          <label style={s.label}>Çiftlik</label>
          <div style={s.row}>
            <select value={selectedFarmId || ''} onChange={e => switchFarm(e.target.value)} style={s.select}>
              {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
            <button className="btn btn-secondary btn-sm" onClick={() =>
              openModal('farm-rename', selectedFarm?.name, v => renameFarm(selectedFarmId, v))} title="Yeniden adlandır">✎</button>
            <button className="btn btn-primary btn-sm" onClick={() =>
              openModal('farm-new', `Çiftlik ${farms.length + 1}`, v => createFarm(v))} title="Yeni çiftlik">+</button>
            <button className="btn btn-danger btn-sm" onClick={() => {
              if (farms.length <= 1) return alert('En az bir çiftlik olmalı.')
              if (confirm(`"${selectedFarm?.name}" silinsin mi? Tüm gruplar ve veriler silinir.`)) deleteFarm(selectedFarmId)
            }} title="Çiftliği sil">🗑</button>
          </div>
        </div>

        {/* Group selector */}
        <div style={s.group}>
          <label style={s.label}>Grup</label>
          <div style={s.row}>
            <select value={selectedGroupId || ''} onChange={e => switchGroup(e.target.value)} style={s.select}>
              {selectedFarm?.groups?.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            <button className="btn btn-secondary btn-sm" onClick={() =>
              openModal('group-rename', selectedGroup?.name, v => renameGroup(selectedGroupId, v))} title="Yeniden adlandır">✎</button>
            <button className="btn btn-primary btn-sm" onClick={() =>
              openModal('group-new', `Grup ${(selectedFarm?.groups?.length || 0) + 1}`, v => createGroup(v))} title="Yeni grup">+</button>
            <button className="btn btn-danger btn-sm" onClick={() => {
              if ((selectedFarm?.groups?.length || 0) <= 1) return alert('En az bir grup olmalı.')
              if (confirm(`"${selectedGroup?.name}" grubu silinsin mi?`)) deleteGroup(selectedGroupId)
            }} title="Grubu sil">🗑</button>
          </div>
        </div>

        {/* Save status */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: '.72rem', fontWeight: 700, padding: '6px 12px',
            borderRadius: 999, background: saving ? '#fffbeb' : '#f0fdf4',
            color: saving ? '#92400e' : '#14532d',
            border: `1px solid ${saving ? '#fde68a' : '#bbf7d0'}`,
          }}>
            {saving ? '⏳ Kaydediliyor...' : '✓ Kaydedildi'}
          </span>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div style={s.overlay} onClick={() => setModal(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight: 700, marginBottom: 12, color: '#163a27' }}>
              {modal.type.includes('rename') ? 'Yeniden Adlandır' : 'Yeni Ekle'}
            </div>
            <input autoFocus value={modalVal} onChange={e => setModalVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveModal()}
              style={{ width: '100%', marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setModal(null)}>İptal</button>
              <button className="btn btn-primary btn-sm" onClick={saveModal}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const s = {
  wrap: { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end', marginBottom: 20, background: '#fff', borderRadius: 16, padding: '14px 16px', border: '1px solid #e0ecd9', boxShadow: '0 2px 8px rgba(0,0,0,.04)' },
  group: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 220 },
  label: { fontSize: '.68rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.04em' },
  row: { display: 'flex', gap: 6, alignItems: 'center' },
  select: { flex: 1, height: 36, borderRadius: 10, border: '1px solid #d1d5db', padding: '0 10px', fontSize: '.84rem' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 300, boxShadow: '0 20px 40px rgba(0,0,0,.15)' },
}
