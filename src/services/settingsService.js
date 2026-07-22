import { supabase } from '../supabase/client'

export async function getAppSettings() {
  const stored = localStorage.getItem('recruitment-settings')
  if (stored) return JSON.parse(stored)

  const defaults = {
    app_name: 'Naim CRM App',
    default_country: 'Kuwait',
    default_currency: 'KWD',
    data_retention_days: 365,
    auto_logout_minutes: 30,
    dark_mode: false,
    language: 'en',
  }
  localStorage.setItem('recruitment-settings', JSON.stringify(defaults))
  return defaults
}

export async function updateAppSettings(settings) {
  localStorage.setItem('recruitment-settings', JSON.stringify(settings))
  return settings
}

export async function getUsers() {
  const { data, error } = await supabase.from('users_profiles').select('*')
  if (error) throw error
  return data
}

export async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase.from('users_profiles').update(updates).eq('id', userId).select().single()
  if (error) throw error
  return data
}

export async function deleteUserProfile(userId) {
  const { error } = await supabase.from('users_profiles').delete().eq('id', userId)
  if (error) throw error
}
