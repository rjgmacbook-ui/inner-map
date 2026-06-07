import { useApp } from '../store/AppContext'
import ChargeSparkline from '../components/ui/ChargeSparkline'

function FreqBar({ name, count, maxCount, color }) {
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
      <span style={{
        fontFamily: '"DM Sans", sans-serif', fontSize: '13px',
        color: 'var(--text-primary)', width: '120px',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        flexShrink: 0,
      }}>
        {name}
      </span>
      <div style={{ flex: 1, background: 'var(--border-subtle)', borderRadius: '4px', height: '8px' }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: color, borderRadius: '4px',
          transition: 'width 0.6s ease-out',
          minWidth: pct > 0 ? '8px' : '0',
        }} />
      </div>
      <span style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '11px', color: 'var(--text-soft)',
        width: '20px', textAlign: 'right', flexShrink: 0,
      }}>
        {count}
      </span>
    </div>
  )
}

export default function Patterns() {
  const { encountersHook, triggersHook, reactionsHook, toolkitHook } = useApp()
  const { encounters } = encountersHook

  if (encounters.length < 3) {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center', padding: '48px 32px',
        animation: 'fadeIn 0.4s ease-out both',
      }}>
        <div>
          <div style={{ width: '32px', height: '1px', background: 'var(--border-subtle)', margin: '0 auto 24px' }} />
          <p style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '24px', fontStyle: 'italic',
            color: 'var(--text-primary)', margin: '0 0 10px',
          }}>
            Patterns emerge with time.
          </p>
          <p style={{
            fontFamily: '"DM Sans", sans-serif', fontSize: '14px',
            color: 'var(--text-soft)', lineHeight: '1.6', margin: 0,
          }}>
            Log a few encounters to see your map take shape.
          </p>
          <div style={{ width: '32px', height: '1px', background: 'var(--border-subtle)', margin: '24px auto 0' }} />
        </div>
      </div>
    )
  }

  // Frequency counters
  function countBy(key) {
    const counts = {}
    encounters.forEach(e => {
      const id = e[key]
      if (id) counts[id] = (counts[id] || 0) + 1
    })
    return counts
  }

  function topItems(counts, sourceArr, nameKey = 'name', limit = 5) {
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id, count]) => {
        const item = sourceArr.find(i => i.id === id)
        return { name: item?.[nameKey] || 'Unknown', count }
      })
  }

  const triggerCounts  = countBy('trigger_id')
  const reactionCounts = countBy('reaction_id')
  const toolkitCounts  = countBy('toolkit_item_id')

  const topTriggers  = topItems(triggerCounts,  triggersHook.triggers)
  const topReactions = topItems(reactionCounts, reactionsHook.reactions)
  const topToolkit   = topItems(toolkitCounts,  toolkitHook.items)

  const maxT = Math.max(...topTriggers.map(i => i.count),  1)
  const maxR = Math.max(...topReactions.map(i => i.count), 1)
  const maxK = Math.max(...topToolkit.map(i => i.count),   1)

  return (
    <div style={{ padding: '28px 24px 100px', animation: 'fadeIn 0.4s ease-out both' }}>

      {/* Page title */}
      <h1 style={{
        fontFamily: '"Cormorant Garamond", Georgia, serif',
        fontSize: '34px', fontWeight: '400', fontStyle: 'italic',
        color: 'var(--text-primary)', margin: '0 0 6px',
      }}>
        Patterns
      </h1>
      <div style={{ width: '32px', height: '1.5px', background: 'var(--accent-amber)', borderRadius: '1px', marginBottom: '32px' }} />

      {/* Section 1 — Charge over time */}
      <div style={{ marginBottom: '36px' }}>
        <p style={sLabel}>charge intensity over time</p>
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
          borderRadius: '14px', padding: '16px',
        }}>
          <ChargeSparkline encounters={encounters} height={80} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={monoMuted}>calm</span>
            <span style={monoMuted}>intense</span>
          </div>
        </div>
      </div>

      {/* Section 2 — Triggers */}
      {topTriggers.length > 0 && (
        <div style={{ marginBottom: '36px' }}>
          <p style={sLabel}>most activated triggers</p>
          {topTriggers.map(({ name, count }) => (
            <FreqBar key={name} name={name} count={count} maxCount={maxT} color="var(--accent-amber)" />
          ))}
        </div>
      )}

      {/* Section 3 — Reactions */}
      {topReactions.length > 0 && (
        <div style={{ marginBottom: '36px' }}>
          <p style={sLabel}>default reactions</p>
          {topReactions.map(({ name, count }) => (
            <FreqBar key={name} name={name} count={count} maxCount={maxR} color="var(--accent-clay)" />
          ))}
        </div>
      )}

      {/* Section 4 — Toolkit */}
      {topToolkit.length > 0 && (
        <div style={{ marginBottom: '36px' }}>
          <p style={sLabel}>what you've reached for</p>
          {topToolkit.map(({ name, count }) => (
            <FreqBar key={name} name={name} count={count} maxCount={maxK} color="var(--accent-sage)" />
          ))}
        </div>
      )}
    </div>
  )
}

const sLabel = {
  fontFamily: '"DM Sans", sans-serif',
  fontSize: '10px', fontWeight: '500',
  letterSpacing: '0.12em', textTransform: 'uppercase',
  color: 'var(--text-soft)', margin: '0 0 12px',
}

const monoMuted = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '10px', color: 'var(--text-soft)', opacity: 0.6,
}
