import { supabase } from '../supabase/client'

const TABLE = 'appointments'

export async function getAppointments({ search, status, date, page = 1, pageSize = 20 } = {}) {
  let query = supabase.from(TABLE).select('*, candidates(name, email, phone)', { count: 'exact' })

  if (search) {
    query = query.ilike('title', `%${search}%`)
  }
  if (status) query = query.eq('status', status)
  if (date) query = query.eq('date', date)

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, count, error } = await query
    .order('date', { ascending: true })
    .range(from, to)

  if (error) throw error
  return { data, count, page, pageSize }
}

export async function addAppointment(appointment) {
  const { data, error } = await supabase.from(TABLE).insert(appointment).select().single()
  if (error) throw error
  return data
}

export async function updateAppointment(id, updates) {
  const { data, error } = await supabase.from(TABLE).update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteAppointment(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}

export async function getUpcomingAppointments(limit = 10) {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase.from(TABLE).select('*, candidates(name)').gte('date', today).order('date', { ascending: true }).limit(limit)
  if (error) throw error
  return data
}
