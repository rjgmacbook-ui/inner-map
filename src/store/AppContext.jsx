import { createContext, useContext, useState } from 'react'
import { useAuth } from './useAuth'
import { useTriggers } from './hooks/useTriggers'
import { useCharges } from './hooks/useCharges'
import { useReactions } from './hooks/useReactions'
import { useToolkit } from './hooks/useToolkit'
import { useEncounters } from './hooks/useEncounters'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const auth = useAuth()
  const uid  = auth.user?.id

  const triggersHook   = useTriggers(uid)
  const chargesHook    = useCharges(uid)
  const reactionsHook  = useReactions(uid)
  const toolkitHook    = useToolkit(uid)
  const encountersHook = useEncounters(uid)

  // Navigation
  const [view, setView]           = useState('dashboard')
  // For bucket view: which bucket is active
  const [activeBucket, setActiveBucket] = useState('triggers')
  // For encounter detail
  const [selectedEncounterId, setSelectedEncounterId] = useState(null)

  function navigate(newView, options = {}) {
    if (options.bucket)     setActiveBucket(options.bucket)
    if (options.encounterId) setSelectedEncounterId(options.encounterId)
    setView(newView)
  }

  return (
    <AppContext.Provider value={{
      // Auth
      ...auth,
      // Navigation
      view, navigate, activeBucket, selectedEncounterId,
      // Data
      triggersHook,
      chargesHook,
      reactionsHook,
      toolkitHook,
      encountersHook,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
