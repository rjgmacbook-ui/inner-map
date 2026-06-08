import { useState } from 'react'

const CATEGORY_OPTIONS = ['breathing', 'grounding', 'somatic', 'reframe', 'compassion', 'curiosity', 'courage', 'other']

const CATEGORY_LABELS = {
  breathing: 'breathing', grounding: 'grounding', somatic: 'somatic',
  reframe: 'reframe', compassion: 'compassion', curiosity: 'curiosity',
  courage: 'courage', other: 'other',
}

export default function BucketCard({ item, bucketType, accentColor, onDelete, onUpdate }) {
  const [hovered, setHovered]           = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [editing, setEditing]           = useState(false)

  // Edit form state — pre-filled from item
  const [editName, setEditName]           = useState(item.name)
  const [editDesc, setEditDesc]           = useState(item.description || '')
  const [editCategory, setEditCategory]   = useState(item.category || 'other')
  const [saving, setSaving]               = useState(false)

  function handleDelete(e) {
    e.stopPropagation()
    if (confirmDelete) {
      onDelete(item.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 2500)
    }
  }

  function startEdit() {
    setEditName(item.name)
    setEditDesc(item.description || '')
    setEditCategory(item.category || 'other')
    setEditing(true)
  }

  async function saveEdit() {
    if (!editName.trim()) return
    setSaving(true)
    const patch = { name: editName.trim() }
    if (bucketType === 'triggers' || bucketType === 'reactions') patch.description = editDesc.trim() || null
    if (bucketType === 'charges') patch.description = editDesc.trim() || null
    if (bucketType === 'toolkit') { patch.description = editDesc.trim() || null; patch.category = editCategory }
    await onUpdate(item.id, patch)
    setSaving(false)
    setEditing(false)
  }

  // ── Edit mode ──────────────────────────────────────────────────
  if (editing) {
    return (
      <div style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${accentColor}`,
        borderLeft: `3px solid ${accentColor}`,
        borderRadius: '12px',
        padding: '14px 16px',
        display: 'flex', flexDirection: 'column', gap: '10px',
        animation: 'fadeIn 0.15s ease-out both',
      }}>
        <input
          type="text"
          value={editName}
          onChange={e => setEditName(e.target.value)}
          placeholder="name"
          autoFocus
          style={inputStyle}
        />

        {(bucketType === 'triggers' || bucketType === 'reactions' || bucketType === 'charges') && (
          <textarea
            value={editDesc}
            onChange={e => setEditDesc(e.target.value)}
            placeholder="description (optional)"
            rows={2}
            style={{ ...inputStyle, resize: 'none', lineHeight: '1.5' }}
          />
        )}

        {bucketType === 'toolkit' && (
          <>
            <select
              value={editCategory}
              onChange={e => setEditCategory(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {CATEGORY_OPTIONS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <textarea
              value={editDesc}
              onChange={e => setEditDesc(e.target.value)}
              placeholder="description (optional)"
              rows={2}
              style={{ ...inputStyle, resize: 'none', lineHeight: '1.5' }}
            />
          </>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={saveEdit}
            disabled={saving || !editName.trim()}
            style={{
              flex: 1,
              background: accentColor, color: '#fff',
              border: 'none', borderRadius: '8px',
              padding: '8px 12px',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '13px', fontWeight: '500',
              cursor: saving || !editName.trim() ? 'not-allowed' : 'pointer',
              opacity: saving || !editName.trim() ? 0.6 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {saving ? '...' : 'save'}
          </button>
          <button
            onClick={() => setEditing(false)}
            style={{
              background: 'none',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '8px 14px',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '13px', color: 'var(--text-soft)',
              cursor: 'pointer',
            }}
          >
            cancel
          </button>
        </div>
      </div>
    )
  }

  // ── Display mode ───────────────────────────────────────────────
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirmDelete(false) }}
      style={{
        background: hovered ? 'var(--bg-surface)' : 'var(--bg-base)',
        border: '1px solid var(--border-subtle)',
        borderLeft: `3px solid ${accentColor}`,
        borderRadius: '12px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        transition: 'background 0.15s ease',
        position: 'relative',
      }}
    >
      {/* Accent dot */}
      <div style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: accentColor, flexShrink: 0, marginTop: '6px',
      }} />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '15px', fontWeight: '500',
            color: 'var(--text-primary)', lineHeight: '1.3',
          }}>
            {item.name}
          </span>

          {bucketType === 'toolkit' && item.category && (
            <span style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '10px', fontWeight: '500',
              letterSpacing: '0.05em', textTransform: 'uppercase',
              color: '#fff', background: 'var(--accent-sage)',
              borderRadius: '20px', padding: '2px 8px',
            }}>
              {CATEGORY_LABELS[item.category] || item.category}
            </span>
          )}
        </div>

        {item.description && (
          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '13px', color: 'var(--text-soft)',
            marginTop: '3px', lineHeight: '1.4',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {item.description}
          </p>
        )}
      </div>


      {/* Action buttons — edit + delete */}
      {(hovered || confirmDelete) && (
        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          {!confirmDelete && (
            <button
              onClick={startEdit}
              title="Edit"
              style={{
                background: 'none',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                width: '26px', height: '26px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-soft)',
                flexShrink: 0,
                padding: 0,
                transition: 'all 0.15s',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          )}
          <button
            onClick={handleDelete}
            title={confirmDelete ? 'Tap again to confirm' : 'Delete'}
            style={{
              background: confirmDelete ? '#C0442A' : 'none',
              border: confirmDelete ? 'none' : '1px solid var(--border-subtle)',
              borderRadius: '6px',
              width: '26px', height: '26px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: confirmDelete ? '#fff' : 'var(--text-soft)',
              fontSize: '14px', flexShrink: 0,
              transition: 'all 0.15s',
              padding: 0,
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            {confirmDelete ? '✓' : '×'}
          </button>
        </div>
      )}
    </div>
  )
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  background: 'var(--bg-base)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '8px',
  padding: '9px 12px',
  fontFamily: '"DM Sans", sans-serif',
  fontSize: '14px', color: 'var(--text-primary)',
  outline: 'none',
  transition: 'border-color 0.15s',
}

