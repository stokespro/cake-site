import { useEffect, useState } from 'react'
import { supabase, isLive } from './supabase'
import { mockStrains, mockRetailers } from '../data/mockData'

/**
 * Fetch active strains, ordered by sort_order.
 * Live query: supabase.from('strains').select('*').eq('is_active', true).order('sort_order')
 */
export function useStrains() {
  const [strains, setStrains] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!isLive) {
        // simulate latency so loading states are visible
        await new Promise((r) => setTimeout(r, 350))
        if (!cancelled) {
          setStrains(mockStrains)
          setLoading(false)
        }
        return
      }

      const { data, error } = await supabase
        .from('strains')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (!cancelled) {
        if (error) console.error('strains query error', error)
        setStrains(data || [])
        setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { strains, loading }
}

export function useStrain(slug) {
  const [strain, setStrain] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!isLive) {
        await new Promise((r) => setTimeout(r, 250))
        if (!cancelled) {
          setStrain(mockStrains.find((s) => s.slug === slug) || null)
          setLoading(false)
        }
        return
      }

      const { data, error } = await supabase
        .from('strains')
        .select('*')
        .eq('slug', slug)
        .single()

      if (!cancelled) {
        if (error) console.error('strain query error', error)
        setStrain(data || null)
        setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [slug])

  return { strain, loading }
}

/**
 * Live query: supabase.from('retailers').select('*').eq('is_active', true)
 * RLS must restrict to public-readable columns.
 */
export function useRetailers() {
  const [retailers, setRetailers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!isLive) {
        await new Promise((r) => setTimeout(r, 400))
        if (!cancelled) {
          setRetailers(mockRetailers)
          setLoading(false)
        }
        return
      }

      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .eq('is_active', true)

      if (!cancelled) {
        if (error) console.error('retailers query error', error)
        setRetailers(data || [])
        setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { retailers, loading }
}

/**
 * Lead form submission.
 * Live: supabase.from('leads').insert([payload])
 * Then a Postgres trigger or Edge Function creates the CRM follow-up task.
 */
export async function submitLead(payload) {
  if (!isLive) {
    console.log('[mock] lead submitted:', payload)
    await new Promise((r) => setTimeout(r, 800))
    return { ok: true }
  }

  const { error } = await supabase.from('leads').insert([payload])
  if (error) {
    console.error('lead insert error', error)
    return { ok: false, error: error.message }
  }
  return { ok: true }
}
