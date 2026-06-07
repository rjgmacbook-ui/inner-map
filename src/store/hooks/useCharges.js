import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'

export function useCharges(userId) {
  const [charges, setCharges] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('emotional_charges')
      .select('*')
      .order('created_at', { ascending: false })
    setCharges(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  async function add({ name, typical_intensity }) {
    const { data, error } = await supabase
      .from('emotional_charges')
      .insert({ user_id: userId, name, typical_intensity })
      .select()
      .single()
    if (error) throw error
    setCharges(prev => [data, ...prev])
    return data
  }

  async function update(id, patch) {
    const { data, error } = await supabase
      .from('emotional_charges')
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setCharges(prev => prev.map(c => c.id === id ? data : c))
    return data
  }

  async function remove(id) {
    await supabase.from('emotional_charges').delete().eq('id', id)
    setCharges(prev => prev.filter(c => c.id !== id))
  }

  return { charges, loading, add, update, remove, refetch: fetch }
}
