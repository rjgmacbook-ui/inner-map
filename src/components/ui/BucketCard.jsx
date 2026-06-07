import { useState } from 'react'
import ChargeOrb from './ChargeOrb'

const CATEGORY_LABELS = {
  breathing:   'breathing',
  grounding:   'grounding',
  somatic:     'somatic',
  reframe:     'reframe',
  compassion:  'compassion',
  curiosity:   'curiosity',
  courage:     'courage',
  other:       'other',
}

export default function BucketCard({ item, bucketType, accentColor, onDelete }) {
  const [hovered, setHovered] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function handleDelete(e) {
    e.stopPropagation()
    if (confirmDelete) {
      onDelete(item.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 2500)
    }
  }

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
        background: accentColor,
        flexShrink: 0,
        marginTop: '6px',
      }} />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '15px',
            fontWeight: '500',
            color: 'var(--text-primary)',
            lineHeight: '1.3',
          }}>
            {item.name}
          </span>

          {/* Toolkit category badge */}
          {bucketType === 'toolkit' && item.category && (
            <span style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '10px',
              fontWeight: '500',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#fff',
              background: 'var(--accent-sage)',
              borderRadius: '20px',
              padding: '2px 8px',
            }}>
              {CATEGORY_LABELS[item.category] || item.category}
            </span>
          )}
        </div>

        {/* Description preview */}
        {item.description && (
          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '13px',
            color: 'var(--text-soft)',
            marginTop: '3px',
            lineHeight: '1.4',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {item.description}
          </p>
        )}
      </div>

      {/* Charge intensity orb for emotional charges */}
      {bucketType === 'charges' && item.typical_intensity && (
        <ChargeOrb intensity={item.typical_intensity} size="sm" />
      )}

      {/* Delete button */}
      {(hovered || confirmDelete) && (
        <button
          onClick={handleDelete}
          style={{
            background: confirmDelete ? '#C0442A' : 'none',
            border: confirmDelete ? 'none' : '1px solid var(--border-subtle)',
            borderRadius: '6px',
            width: '26px', height: '26px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            color: confirmDelete ? '#fff' : 'var(--text-soft)',
            fontSize: '14px',
            flexShrink: 0,
            transition: 'all 0.15s',
            padding: 0,
            fontFamily: '"DM Sans", sans-serif',
          }}
          title={confirmDelete ? 'Tap again to confirm' : 'Delete'}
        >
          {confirmDelete ? '✓' : '×'}
        </button>
      )}
    </div>
  )
}
