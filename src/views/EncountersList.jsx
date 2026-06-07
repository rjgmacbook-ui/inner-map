import { useState, useMemo } from 'react'
import { useApp } from '../store/AppContext'
import EncounterCard from '../components/ui/EncounterCard'
import { SkeletonCard } from '../components/ui/Skeleton'
import ErrorBanner from '../components/ui/ErrorBanner'

const FILTERS = [
  { key: 'all',   label: 'All' },
  { key: 'week',  label: 'This week' },
  { key: 'today', label: 'Today' },
]

function startOf(key) {
  const now = new Date()
  if (key === 'today') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  }
  if (key === 'week') {
    return Date.now() - 7 * 86400 * 1000
  }
  return 0
}

export default function EncountersList() {
  const { navigate, encountersHook } = useApp()
  const { encounters, loading, error, refetch } = encountersHook

  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')

  const filtered = useMemo(() => {
    const cutoff = startOf(filter)
    return encounters.filter(e => {
      if (new Date(e.created_at).getTime() < cutoff) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return e.event_description?.toLowerCase().includes(q)
          || e.trigger?.name?.toLowerCase().includes(q)
      }
      return true
    })
  }, [encounters, search, filter])

  return (
    <div style={{ paddingBottom: '100px', animation: 'fadeIn 0.35s ease-out both' }}>
      {/* Header */}
      <div style={{ padding: '32px 24px 16px' }}>
        <p style={sectionLabel}>encounters</p>
        <h1 style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: '30px', fontWeight: '400', fontStyle: 'italic',
          color: 'var(--text-primary)', margin: '6px 0 0', lineHeight: 1.2,
        }}>
          your journal
        </h1>
        <div style={{ width: '32px', height: '1.5px', background: 'var(--accent-amber)', borderRadius: '1px', marginTop: '14px' }} />
      </div>

      {/* Search */}
      <div style={{ padding: '0 24px 14px' }}>
        <div style={{ position: 'relative' }}>
          <svg
            width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="var(--text-soft)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          >
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="search encounters…"
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '11px 16px 11px 38px',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px', color: 'var(--text-primary)',
              outline: 'none',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent-amber)'; e.target.style.boxShadow = '0 0 0 3px rgba(196,134,58,0.12)' }}
            onBlur={e => { e.target.style.borderColor = 'var(--border-subtle)'; e.target.style.boxShadow = 'none' }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-soft)', fontSize: '16px', lineHeight: 1, padding: '2px',
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Date filter pills */}
      <div style={{ padding: '0 24px 20px', display: 'flex', gap: '8px' }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              background: filter === f.key ? 'var(--accent-amber)' : 'var(--bg-surface)',
              color: filter === f.key ? '#fff' : 'var(--text-soft)',
              border: `1px solid ${filter === f.key ? 'var(--accent-amber)' : 'var(--border-subtle)'}`,
              borderRadius: '100px',
              padding: '6px 16px',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '12px', fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Error */}
      <ErrorBanner message={error} onRetry={refetch} />

      {/* List */}
      <div style={{ padding: '0 24px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1, 2, 3].map(i => <SkeletonCard key={i} lines={2} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 16px' }}>
            <div style={{ width: '40px', height: '1px', background: 'var(--border-subtle)', margin: '0 auto 20px' }} />
            <p style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '22px', fontStyle: 'italic',
              color: 'var(--text-primary)', margin: '0 0 8px',
            }}>
              {search ? 'No matches found.' : encounters.length === 0 ? 'Your journal is empty.' : 'Nothing in this period.'}
            </p>
            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '13px', color: 'var(--text-soft)',
              lineHeight: '1.6', margin: 0,
            }}>
              {search ? 'Try a different search term.' : encounters.length === 0 ? 'Log your first encounter to begin.' : 'Try a different time range.'}
            </p>
            <div style={{ width: '40px', height: '1px', background: 'var(--border-subtle)', margin: '20px auto 0' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Count label */}
            <p style={{ ...sectionLabel, marginBottom: '4px' }}>
              {filtered.length} {filtered.length === 1 ? 'encounter' : 'encounters'}
            </p>
            {filtered.map(e => (
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
