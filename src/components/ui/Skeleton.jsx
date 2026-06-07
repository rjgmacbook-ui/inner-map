export default function Skeleton({ width = '100%', height = 16, borderRadius = 8, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius, flexShrink: 0, ...style }}
    />
  )
}

// Pre-built skeleton shapes for common patterns
export function SkeletonCard({ lines = 2 }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '14px',
      padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: '10px',
    }}>
      <Skeleton width="40%" height={11} />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? '70%' : '100%'} height={14} />
      ))}
      <div style={{ display: 'flex', gap: '8px' }}>
        <Skeleton width={72} height={22} borderRadius={20} />
        <Skeleton width={56} height={22} borderRadius={20} />
      </div>
    </div>
  )
}

export function SkeletonBucketCard() {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderLeft: '3px solid var(--border-subtle)',
      borderRadius: '12px',
      padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: '12px',
    }}>
      <Skeleton width={8} height={8} borderRadius={4} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <Skeleton width="60%" height={14} />
        <Skeleton width="35%" height={11} />
      </div>
    </div>
  )
}
