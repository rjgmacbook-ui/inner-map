import { useState } from 'react'

export default function Step1Event({ draft, setDraft, onNext }) {
  const [value, setValue] = useState(draft.event_description || '')

  function handleNext() {
    setDraft(d => ({ ...d, event_description: value.trim() }))
    onNext()
  }

  return (
    <div style={shell}>
      <div style={questionBlock}>
        <h2 style={question}>What just happened?</h2>
        <p style={support}>
          Describe the situation, conversation, task, or feeling that's present right now.
        </p>
      </div>

      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Write freely. This is just for you."
        rows={6}
        autoFocus
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
          e.target.style.borderColor = 'var(--accent-amber)'
          e.target.style.boxShadow = '0 0 0 3px rgba(196,134,58,0.1)'
        }}
        onBlur={e => {
          e.target.style.borderColor = 'var(--border-subtle)'
          e.target.style.boxShadow = 'none'
        }}
      />

      <div style={footer}>
        <button
          onClick={handleNext}
          disabled={!value.trim()}
          className="btn btn-primary btn-full"
          style={{ opacity: value.trim() ? 1 : 0.4 }}
        >
          continue →
        </button>
      </div>
    </div>
  )
}

const shell = {
  display: 'flex', flexDirection: 'column', gap: '28px',
  padding: '32px 24px 24px', height: '100%',
}
const questionBlock = { display: 'flex', flexDirection: 'column', gap: '10px' }
const question = {
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '30px', fontWeight: '400', fontStyle: 'italic',
  color: 'var(--text-primary)', margin: 0, lineHeight: '1.2',
}
const support = {
  fontFamily: '"DM Sans", sans-serif', fontSize: '14px',
  color: 'var(--text-soft)', lineHeight: '1.6', margin: 0,
}
const footer = { marginTop: 'auto' }
