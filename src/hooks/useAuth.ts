'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { fetchProfile, logout, clearError, clearMessage } from '@/store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export function useAuth() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const {
    user,
    tokens,
    isAuthenticated,
    loading,
    error,
    message
  } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // If we have tokens but no user, fetch the profile
    if (tokens && !user && !loading) {
      dispatch(fetchProfile())
    }
  }, [tokens, user, loading, dispatch])

  const signOut = async () => {
    try {
      await dispatch(logout()).unwrap()
      router.push('/auth')
    } catch (error) {
      console.error('Logout error:', error)
      // Force redirect even if logout fails
      router.push('/auth')
    }
  }

  const clearAuthError = () => {
    dispatch(clearError())
  }

  const clearAuthMessage = () => {
    dispatch(clearMessage())
  }

  return {
    user,
    tokens,
    isAuthenticated,
    loading,
    error,
    message,
    signOut,
    clearError: clearAuthError,
    clearMessage: clearAuthMessage
  }
}
