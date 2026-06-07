export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null
  return (
    <div style={{
      margin: '0 24px 16px',
      padding: '12px 16px',
      background: 'rgba(192,68,42,0.08)',
      border: '1px solid rgba(192,68,42,0.2)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      animation: 'fadeIn 0.2s ease-out both',
    }}>
      <p style={{
        fontFamily: '"DM Sans", sans-serif',
        fontSize: '13px',
        color: '#8B3A28',
        lineHeight: '1.4',
        margin: 0,
      }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-inline"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '12px', fontWeight: '500',
            color: '#8B3A28', whiteSpace: 'nowrap',
            padding: '4px 0',
          }}
        >
          retry
        </button>
      )}
    </div>
  )
}
