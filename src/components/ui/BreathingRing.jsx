export default function BreathingRing() {
  return (
    <>
      <style>{`
        @keyframes breath-in-text {
          0%   { opacity: 1; }
          28%  { opacity: 1; }
          33%  { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes breath-hold-text {
          0%   { opacity: 0; }
          33%  { opacity: 0; }
          36%  { opacity: 1; }
          47%  { opacity: 1; }
          50%  { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes breath-out-text {
          0%   { opacity: 0; }
          50%  { opacity: 0; }
          53%  { opacity: 1; }
          95%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* The ring itself */}
        <div style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          border: '2.5px solid',
          background: 'transparent',
          animation: 'breathe-scale 12s linear infinite, breathe-color 12s linear infinite',
        }} />

        {/* Breath phase text labels — centered inside ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          {[
            { text: 'breathe in',  anim: 'breath-in-text'   },
            { text: 'hold',        anim: 'breath-hold-text' },
            { text: 'breathe out', anim: 'breath-out-text'  },
          ].map(({ text, anim }) => (
            <span
              key={text}
              style={{
                position: 'absolute',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '13px',
                fontWeight: '300',
                letterSpacing: '0.12em',
                color: 'rgba(245,240,232,0.7)',
                textTransform: 'lowercase',
                animation: `${anim} 12s linear infinite`,
                whiteSpace: 'nowrap',
              }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
