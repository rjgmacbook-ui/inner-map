import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'

export function useTriggers(userId) {
  const [triggers, setTriggers] = useState([])
  const [loading, setLoading]   = useState(true)

  const fetch = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('triggers')
      .select('*')
      .order('created_at', { ascending: false })
    setTriggers(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  async function add({ name, description }) {
    const { data, error } = await supabase
      .from('triggers')
      .insert({ user_id: userId, name, description })
      .select()
      .single()
    if (error) throw error
    setTriggers(prev => [data, ...prev])
    return data
  }

  async function update(id, patch) {
    const { data, error } = await supabase
      .from('triggers')
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setTriggers(prev => prev.map(t => t.id === id ? data : t))
    return data
  }

  async function remove(id) {
    await supabase.from('triggers').delete().eq('id', id)
    setTriggers(prev => prev.filter(t => t.id !== id))
  }

  return { triggers, loading, add, update, remove, refetch: fetch }
}
