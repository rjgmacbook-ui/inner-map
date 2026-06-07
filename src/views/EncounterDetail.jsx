import { useState } from 'react'
import { useApp } from '../store/AppContext'
import ChargeOrb from '../components/ui/ChargeOrb'

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
    hour: '2-digit', minute: '2-digit', hour12: true,
  }).replace(',', ' ·')
}

function TimelineRow({ number, label, value, children, isLast }) {
  return (
    <div style={{ display: 'flex', gap: '14px' }}>
      {/* Number + connector */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: '24px', height: '24px', borderRadius: '50%',
          background: 'var(--bg-surface)',
          border: '1.5px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '10px', color: 'var(--text-soft)',
          flexShrink: 0,
        }}>
          {number}
        </div>
        {!isLast && (
          <div style={{ width: '1px', flex: 1, background: 'var(--border-subtle)', marginTop: '4px', minHeight: '20px' }} />
        )}
      </div>

      {/* Content */}
      <div style={{ paddingBottom: isLast ? 0 : '20px', flex: 1, paddingTop: '2px' }}>
        <p style={{
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '10px', fontWeight: '500',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--text-soft)', margin: '0 0 4px',
        }}>
          {label}
        </p>
        {children || (
          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '15px', color: value ? 'var(--text-primary)' : 'var(--text-soft)',
            margin: 0, fontStyle: value ? 'normal' : 'italic',
          }}>
            {value || '—'}
          </p>
        )}
      </div>
    </div>
  )
}

export default function EncounterDetail() {
  const { navigate, selectedEncounterId, encountersHook, chargesHook, reactionsHook, toolkitHook } = useApp()
  const { encounters, update } = encountersHook

  const encounter = encounters.find(e => e.id === selectedEncounterId)

  const [editingReflection, setEditingReflection] = useState(false)
  const [reflectionText, setReflectionText]       = useState('')
  const [savingReflection, setSavingReflection]   = useState(false)
  const [savingResolved, setSavingResolved]        = useState(false)

  if (!encounter) {
    return (
      <div style={{ padding: '48px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '20px', fontStyle: 'italic', color: 'var(--text-soft)', marginBottom: '20px' }}>
          Encounter not found.
        </p>
        <button onClick={() => navigate('dashboard')} className="btn btn-ghost">← back</button>
      </div>
    )
  }

  async function saveReflection() {
    setSavingReflection(true)
    await update(encounter.id, { reflection_note: reflectionText.trim() })
    setSavingReflection(false)
    setEditingReflection(false)
  }

  async function markResolved() {
    setSavingResolved(true)
    await update(encounter.id, { resolved: true })
    setSavingResolved(false)
  }

  return (
    <div style={{ animation: 'fadeIn 0.35s ease-out both', paddingBottom: '100px' }}>
      {/* Header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky', top: 0,
        background: 'var(--bg-base)', zIndex: 10,
      }}>
        <button onClick={() => navigate('dashboard')} style={iconBtn}>←</button>
        <span style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: '16px', fontStyle: 'italic', color: 'var(--text-soft)',
        }}>
          encounter
        </span>
        <div style={{ width: '32px' }} />
      </div>

      <div style={{ padding: '20px 24px 0' }}>
        {/* Date */}
        <p style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '11px', color: 'var(--text-soft)',
          letterSpacing: '0.04em', margin: '0 0 20px',
        }}>
          {formatDate(encounter.created_at)}
        </p>

        {/* Event description card */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderLeft: '3px solid var(--accent-amber)',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '28px',
        }}>
          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '16px', lineHeight: '1.7',
            color: 'var(--text-primary)', margin: 0,
          }}>
            {encounter.event_description}
          </p>
        </div>

        {/* Timeline */}
        <div style={{ marginBottom: '28px' }}>
          <p style={sLabel}>journey</p>

          <TimelineRow number="1" label="Trigger" value={encounter.trigger?.name} />
          <TimelineRow number="2" label="Emotional Charge">
            {(encounter.charge_ids || []).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {encounter.charge_ids.map(cid => {
                  const charge = chargesHook.charges.find(c => c.id === cid)
                  if (!charge) return null
                  return (
                    <div key={cid} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ChargeOrb intensity={encounter.charge_intensity || 5} size="sm" />
                      <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '15px', color: 'var(--text-primary)' }}>
                        {charge.name}
                        {encounter.charge_intensity && (
                          <span style={{ color: 'var(--text-soft)', fontStyle: 'italic' }}>
                            {' '}· intensity {encounter.charge_intensity}
                          </span>
                        )}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '15px', color: 'var(--text-soft)', margin: 0, fontStyle: 'italic' }}>—</p>
            )}
          </TimelineRow>
          <TimelineRow number="3" label="Default Reaction">
            {(encounter.reaction_ids || []).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {encounter.reaction_ids.map(rid => {
                  const reaction = reactionsHook.reactions.find(r => r.id === rid)
                  return (
                    <p key={rid} style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '15px', color: 'var(--text-primary)', margin: 0 }}>
                      {reaction?.name || rid}
                    </p>
                  )
                })}
              </div>
            ) : (
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '15px', color: 'var(--text-soft)', margin: 0, fontStyle: 'italic' }}>—</p>
            )}
          </TimelineRow>
          <TimelineRow number="4" label="Pause">
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '15px', color: 'var(--text-primary)', margin: 0 }}>
              {encounter.pause_completed
                ? `completed · ${encounter.pause_duration_s}s`
                : <span style={{ color: 'var(--text-soft)', fontStyle: 'italic' }}>skipped</span>
              }
            </p>
          </TimelineRow>
          <TimelineRow number="5" label="Toolkit">
            {(encounter.toolkit_item_ids || []).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {encounter.toolkit_item_ids.map(tid => {
                  const item = toolkitHook.items.find(t => t.id === tid)
                  return (
                    <p key={tid} style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '15px', color: 'var(--text-primary)', margin: 0 }}>
                      {item?.name || tid}
                    </p>
                  )
                })}
              </div>
            ) : (
              <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '15px', color: 'var(--text-soft)', margin: 0, fontStyle: 'italic' }}>—</p>
            )}
          </TimelineRow>
          <TimelineRow number="6" label="Next Action" value={encounter.next_action} isLast />
        </div>

        {/* Reflection note */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px', padding: '16px',
          marginBottom: '20px',
        }}>
          <p style={{ ...sLabel, marginBottom: '10px' }}>reflection</p>

          {encounter.reflection_note && !editingReflection ? (
            <div>
              <p style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: '18px', fontStyle: 'italic',
                lineHeight: '1.6', color: 'var(--text-primary)', margin: '0 0 10px',
              }}>
                {encounter.reflection_note}
              </p>
              <button
                onClick={() => { setReflectionText(encounter.reflection_note); setEditingReflection(true) }}
                style={linkBtn}
              >
                edit
              </button>
            </div>
          ) : editingReflection ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <textarea
                value={reflectionText}
                onChange={e => setReflectionText(e.target.value)}
                placeholder="What do you notice now, looking back?"
                rows={3}
                autoFocus
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px', padding: '12px',
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '15px', lineHeight: '1.6',
                  color: 'var(--text-primary)', resize: 'none', outline: 'none',
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={saveReflection}
                  disabled={savingReflection}
                  className="btn btn-primary"
                  style={{ flex: 1, fontSize: '13px', padding: '9px' }}
                >
                  {savingReflection ? '...' : 'save'}
                </button>
                <button onClick={() => setEditingReflection(false)} className="btn btn-ghost" style={{ fontSize: '13px', padding: '9px 14px' }}>
                  cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { setReflectionText(''); setEditingReflection(true) }}
              style={linkBtn}
            >
              + add reflection
            </button>
          )}
        </div>

        {/* Resolve toggle */}
        <div style={{ textAlign: 'center', paddingBottom: '8px' }}>
          {encounter.resolved ? (
            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '14px',
              color: 'var(--accent-sage)',
            }}>
              ✓ resolved
            </p>
          ) : (
            <button
              onClick={markResolved}
              disabled={savingResolved}
              className="btn btn-ghost btn-full"
              style={{ opacity: savingResolved ? 0.6 : 1, fontSize: '14px' }}
            >
              {savingResolved ? '...' : 'mark as resolved'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const sLabel = {
  fontFamily: '"DM Sans", sans-serif',
  fontSize: '10px', fontWeight: '500',
  letterSpacing: '0.12em', textTransform: 'uppercase',
  color: 'var(--text-soft)', margin: '0 0 14px',
}

const iconBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontFamily: '"DM Sans", sans-serif', fontSize: '20px',
  color: 'var(--text-soft)', padding: '4px 8px', lineHeight: 1,
}

const linkBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontFamily: '"DM Sans", sans-serif', fontSize: '13px',
  color: 'var(--accent-amber)', padding: 0,
}
