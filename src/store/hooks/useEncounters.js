import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'

const SELECT = `
  *,
  trigger:triggers(id, name)
`

export function useEncounters(userId) {
  const [encounters, setEncounters] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  const fetch = useCallback(async () => {
    if (!userId) return
    setError(null)
    const { data, error: err } = await supabase
      .from('encounters')
      .select(SELECT)
      .order('created_at', { ascending: false })
    if (err) { setError(err.message); setLoading(false); return }
    setEncounters(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  async function add(payload) {
    const { data, error } = await supabase
      .from('encounters')
      .insert({ ...payload, user_id: userId })
      .select(SELECT)
      .single()
    if (error) throw error
    setEncounters(prev => [data, ...prev])
    return data
  }

  async function update(id, patch) {
    const { data, error } = await supabase
      .from('encounters')
      .update(patch)
      .eq('id', id)
      .select(SELECT)
      .single()
    if (error) throw error
    setEncounters(prev => prev.map(e => e.id === id ? data : e))
    return data
  }

  async function remove(id) {
    await supabase.from('encounters').delete().eq('id', id)
    setEncounters(prev => prev.filter(e => e.id !== id))
  }

  return { encounters, loading, error, add, update, remove, refetch: fetch }
}
