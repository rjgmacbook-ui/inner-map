import { useApp } from '../../store/AppContext'

const tabs = [
  {
    key: 'dashboard',
    label: 'Home',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    key: 'encounters',
    label: 'Journal',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    key: 'buckets',
    label: 'Buckets',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" />
      </svg>
    ),
  },
  {
    key: 'patterns',
    label: 'Patterns',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const { view, navigate, activeBucket } = useApp()

  function handleTab(key) {
    if (key === 'buckets') {
      navigate('buckets', { bucket: activeBucket || 'triggers' })
    } else {
      navigate(key)
    }
  }

  return (
    <>
      {/* Floating action button for logging */}
      <button
        onClick={() => navigate('log')}
        aria-label="Log an encounter"
        style={{
          position: 'fixed',
          bottom: '80px',
          right: 'max(16px, calc(50vw - 194px))',
          width: '52px', height: '52px',
          borderRadius: '50%',
          background: 'var(--accent-amber)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(196,134,58,0.45), 0 2px 6px rgba(44,36,32,0.15)',
          zIndex: 110,
          transition: 'transform 0.15s, box-shadow 0.15s',
          color: '#fff',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(196,134,58,0.55), 0 3px 8px rgba(44,36,32,0.18)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(196,134,58,0.45), 0 2px 6px rgba(44,36,32,0.15)' }}
        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
        onMouseUp={e => e.currentTarget.style.transform = 'scale(1.08)'}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      {/* Bottom nav bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '420px',
        background: 'var(--bg-deep)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '10px 8px 14px',
        zIndex: 100,
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        {tabs.map(tab => {
          const isActive = view === tab.key
          const color = isActive ? 'var(--accent-amber)' : 'rgba(245,240,232,0.45)'

          return (
            <button
              key={tab.key}
              onClick={() => handleTab(tab.key)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                padding: '2px 4px',
                color,
                transition: 'color 0.15s',
              }}
            >
              {tab.icon}
              <span style={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '10px',
                fontWeight: '400',
                letterSpacing: '0.04em',
              }}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
