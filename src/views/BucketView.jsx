import { useApp } from '../store/AppContext'
import BucketCard from '../components/ui/BucketCard'
import InlineCreate from '../components/ui/InlineCreate'
import { SkeletonBucketCard } from '../components/ui/Skeleton'

const BUCKETS = {
  triggers: {
    label: 'Triggers',
    color: 'var(--accent-amber)',
    emptyMsg: 'Name a recurring situation that activates you.',
    emptyHint: 'Think about what consistently pulls you off centre.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35 }}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  charges: {
    label: 'Emotional Charges',
    color: 'var(--accent-mist)',
    emptyMsg: 'Name an emotion you feel often.',
    emptyHint: 'These are the energies moving through you.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35 }}>
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
        <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
      </svg>
    ),
  },
  reactions: {
    label: 'Unhealthy Reactions',
    color: 'var(--accent-clay)',
    emptyMsg: 'Name a default pattern you want to interrupt.',
    emptyHint: 'The automatic responses that no longer serve you.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35 }}>
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
      </svg>
    ),
  },
  toolkit: {
    label: 'Healthy Toolkit',
    color: 'var(--accent-sage)',
    emptyMsg: 'Add a resource or practice that helps you.',
    emptyHint: 'What has helped you regulate and return to yourself?',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35 }}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
}

const TAB_ORDER = ['triggers', 'charges', 'reactions', 'toolkit']
const TAB_SHORT = { triggers: 'Triggers', charges: 'Charges', reactions: 'Reactions', toolkit: 'Toolkit' }

export default function BucketView() {
  const { activeBucket, navigate, triggersHook, chargesHook, reactionsHook, toolkitHook } = useApp()

  const bucket = BUCKETS[activeBucket] || BUCKETS.triggers

  const hookMap = {
    triggers:  { items: triggersHook.triggers,   add: triggersHook.add,   remove: triggersHook.remove,   loading: triggersHook.loading  },
    charges:   { items: chargesHook.charges,     add: chargesHook.add,    remove: chargesHook.remove,    loading: chargesHook.loading   },
    reactions: { items: reactionsHook.reactions, add: reactionsHook.add,  remove: reactionsHook.remove,  loading: reactionsHook.loading },
    toolkit:   { items: toolkitHook.items,       add: toolkitHook.add,    remove: toolkitHook.remove,    loading: toolkitHook.loading   },
  }

  const { items, add, remove, loading } = hookMap[activeBucket] || hookMap.triggers

  return (
    <div style={{
      minHeight: '100%',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Sub-navigation */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0 16px',
        gap: '0',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {TAB_ORDER.map(key => {
          const isActive = activeBucket === key
          const bc = BUCKETS[key]
          return (
            <button
              key={key}
              onClick={() => navigate('buckets', { bucket: key })}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '13px',
                fontWeight: isActive ? '500' : '400',
                color: isActive ? 'var(--text-primary)' : 'var(--text-soft)',
                padding: '14px 14px 12px',
                borderBottom: isActive ? `2px solid ${bc.color}` : '2px solid transparent',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
                flexShrink: 0,
              }}
            >
              {TAB_SHORT[key]}
            </button>
          )
        })}
      </div>

      {/* Header */}
      <div style={{ padding: '28px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '6px' }}>
          <h1 style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '34px',
            fontWeight: '400',
            fontStyle: 'italic',
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            margin: 0,
          }}>
            {bucket.label}
          </h1>
          {items.length > 0 && (
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '12px',
              color: 'var(--text-soft)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '2px 9px',
            }}>
              {items.length}
            </span>
          )}
        </div>
        {/* Accent line */}
        <div style={{
          width: '36px', height: '2px',
          background: bucket.color,
          borderRadius: '1px',
          marginBottom: '22px',
        }} />
      </div>

      {/* Body */}
      <div style={{ padding: '0 24px', flex: 1 }}>
        {/* Inline create */}
        <InlineCreate
          bucketType={activeBucket}
          onAdd={add}
        />

        {/* Items list or empty state */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
            {[1, 2, 3].map(i => <SkeletonBucketCard key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '40px 16px',
            animation: 'fadeIn 0.4s ease-out both',
          }}>
            <div style={{ color: bucket.color, marginBottom: '16px' }}>
              {bucket.icon}
            </div>
            <p style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '20px',
              fontStyle: 'italic',
              color: 'var(--text-primary)',
              marginBottom: '8px',
              lineHeight: '1.4',
            }}>
              {bucket.emptyMsg}
            </p>
            <p style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '13px',
              color: 'var(--text-soft)',
              lineHeight: '1.6',
              maxWidth: '240px',
            }}>
              {bucket.emptyHint}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '24px' }}>
            {items.map((item, i) => (
              <div
                key={item.id}
                style={{ animation: `fadeIn 0.3s ease-out ${i * 0.04}s both` }}
              >
                <BucketCard
                  item={item}
                  bucketType={activeBucket}
                  accentColor={bucket.color}
                  onDelete={remove}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
