import { createClient } from '@supabase/supabase-js'

// These will be set in .env.local when Claude Code wires up the backend.
// For framework/preview, the client is mocked below if no keys are present.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isLive = Boolean(supabase)
