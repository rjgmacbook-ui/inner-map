export default function ChargeSparkline({ encounters = [], height = 60 }) {
  const W = 300

  function avgIntensity(e) {
    const vals = Object.values(e.charge_intensities || {})
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
  }

  // Filter to encounters with charge data, last 30, oldest first
  const pts = encounters
    .filter(e => avgIntensity(e) != null)
    .slice(-30)

  if (pts.length < 3) return null

  const PAD_X = 6
  const PAD_Y = 6
  const innerW = W - PAD_X * 2
  const innerH = height - PAD_Y * 2

  // Map intensity (1–10) to Y coordinate — inverted (10 = top = small Y)
  const toY = v => PAD_Y + innerH - ((v - 1) / 9) * innerH
  const toX = i => PAD_X + (i / (pts.length - 1)) * innerW

  const points = pts.map((e, i) => ({ x: toX(i), y: toY(avgIntensity(e)) }))

  // Build smooth bezier path
  function buildPath(pts) {
    if (pts.length < 2) return ''
    let d = `M ${pts[0].x},${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i]
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const p3 = pts[i + 2] || p2

      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
    }
    return d
  }

  const linePath = buildPath(points)

  // Area path: curve down to baseline and back
  const last = points[points.length - 1]
  const first = points[0]
  const areaPath = `${linePath} L ${last.x},${height} L ${first.x},${height} Z`

  const gradId = `sparkgrad-${Math.random().toString(36).slice(2, 7)}`
  const lastPt = points[points.length - 1]

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height: `${height}px`, display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#C4863A" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#C4863A" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Filled area */}
      <path d={areaPath} fill={`url(#${gradId})`} />

      {/* Curve line */}
      <path
        d={linePath}
        fill="none"
        stroke="#C4863A"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dot on latest point */}
      <circle cx={lastPt.x} cy={lastPt.y} r="3" fill="#C4863A" />
    </svg>
  )
}
