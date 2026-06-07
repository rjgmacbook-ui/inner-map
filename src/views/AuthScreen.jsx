import { useState } from 'react'
import { useApp } from '../store/AppContext'

export default function AuthScreen() {
  const { signIn, signUp } = useApp()
  const [tab, setTab]           = useState('signin') // 'signin' | 'signup'
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'signin') {
        await signIn(email, password)
      } else {
        await signUp(email, password, name)
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100svh',
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Subtle grain texture overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
      }} />

      <div style={{
        width: '100%', maxWidth: '360px', position: 'relative', zIndex: 1,
        animation: 'fadeIn 0.5s ease-out both',
      }}>
        {/* Logo area */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: '52px',
            fontWeight: '400',
            fontStyle: 'italic',
            color: 'var(--text-primary)',
            letterSpacing: '-0.5px',
            lineHeight: 1,
            margin: '0 0 10px',
          }}>
            inner map
          </h1>
          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '13px',
            color: 'var(--text-soft)',
            letterSpacing: '0.02em',
            margin: '0 0 20px',
          }}>
            a personal map of your inner landscape
          </p>
          <div style={{
            width: '48px', height: '1px',
            background: 'var(--border-subtle)',
            margin: '0 auto',
          }} />
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '28px',
        }}>
          {[['signin', 'sign in'], ['signup', 'create account']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setTab(key); setError('') }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '14px',
                fontWeight: tab === key ? '500' : '400',
                color: tab === key ? 'var(--text-primary)' : 'var(--text-soft)',
                padding: '0 0 8px',
                borderBottom: tab === key ? '2px solid var(--accent-amber)' : '2px solid transparent',
                transition: 'all 0.15s ease',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {tab === 'signup' && (
            <div style={{ animation: 'fadeIn 0.2s ease-out both' }}>
              <label style={labelStyle}>your name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="how should we address you?"
                style={inputStyle}
              />
            </div>
          )}

          <div>
            <label style={labelStyle}>email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={tab === 'signup' ? 'at least 6 characters' : '••••••••'}
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <p style={{
              fontSize: '13px',
              color: '#C0442A',
              fontFamily: '"DM Sans", sans-serif',
              lineHeight: '1.4',
              animation: 'fadeIn 0.2s ease-out both',
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full"
            style={{
              marginTop: '4px',
              opacity: loading ? 0.7 : 1,
              letterSpacing: '0.03em',
            }}
          >
            {loading ? '...' : tab === 'signin' ? 'enter' : 'begin your map'}
          </button>
        </form>

        {/* Footer note */}
        <p style={{
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-soft)',
          opacity: 0.6,
          marginTop: '32px',
          fontFamily: '"DM Sans", sans-serif',
          lineHeight: '1.5',
        }}>
          your map is private.<br/>only you can see what you build here.
        </p>
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontFamily: '"DM Sans", sans-serif',
  fontSize: '11px',
  fontWeight: '500',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--text-soft)',
  marginBottom: '6px',
}

const inputStyle = {
  width: '100%',
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-subtle)',
  borderRadius: '10px',
  padding: '12px 16px',
  fontFamily: '"DM Sans", sans-serif',
  fontSize: '15px',
  color: 'var(--text-primary)',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  boxSizing: 'border-box',
}
