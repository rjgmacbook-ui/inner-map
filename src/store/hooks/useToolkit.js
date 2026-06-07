import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'

export function useToolkit(userId) {
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!userId) return
    const { data } = await supabase
      .from('toolkit_items')
      .select('*')
      .order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { fetch() }, [fetch])

  async function add({ name, category = 'other', description, steps }) {
    const { data, error } = await supabase
      .from('toolkit_items')
      .insert({ user_id: userId, name, category, description, steps })
      .select()
      .single()
    if (error) throw error
    setItems(prev => [data, ...prev])
    return data
  }

  async function update(id, patch) {
    const { data, error } = await supabase
      .from('toolkit_items')
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setItems(prev => prev.map(i => i.id === id ? data : i))
    return data
  }

  async function remove(id) {
    await supabase.from('toolkit_items').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return { items, loading, add, update, remove, refetch: fetch }
}
