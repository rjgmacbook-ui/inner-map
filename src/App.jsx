import { AppProvider, useApp } from './store/AppContext'
import AuthScreen      from './views/AuthScreen'
import BucketView      from './views/BucketView'
import LogEncounter    from './views/LogEncounter'
import Dashboard       from './views/Dashboard'
import Patterns        from './views/Patterns'
import EncounterDetail from './views/EncounterDetail'
import EncountersList  from './views/EncountersList'
import BottomNav       from './components/ui/BottomNav'

function AppInner() {
  const { user, loading, view } = useApp()

  if (user === undefined || loading) {
    return (
      <div style={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px',
            border: '2px solid var(--border-subtle)',
            borderTopColor: 'var(--accent-amber)',
            borderRadius: '50%',
            animation: 'spin 0.9s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '18px',
            fontStyle: 'italic',
            color: 'var(--text-soft)',
          }}>
            inner map
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  const renderView = () => {
    switch (view) {
      case 'buckets':          return <BucketView />
      case 'log':              return <LogEncounter />
      case 'patterns':         return <Patterns />
      case 'encounter-detail': return <EncounterDetail />
      case 'encounters':       return <EncountersList />
      default:                 return <Dashboard />
    }
  }

  return (
    <div className="app-shell">
      <main style={{
        flex: 1,
        overflowY: 'auto',
        paddingBottom: '80px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {renderView()}
      </main>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
