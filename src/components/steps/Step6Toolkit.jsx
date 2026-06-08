import { useState } from 'react'
import InlineCreate from '../ui/InlineCreate'

const CATEGORY_COLOR = {
  breathing: '#8BADB5', grounding: '#7A9E7E', somatic: '#C4863A',
  reframe: '#B5735A', compassion: '#9B8E9E', curiosity: '#7A8E9E',
  courage: '#C4863A', other: '#8A7968',
}

export default function Step6Toolkit({ draft, setDraft, onNext, toolkitHook }) {
  const [selectedIds, setSelectedIds] = useState(draft.toolkit_item_ids || [])
  const { items, add } = toolkitHook

  function handleNext() {
    setDraft(d => ({ ...d, toolkit_item_ids: selectedIds }))
    onNext()
  }

  return (
    <div style={shell}>
      <div style={questionBlock}>
        <h2 style={question}>What is a better way to handle this?</h2>
        <p style={support}>A resource, practice, or quality you can bring to this moment.</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.length === 0 && (
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '17px', fontStyle: 'italic', color: 'var(--text-soft)', textAlign: 'center', padding: '16px 0' }}>
            No toolkit items yet. Add one below.
          </p>
        )}
        {items.map(item => {
          const isOn = selectedIds.includes(item.id)
          return (
          <button
            key={item.id}
            onClick={() => setSelectedIds(prev => isOn ? prev.filter(id => id !== item.id) : [...prev, item.id])}
            style={{
              width: '100%', textAlign: 'left', cursor: 'pointer',
              background: isOn ? 'rgba(122,158,126,0.1)' : 'var(--bg-surface)',
              border: '1px solid',
              borderColor: isOn ? 'var(--accent-sage)' : 'var(--border-subtle)',
              borderLeft: `3px solid ${isOn ? 'var(--accent-sage)' : 'var(--border-subtle)'}`,
              borderRadius: '12px', padding: '13px 16px',
              fontFamily: '"DM Sans", sans-serif', fontSize: '15px', fontWeight: '500',
              color: 'var(--text-primary)',
              transition: 'all 0.15s ease',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px',
            }}
          >
            <span>
              {item.name}
              {item.description && (
                <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-soft)', fontWeight: '400', marginTop: '3px' }}>
                  {item.description}
                </span>
              )}
            </span>
            {item.category && (
              <span style={{
                fontSize: '10px', fontWeight: '500', letterSpacing: '0.05em',
                textTransform: 'uppercase', color: '#fff',
                background: CATEGORY_COLOR[item.category] || '#8A7968',
                borderRadius: '20px', padding: '2px 8px', whiteSpace: 'nowrap', flexShrink: 0,
                marginTop: '2px',
              }}>
                {item.category}
              </span>
            )}
          </button>
          )
        })}

        <InlineCreate bucketType="toolkit" onAdd={add} />
      </div>

      <div style={footer}>
        <button onClick={handleNext} className="btn btn-primary btn-full">
          continue →
        </button>
        <button onClick={() => { setDraft(d => ({ ...d, toolkit_item_ids: [] })); onNext() }} style={skipLink}>
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
