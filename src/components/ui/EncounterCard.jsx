import { useState } from 'react'
import { useApp } from '../../store/AppContext'
import ChargeOrb from './ChargeOrb'

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60)          return 'just now'
  if (diff < 3600)        return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)       return `${Math.floor(diff / 3600)}h ago`
  if (diff < 86400 * 7)   return `${Math.floor(diff / 86400)}d ago`
  return `${Math.floor(diff / 86400 / 7)}w ago`
}

export default function EncounterCard({ encounter, onClick }) {
  const [hovered, setHovered] = useState(false)
  const { chargesHook, reactionsHook } = useApp()

  const leftBorder = 'var(--accent-amber)'

  // Resolve first charge name and its specific intensity
  const firstChargeId = (encounter.charge_ids || [])[0]
  const firstCharge = firstChargeId
    ? chargesHook.charges.find(c => c.id === firstChargeId)
    : null
  const firstIntensity = firstChargeId
    ? (encounter.charge_intensities || {})[firstChargeId] ?? null
    : null
  const extraCharges = (encounter.charge_ids || []).length - 1

  // Whether any reactions were recorded
  const hasReactions = (encounter.reaction_ids || []).length > 0

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', textAlign: 'left', cursor: 'pointer',
        background: hovered ? '#E8E2D4' : 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderLeft: `3px solid ${leftBorder}`,
        borderRadius: '14px',
        padding: '14px 16px',
        display: 'flex', flexDirection: 'column', gap: '8px',
        transition: 'background 0.15s ease',
      }}
    >
      {/* Top row: time + resolved */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '11px', color: 'var(--text-soft)',
          letterSpacing: '0.04em',
        }}>
          {timeAgo(encounter.created_at)}
        </span>
      </div>

      {/* Event description */}
      <p style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '14px', lineHeight: '1.5',
        color: 'var(--text-primary)',
        margin: 0,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {encounter.event_description}
      </p>

      {/* Bottom row: tags + chevron */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
          {/* Trigger pill */}
          {encounter.trigger?.name && (
            <span style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '11px', fontWeight: '500',
              background: 'rgba(196,134,58,0.12)',
              color: 'var(--accent-amber)',
              border: '1px solid rgba(196,134,58,0.25)',
              borderRadius: '20px', padding: '2px 9px',
              whiteSpace: 'nowrap', maxWidth: '150px',
              overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {encounter.trigger.name.slice(0, 20)}
            </span>
          )}

          {/* First charge orb + name + overflow count */}
          {firstCharge && firstIntensity && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ChargeOrb intensity={firstIntensity} size="sm" />
              <span style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '11px', color: 'var(--accent-mist)',
                maxWidth: '80px', overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {firstCharge.name}
              </span>
              {extraCharges > 0 && (
                <span style={{ fontSize: '10px', color: 'var(--text-soft)' }}>+{extraCharges}</span>
              )}
            </span>
          )}

          {/* Reaction dot(s) */}
          {hasReactions && (
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: 'var(--accent-clay)', flexShrink: 0,
              display: 'inline-block',
            }} />
          )}
        </div>

        {/* Chevron */}
        <span style={{
          color: 'var(--border-subtle)', fontSize: '18px',
          lineHeight: 1, flexShrink: 0,
        }}>›</span>
      </div>
    </button>
  )
}
