import { useState, useEffect } from 'react'
import { useApp } from '../store/AppContext'
import { supabase } from '../lib/supabase'
import EncounterCard from '../components/ui/EncounterCard'
import ChargeSparkline from '../components/ui/ChargeSparkline'
import { SkeletonCard } from '../components/ui/Skeleton'
import ErrorBanner from '../components/ui/ErrorBanner'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function todayLabel() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}

const BUCKET_CARDS = [
  { key: 'triggers',  label: 'Triggers',           color: 'var(--accent-amber)', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> },
  { key: 'charges',   label: 'Charges',             color: 'var(--accent-mist)',  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5"/><line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5"/></svg> },
  { key: 'reactions', label: 'Reactions',           color: 'var(--accent-clay)',  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg> },
  { key: 'toolkit',   label: 'Toolkit',             color: 'var(--accent-sage)',  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
]

export default function Dashboard() {
  const { user, navigate, signOut, triggersHook, chargesHook, reactionsHook, toolkitHook, encountersHook } = useApp()
  const [displayName, setDisplayName] = useState('')

  useEffect(() => {
    if (!user?.id) return
    supabase
      .from('user_settings')
      .select('display_name')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        setDisplayName(data?.display_name || user.email?.split('@')[0] || '')
      })
  }, [user?.id])

  const { encounters, loading, error, refetch } = encountersHook
  const recentEncounters = encounters.slice(0, 3)

  const bucketCounts = {
    triggers:  triggersHook.triggers.length,
    charges:   chargesHook.charges.length,
    reactions: reactionsHook.reactions.length,
    toolkit:   toolkitHook.items.length,
  }

  // Last 7 days encounters with charge data for sparkline
  const weekAgo = Date.now() - 7 * 86400 * 1000
  const weekEncounters = encounters.filter(e =>
    new Date(e.created_at).getTime() >= weekAgo &&
    e.charge_intensities && Object.keys(e.charge_intensities).length > 0
  )
  const showSparkline = weekEncounters.length >= 3

  return (
    <div style={{ padding: '0 0 100px', animation: 'fadeIn 0.4s ease-out both' }}>

      {/* Header */}
      <div style={{ padding: '32px 24px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{
              fontFamily: '"DM Sans", sans-serif', fontSize: '12px',
              color: 'var(--text-soft)', letterSpacing: '0.04em',
              margin: '0 0 6px',
            }}>
              {todayLabel()}
            </p>
            <h1 style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '34px', fontWeight: '400', fontStyle: 'italic',
              color: 'var(--text-primary)', margin: 0, lineHeight: 1.15,
            }}>
              {greeting()}{displayName ? `, ${displayName}` : '.'}
            </h1>
          </div>
          <button
            onClick={signOut}
            title="Sign out"
            aria-label="Sign out"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px', color: 'var(--text-soft)',
              opacity: 0.5, transition: 'opacity 0.15s',
              marginTop: '2px', flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
        <div style={{ width: '32px', height: '1.5px', background: 'var(--accent-amber)', borderRadius: '1px', marginTop: '14px' }} />
      </div>

      {/* Error state */}
      <ErrorBanner message={error} onRetry={refetch} />

      {/* Sparkline section */}
      {showSparkline && (
        <div style={{ padding: '0 24px 24px', animation: 'fadeIn 0.5s ease-out 0.1s both' }}>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={sectionLabel}>emotional charge — this week</span>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: 'var(--text-soft)' }}>
                1 — 10
              </span>
            </div>
            <ChargeSparkline encounters={weekEncounters} height={56} />
          </div>
        </div>
      )}

      {/* Bucket summary grid */}
      <div style={{ padding: '0 24px 24px' }}>
        <p style={{ ...sectionLabel, marginBottom: '12px' }}>your map</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {BUCKET_CARDS.map(({ key, label, color, icon }, i) => (
            <button
              key={key}
              onClick={() => navigate('buckets', { bucket: key })}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderLeft: `3px solid ${color}`,
                borderRadius: '14px',
                padding: '14px',
                textAlign: 'left', cursor: 'pointer',
                transition: 'background 0.15s',
                animation: `fadeIn 0.4s ease-out ${0.05 * i}s both`,
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#E8E2D4'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-surface)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color, marginBottom: '8px' }}>
                {icon}
                <span style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '12px', fontWeight: '500',
                  color: 'var(--text-soft)', letterSpacing: '0.02em',
                }}>
                  {label}
                </span>
              </div>
              <span style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '26px', fontWeight: '400',
                color,
                lineHeight: 1,
              }}>
                {bucketCounts[key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent encounters */}
      <div style={{ padding: '0 24px 24px' }}>
        <p style={{ ...sectionLabel, marginBottom: '14px' }}>recent encounters</p>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1, 2].map(i => <SkeletonCard key={i} lines={2} />)}
          </div>
        ) : recentEncounters.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px 16px' }}>
            <div style={{ width: '40px', height: '1px', background: 'var(--border-subtle)', margin: '0 auto 20px' }} />
            <p style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '22px', fontStyle: 'italic',
              color: 'var(--text-primary)', margin: '0 0 8px',
            }}>
              Your map begins here.
            </p>
            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '13px', color: 'var(--text-soft)',
              lineHeight: '1.6', margin: 0,
            }}>
              Log your first encounter when you're ready.
            </p>
            <div style={{ width: '40px', height: '1px', background: 'var(--border-subtle)', margin: '20px auto 0' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentEncounters.map(e => (
              <EncounterCard
                key={e.id}
                encounter={e}
                onClick={() => navigate('encounter-detail', { encounterId: e.id })}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

const sectionLabel = {
  fontFamily: '"DM Sans", sans-serif',
  fontSize: '10px', fontWeight: '500',
  letterSpacing: '0.12em', textTransform: 'uppercase',
  color: 'var(--text-soft)', margin: 0,
}
