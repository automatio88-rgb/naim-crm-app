import { supabase } from '../supabase/client'

const TABLE = 'cv_drafts'

export async function getCVDrafts({ candidateId } = {}) {
  let query = supabase.from(TABLE).select('*')
  if (candidateId) query = query.eq('candidate_id', candidateId)
  const { data, error } = await query.order('updated_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getCVDraftById(id) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function addCVDraft(draft) {
  const { data, error } = await supabase.from(TABLE).insert(draft).select().single()
  if (error) throw error
  return data
}

export async function updateCVDraft(id, updates) {
  const { data, error } = await supabase.from(TABLE).update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteCVDraft(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}
