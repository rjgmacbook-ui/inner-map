import { useState } from 'react'
import SearchableMultiSelect from '../ui/SearchableMultiSelect'

export default function Step3Charge({ draft, setDraft, onNext, chargesHook }) {
  const [selectedIds, setSelectedIds] = useState(draft.charge_ids || [])
  const [intensities, setIntensities] = useState(draft.charge_intensities || {})
  const { charges, add } = chargesHook

  function handleChange(newIds) {
    // Auto-init intensity for newly added charges
    const next = { ...intensities }
    newIds.forEach(id => { if (next[id] == null) next[id] = 5 })
    setSelectedIds(newIds)
    setIntensities(next)
  }

  function removeCharge(id) {
    setSelectedIds(prev => prev.filter(i => i !== id))
    setIntensities(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  function handleNext() {
    setDraft(d => ({
      ...d,
      charge_ids: selectedIds,
      charge_intensities: selectedIds.length ? intensities : {},
    }))
    onNext()
  }

  const selectedCharges = selectedIds.map(id => charges.find(c => c.id === id)).filter(Boolean)

  return (
    <div style={shell}>
      <div style={questionBlock}>
        <h2 style={question}>What's the emotional charge?</h2>
        <p style={support}>Select one or more. Set the intensity for each.</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <SearchableMultiSelect
          items={charges}
          selectedIds={selectedIds}
          onChange={handleChange}
          onCreateItem={name => add({ name })}
          placeholder="search or create a charge…"
          accentColor="var(--accent-mist)"
          showPills={false}
        />

        {/* Selected charges with intensity sliders */}
        {selectedCharges.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {selectedCharges.map(charge => {
              const intensity = intensities[charge.id] ?? 5
              return (
                <div
                  key={charge.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    background: 'var(--bg-surface)',
                    border: '1px solid rgba(139,173,181,0.35)',
                    borderLeft: '3px solid var(--accent-mist)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    animation: 'fadeIn 0.2s ease-out both',
                  }}
                >
                  <span style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '14px', fontWeight: '500',
                    color: 'var(--text-primary)',
                    minWidth: '80px', maxWidth: '110px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>
                    {charge.name}
                  </span>

                  <input
                    type="range"
                    min="1" max="10"
                    value={intensity}
                    onChange={e => setIntensities(prev => ({ ...prev, [charge.id]: Number(e.target.value) }))}
                    style={{ flex: 1, margin: 0, height: '4px', cursor: 'pointer' }}
                  />

                  <span style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '13px', fontWeight: '400',
                    color: intensity >= 7 ? 'var(--accent-clay)' : intensity >= 4 ? 'var(--accent-amber)' : 'var(--accent-mist)',
                    width: '18px', textAlign: 'right', flexShrink: 0,
                  }}>
                    {intensity}
                  </span>

                  <button
                    onClick={() => removeCharge(charge.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-soft)', fontSize: '16px',
                      padding: '0 0 0 4px', lineHeight: 1, flexShrink: 0,
                      opacity: 0.5, transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {charges.length === 0 && selectedIds.length === 0 && (
          <p style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '17px', fontStyle: 'italic',
            color: 'var(--text-soft)', padding: '8px 0',
          }}>
            Type a charge name to create your first one.
          </p>
        )}
      </div>

      <div style={footer}>
        <button onClick={handleNext} className="btn btn-primary btn-full">
          continue →
        </button>
        <button
          onClick={() => { setDraft(d => ({ ...d, charge_ids: [], charge_intensities: {} })); onNext() }}
          style={skipLink}
        >
          skip for now
        </button>
      </div>
    </div>
  )
}

const shell = { display: 'flex', flexDirection: 'column', gap: '20px', padding: '32px 24px 24px', height: '100%' }
const questionBlock = { display: 'flex', flexDirection: 'column', gap: '10px' }
const question = { fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '30px', fontWeight: '400', fontStyle: 'italic', color: 'var(--text-primary)', margin: 0, lineHeight: '1.2' }
const support = { fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: 'var(--text-soft)', lineHeight: '1.6', margin: 0 }
const footer = { marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }
const skipLink = { background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: 'var(--text-soft)', padding: '4px' }
