import { useState } from 'react'
import InlineCreate from '../ui/InlineCreate'
import EmotionSlider from '../ui/EmotionSlider'

export default function Step3Charge({ draft, setDraft, onNext, chargesHook }) {
  const [selectedIds, setSelectedIds] = useState(draft.charge_ids || [])
  const [intensity, setIntensity]     = useState(draft.charge_intensity || 5)
  const { charges, add } = chargesHook

  function handleSelect(charge) {
    setSelectedIds(prev =>
      prev.includes(charge.id)
        ? prev.filter(id => id !== charge.id)
        : [...prev, charge.id]
    )
  }

  function handleNext() {
    setDraft(d => ({ ...d, charge_ids: selectedIds, charge_intensity: selectedIds.length ? intensity : null }))
    onNext()
  }

  return (
    <div style={shell}>
      <div style={questionBlock}>
        <h2 style={question}>What's the emotional charge?</h2>
        <p style={support}>The energy underneath the event.</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {charges.length === 0 && (
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '17px', fontStyle: 'italic', color: 'var(--text-soft)', textAlign: 'center', padding: '16px 0' }}>
            No charges added yet. Add one below.
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {charges.map(c => {
            const isOn = selectedIds.includes(c.id)
            return (
              <button
                key={c.id}
                onClick={() => handleSelect(c)}
                style={{
                  background: isOn ? 'rgba(139,173,181,0.18)' : 'var(--bg-surface)',
                  border: `1.5px solid ${isOn ? 'var(--accent-mist)' : 'var(--border-subtle)'}`,
                  borderRadius: '100px',
                  padding: '9px 18px',
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '14px',
                  fontWeight: isOn ? '500' : '400',
                  color: isOn ? '#5A8A96' : 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {c.name}
              </button>
            )
          })}
        </div>

        {/* Intensity slider — shown after at least one selection */}
        {selectedIds.length > 0 && (
          <div style={{
            marginTop: '16px',
            background: 'var(--bg-surface)',
            borderRadius: '16px',
            padding: '20px',
            animation: 'fadeIn 0.25s ease-out both',
          }}>
            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '13px',
              fontWeight: '500', letterSpacing: '0.04em',
              color: 'var(--text-soft)', marginBottom: '20px',
              textTransform: 'uppercase', fontSize: '11px',
            }}>
              Right now, how intense does it feel?
            </p>
            <EmotionSlider value={intensity} onChange={setIntensity} />
          </div>
        )}

        <InlineCreate bucketType="charges" onAdd={add} />
      </div>

      <div style={footer}>
        <button onClick={handleNext} className="btn btn-primary btn-full">
          continue →
        </button>
        <button onClick={() => { setDraft(d => ({ ...d, charge_ids: [], charge_intensity: null })); onNext() }} style={skipLink}>
          skip for now
        </button>
      </div>
    </div>
  )
}

const shell = { display: 'flex', flexDirection: 'column', gap: '24px', padding: '32px 24px 24px', height: '100%' }
const questionBlock = { display: 'flex', flexDirection: 'column', gap: '10px' }
const question = { fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '30px', fontWeight: '400', fontStyle: 'italic', color: 'var(--text-primary)', margin: 0, lineHeight: '1.2' }
const support = { fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: 'var(--text-soft)', lineHeight: '1.6', margin: 0 }
const footer = { marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }
const skipLink = { background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: 'var(--text-soft)', padding: '4px' }
