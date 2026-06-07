import { useState } from 'react'
import InlineCreate from '../ui/InlineCreate'

export default function Step2Trigger({ draft, setDraft, onNext, triggersHook }) {
  const [selected, setSelected] = useState(draft.trigger_id || null)
  const { triggers, add } = triggersHook

  function handleNext() {
    setDraft(d => ({ ...d, trigger_id: selected }))
    onNext()
  }

  return (
    <div style={shell}>
      <div style={questionBlock}>
        <h2 style={question}>Which trigger does this connect to?</h2>
        <p style={support}>A recurring situation, relationship, or pattern.</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {triggers.length === 0 && (
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '17px', fontStyle: 'italic', color: 'var(--text-soft)', textAlign: 'center', padding: '16px 0' }}>
            No triggers added yet. Add one below.
          </p>
        )}
        {triggers.map(t => (
          <button
            key={t.id}
            onClick={() => setSelected(selected === t.id ? null : t.id)}
            style={{
              width: '100%', textAlign: 'left', cursor: 'pointer',
              background: selected === t.id ? 'rgba(196,134,58,0.08)' : 'var(--bg-surface)',
              border: '1px solid',
              borderColor: selected === t.id ? 'var(--accent-amber)' : 'var(--border-subtle)',
              borderLeft: `3px solid ${selected === t.id ? 'var(--accent-amber)' : 'var(--border-subtle)'}`,
              borderRadius: '12px', padding: '13px 16px',
              fontFamily: '"DM Sans", sans-serif', fontSize: '15px', fontWeight: '500',
              color: 'var(--text-primary)',
              transition: 'all 0.15s ease',
            }}
          >
            {t.name}
            {t.description && (
              <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-soft)', fontWeight: '400', marginTop: '3px' }}>
                {t.description}
              </span>
            )}
          </button>
        ))}

        <InlineCreate bucketType="triggers" onAdd={add} />
      </div>

      <div style={footer}>
        <button onClick={handleNext} className="btn btn-primary btn-full">
          {selected ? 'continue →' : 'continue →'}
        </button>
        <button onClick={() => { setDraft(d => ({ ...d, trigger_id: null })); onNext() }} style={skipLink}>
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
