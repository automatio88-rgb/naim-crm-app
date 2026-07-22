import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../supabase/client'

const AuthContext = createContext(null)

const DEMO_USER = { id: 'demo-admin', email: 'admin@naiminvestments.com' }
const DEMO_PROFILE = {
  id: 'demo-admin',
  display_name: 'Admin',
  role: 'admin',
  page_permissions: ['dashboard', 'candidates', 'jobs', 'appointments', 'tasks', 'documents', 'reports', 'settings', 'associates', 'cv-builder', 'job-generator', 'receptionist-view', 'recycle-bin'],
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(isSupabaseConfigured ? null : DEMO_USER)
  const [userProfile, setUserProfile] = useState(isSupabaseConfigured ? null : DEMO_PROFILE)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else {
        setUserProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('users_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setUserProfile(data)
    setLoading(false)
  }

  async function login(email, password) {
    if (!isSupabaseConfigured) {
      setUser(DEMO_USER)
      setUserProfile(DEMO_PROFILE)
      return { user: DEMO_USER }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function register(email, password, displayName) {
    if (!isSupabaseConfigured) {
      setUser(DEMO_USER)
      setUserProfile(DEMO_PROFILE)
      return { user: DEMO_USER }
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    })
    if (error) throw error
    if (data.user) {
      await supabase.from('users_profiles').insert({
        id: data.user.id,
        display_name: displayName,
        role: 'user',
        page_permissions: ['dashboard', 'candidates', 'jobs'],
      })
    }
    return data
  }

  async function logout() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setUserProfile(null)
  }

  async function updateProfile(updates) {
    if (!user) return
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('users_profiles')
        .update(updates)
        .eq('id', user.id)
      if (error) throw error
    }
    setUserProfile((prev) => ({ ...prev, ...updates }))
  }

  const isAdmin = userProfile?.role === 'admin'
  const isManager = userProfile?.role === 'manager' || isAdmin

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin,
        isManager,
        refreshProfile: () => isSupabaseConfigured && user && fetchProfile(user.id),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
