import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch profile when session changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) {
        setProfile(null)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (!error && data) {
        setProfile(data)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [session])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

const signUp = async (email, password, username) => {
    // Guest mode: create pseudo-account without Supabase
    if (!email || !password) {
      // Allow guest login
      const guestUser = {
        id: 'guest-' + Date.now(),
        email: 'guest@hanaso.local',
        username: username || 'Guest'
      }
      setSession({ user: guestUser })
      setProfile({ username: username || 'Guest', id: guestUser.id })
      return { error: null }
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    })
    return { error }
  }

  const signIn = async (email, password) => {
    // Guest mode login
    if (!email || !password || email === 'guest') {
      const guestUser = {
        id: 'guest-' + Date.now(),
        email: 'guest@hanaso.local',
        username: 'Guest'
      }
      setSession({ user: guestUser })
      setProfile({ username: 'Guest', id: guestUser.id })
      return { error: null }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    setProfile(null)
    return { error }
  }

  const value = {
    session,
    profile,
    signUp,
    signIn,
    signOut,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
