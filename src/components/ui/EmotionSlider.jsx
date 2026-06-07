import ChargeOrb from './ChargeOrb'

export default function EmotionSlider({ value = 5, onChange }) {
  const pct = ((value - 1) / 9) * 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
      {/* Live orb */}
      <ChargeOrb intensity={value} size="lg" />

      {/* Slider */}
      <div style={{ width: '100%' }}>
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            outline: 'none',
            cursor: 'pointer',
            WebkitAppearance: 'none',
            appearance: 'none',
            background: `linear-gradient(
              to right,
              #8BADB5 0%,
              #C4863A 50%,
              #B5735A 100%
            )`,
          }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '6px',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '11px',
          color: 'var(--text-soft)',
        }}>
          <span>1</span>
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', letterSpacing: '0.03em' }}>
            intensity
          </span>
          <span>10</span>
        </div>
      </div>
    </div>
  )
}
