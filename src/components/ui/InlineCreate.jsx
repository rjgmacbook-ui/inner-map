import { useState } from 'react'
import EmotionSlider from './EmotionSlider'

const BUCKET_LABELS = {
  triggers:  'trigger',
  charges:   'emotional charge',
  reactions: 'reaction',
  toolkit:   'toolkit item',
}

const CATEGORIES = [
  'breathing', 'grounding', 'somatic', 'reframe',
  'compassion', 'curiosity', 'courage', 'other',
]

export default function InlineCreate({ bucketType, onAdd }) {
  const [isOpen, setIsOpen]         = useState(false)
  const [name, setName]             = useState('')
  const [description, setDesc]      = useState('')
  const [intensity, setIntensity]   = useState(5)
  const [category, setCategory]     = useState('other')
  const [isSubmitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')

  function reset() {
    setName(''); setDesc(''); setIntensity(5); setCategory('other'); setError('')
  }

  function close() { reset(); setIsOpen(false) }

  async function handleSave() {
    if (!name.trim()) { setError('A name is required.'); return }
    setError(''); setSubmitting(true)
    try {
      const payload = { name: name.trim() }
      if (bucketType === 'charges' || bucketType === 'triggers' || bucketType === 'reactions') {
        if (description.trim()) payload.description = description.trim()
      }
      if (bucketType === 'toolkit') {
        payload.category = category
        if (description.trim()) payload.description = description.trim()
      }
      await onAdd(payload)
      close()
    } catch (err) {
      setError(err.message || 'Could not save. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const label = BUCKET_LABELS[bucketType] || 'item'

  return (
    <div style={{ marginBottom: '8px' }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--accent-amber)',
            padding: '8px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            letterSpacing: '0.01em',
          }}
        >
          <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span>
          add {label}
        </button>
      ) : (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '18px',
          animation: 'fadeIn 0.2s ease-out both',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}>
          {/* Name field */}
          <div>
            <label style={labelStyle}>name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={`what is this ${label}?`}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              style={inputStyle}
            />
          </div>

          {/* Toolkit: category select */}
          {bucketType === 'toolkit' && (
            <div>
              <label style={labelStyle}>category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{
                  ...inputStyle,
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238A7968' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 14px center',
                  paddingRight: '36px',
                  cursor: 'pointer',
                }}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {/* Description for triggers, charges, reactions, toolkit */}
          {(bucketType === 'triggers' || bucketType === 'charges' || bucketType === 'reactions' || bucketType === 'toolkit') && (
            <div>
              <label style={labelStyle}>description <span style={{ opacity: 0.5 }}>(optional)</span></label>
              <textarea
                value={description}
                onChange={e => setDesc(e.target.value)}
                placeholder="add a note if it helps..."
                rows={2}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '64px',
                  lineHeight: '1.5',
                }}
              />
            </div>
          )}

          {error && (
            <p style={{ fontSize: '12px', color: '#C0442A', fontFamily: '"DM Sans", sans-serif' }}>
              {error}
            </p>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ flex: 1, opacity: isSubmitting ? 0.7 : 1, fontSize: '14px', padding: '10px' }}
            >
              {isSubmitting ? '...' : 'save'}
            </button>
            <button
              onClick={close}
              className="btn btn-ghost"
              style={{ fontSize: '14px', padding: '10px 16px' }}
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontFamily: '"DM Sans", sans-serif',
  fontSize: '11px',
  fontWeight: '500',
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: 'var(--text-soft)',
  marginBottom: '6px',
}

const inputStyle = {
  width: '100%',
  background: 'var(--bg-base)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '10px',
  padding: '11px 14px',
  fontFamily: '"DM Sans", sans-serif',
  fontSize: '15px',
  color: 'var(--text-primary)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}
