export default function ChargeOrb({ intensity = 5, size = 'md' }) {
  const clamp = Math.min(10, Math.max(1, intensity))

  const sizes = { sm: 28, md: 52, lg: 80 }
  const px = sizes[size] ?? sizes.md

  // Color stops
  const color =
    clamp <= 3 ? '#8BADB5'  // mist
    : clamp <= 6 ? '#C4863A' // amber
    : '#B5735A'              // clay

  const lightColor =
    clamp <= 3 ? '#B8D0D6'
    : clamp <= 6 ? '#E0A85A'
    : '#D4927A'

  const glowOpacity = (clamp / 10) * 0.55
  const glow = `0 0 ${clamp * 3}px ${color}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')}`

  const shouldPulse = clamp >= 8

  return (
    <div
      style={{
        width: `${px}px`,
        height: `${px}px`,
        borderRadius: '50%',
        background: `radial-gradient(circle at 38% 38%, ${lightColor}, ${color})`,
        boxShadow: glow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        animation: shouldPulse ? 'pulse 1.8s ease-in-out infinite' : 'none',
        transition: 'background 0.3s ease, box-shadow 0.3s ease, width 0.2s ease, height 0.2s ease',
      }}
    >
      {size !== 'sm' && (
        <span style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: size === 'lg' ? '20px' : '13px',
          fontWeight: '400',
          color: 'rgba(255,255,255,0.92)',
          lineHeight: 1,
          userSelect: 'none',
        }}>
          {clamp}
        </span>
      )}
    </div>
  )
}
