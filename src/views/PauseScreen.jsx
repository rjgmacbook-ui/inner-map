import { useState, useEffect } from 'react'
import BreathingRing from '../components/ui/BreathingRing'

const PROMPTS = [
  'Name 5 things you can see right now.',
  'Feel your feet on the ground.',
  'Place a hand on your chest. Feel your heartbeat.',
  'Notice 3 sounds around you.',
  'Take in the temperature of the air.',
]

export default function PauseScreen({ onComplete, onSkip, onBack }) {
  const [elapsed, setElapsed]       = useState(0)
  const [promptIdx, setPromptIdx]   = useState(0)
  const [promptVisible, setVisible] = useState(true)
  const [showContinue, setShowContinue] = useState(false)

  // Main second counter
  useEffect(() => {
    const t = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  // Show continue after 15s
  useEffect(() => {
    if (elapsed >= 15 && !showContinue) setShowContinue(true)
  }, [elapsed, showContinue])

  // Rotate grounding prompt every 12s (matches breath cycle)
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setPromptIdx(i => (i + 1) % PROMPTS.length)
        setVisible(true)
      }, 600)
    }, 12000)
    return () => clearInterval(t)
  }, [])

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: '#2C2420',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
      gap: '28px',
      animation: 'fadeIn 0.5s ease-out both',
    }}>
      {/* Grain texture */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08, pointerEvents: 'none' }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: '20px', left: '20px',
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '20px', color: 'rgba(245,240,232,0.35)',
            padding: '4px 8px', lineHeight: 1,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(245,240,232,0.7)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,240,232,0.35)'}
          aria-label="Go back"
        >
          ←
        </button>
      )}

      {/* "pause" label */}
      <p style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '10px',
        fontWeight: '500',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'var(--accent-mist)',
        margin: 0,
      }}>
        pause
      </p>

      {/* Breathing ring */}
      <BreathingRing />

      {/* Follow the ring */}
      <p style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '12px',
        color: 'rgba(245,240,232,0.3)',
        letterSpacing: '0.06em',
        margin: 0,
      }}>
        follow the ring
      </p>

      {/* Grounding prompt */}
      <p style={{
        fontFamily: '"Cormorant Garamond", Georgia, serif',
        fontSize: '20px',
        fontStyle: 'italic',
        fontWeight: '400',
        color: 'rgba(245,240,232,0.75)',
        textAlign: 'center',
        maxWidth: '280px',
        lineHeight: '1.5',
        margin: 0,
        opacity: promptVisible ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}>
        {PROMPTS[promptIdx]}
      </p>

      {/* Timer */}
      <p style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '12px',
        color: 'rgba(245,240,232,0.25)',
        margin: 0,
        letterSpacing: '0.1em',
      }}>
        {mm}:{ss}
      </p>

      {/* Continue / skip */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        minHeight: '60px',
      }}>
        {showContinue && (
          <button
            onClick={() => onComplete(elapsed)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(196,134,58,0.5)',
              borderRadius: '10px',
              padding: '11px 32px',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--accent-amber)',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              animation: 'fadeIn 0.4s ease-out both',
              transition: 'border-color 0.15s, background 0.15s',
            }}
          >
            continue
          </button>
        )}
        <button
          onClick={onSkip}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '11px',
            color: 'rgba(245,240,232,0.25)',
            letterSpacing: '0.06em',
            padding: '4px 8px',
          }}
        >
          skip
        </button>
      </div>
    </div>
  )
}
