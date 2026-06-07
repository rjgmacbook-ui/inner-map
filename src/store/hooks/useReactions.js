import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'

export function useReactions(userId) {
  const [reactions, setReactions] = useState([])
  const [loading, setLoading]     = useState(true)

  const fetch = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('reactions')
      .select('*')
      .order('created_at', { ascending: false })
    setReactions(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  async function add({ name, description }) {
    const { data, error } = await supabase
      .from('reactions')
      .insert({ user_id: userId, name, description })
      .select()
      .single()
    if (error) throw error
    setReactions(prev => [data, ...prev])
    return data
  }

  async function update(id, patch) {
    const { data, error } = await supabase
      .from('reactions')
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setReactions(prev => prev.map(r => r.id === id ? data : r))
    return data
  }

  async function remove(id) {
    await supabase.from('reactions').delete().eq('id', id)
    setReactions(prev => prev.filter(r => r.id !== id))
  }

  return { reactions, loading, add, update, remove, refetch: fetch }
}
