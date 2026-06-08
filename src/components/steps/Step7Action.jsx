import { useState } from 'react'

export default function Step7Action({ draft, setDraft, onNext }) {
  const [value, setValue] = useState(draft.next_action || '')
  const [saving, setSaving] = useState(false)

  async function handleComplete() {
    setSaving(true)
    await onNext(value.trim())
    setSaving(false)
  }

  return (
    <div style={shell}>
      <div style={questionBlock}>
        <h2 style={question}>What is the next clear action?</h2>
        <p style={support}>
          One small, concrete step. Not a plan — just the next thing.
        </p>
      </div>

      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="e.g. Send that message. Take a walk. Rest for 10 minutes."
        rows={4}
        style={{
          width: '100%',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '16px',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '16px',
          lineHeight: '1.65',
          color: 'var(--text-primary)',
          resize: 'none',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
        onFocus={e => {
          e.target.style.borderColor = 'var(--accent-sage)'
          e.target.style.boxShadow = '0 0 0 3px rgba(122,158,126,0.12)'
        }}
        onBlur={e => {
          e.target.style.borderColor = 'var(--border-subtle)'
          e.target.style.boxShadow = 'none'
        }}
      />

      {/* Closing note */}
      <p style={{
        fontFamily: '"Cormorant Garamond", Georgia, serif',
        fontSize: '16px',
        fontStyle: 'italic',
        color: 'var(--text-soft)',
        textAlign: 'center',
        lineHeight: '1.6',
        margin: 0,
      }}>
        You've moved through something. That matters.
      </p>

      <div style={footer}>
        <button
          onClick={handleComplete}
          disabled={saving}
          className="btn btn-primary btn-full"
          style={{
            opacity: saving ? 0.7 : 1,
            fontSize: '15px',
            letterSpacing: '0.03em',
            padding: '15px',
          }}
        >
          {saving ? '...' : 'complete encounter'}
        </button>
      </div>
    </div>
  )
}

const shell = { display: 'flex', flexDirection: 'column', gap: '28px', padding: '32px 24px 24px', height: '100%' }
const questionBlock = { display: 'flex', flexDirection: 'column', gap: '10px' }
const question = { fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '30px', fontWeight: '400', fontStyle: 'italic', color: 'var(--text-primary)', margin: 0, lineHeight: '1.2' }
const support = { fontFamily: '"DM Sans", sans-serif', fontSize: '14px', color: 'var(--text-soft)', lineHeight: '1.6', margin: 0 }
const footer = { marginTop: 'auto' }
