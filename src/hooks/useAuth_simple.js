import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  // Simplified auth - just check if we have a session, don't initialize
  useEffect(() => {
    setLoading(false)
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return {
    user,
    loading,
    signOut,
    signIn: async (email, password) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        
        setUser(data.user)
        return { success: true }
      } catch (error) {
        console.error('Error signing in:', error)
        return { success: false, error: error.message }
      }
    },
    signUp: async (email, password) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        
        if (error) throw error
        
        setUser(data.user)
        return { success: true }
      } catch (error) {
        console.error('Error signing up:', error)
        return { success: false, error: error.message }
      }
    }
  }
}
