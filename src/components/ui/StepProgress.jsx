export default function StepProgress({ current = 0, total = 7 }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '8px 0',
    }}>
      {Array.from({ length: total }).map((_, i) => {
        const isPast    = i < current
        const isCurrent = i === current
        const isFuture  = i > current

        return (
          <div key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Pulse ring on current */}
            {isCurrent && (
              <div style={{
                position: 'absolute',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '1.5px solid var(--accent-amber)',
                opacity: 0.35,
                animation: 'pulse 1.8s ease-in-out infinite',
              }} />
            )}
            <div style={{
              width:  isCurrent ? '10px' : '7px',
              height: isCurrent ? '10px' : '7px',
              borderRadius: '50%',
              background: isCurrent ? 'var(--accent-amber)'
                        : isPast    ? 'rgba(196,134,58,0.4)'
                        : 'transparent',
              border: isFuture ? '1.5px solid var(--border-subtle)' : 'none',
              transition: 'all 0.25s ease',
              flexShrink: 0,
            }} />
          </div>
        )
      })}
    </div>
  )
}
