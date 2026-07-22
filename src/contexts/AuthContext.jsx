import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function register(email, password, displayName) {
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
    await supabase.auth.signOut()
    setUser(null)
    setUserProfile(null)
  }

  async function updateProfile(updates) {
    if (!user) return
    const { error } = await supabase
      .from('users_profiles')
      .update(updates)
      .eq('id', user.id)
    if (error) throw error
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
        refreshProfile: () => user && fetchProfile(user.id),
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
