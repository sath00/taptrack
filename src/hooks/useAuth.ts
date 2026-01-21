'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { fetchProfile, logout, clearError, clearMessage, clearAuth } from '@/store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export function useAuth() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [isValidating, setIsValidating] = useState(true)
  const hasValidated = useRef(false)

  const {
    user,
    tokens,
    isAuthenticated,
    loading,
    error,
    message
  } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const validateAuth = async () => {
      // Skip if already validated or currently loading
      if (hasValidated.current || loading) {
        setIsValidating(false)
        return
      }

      // If we have tokens but no user, validate them by fetching profile
      if (tokens && !user) {
        try {
          await dispatch(fetchProfile()).unwrap()
          hasValidated.current = true
          setIsValidating(false)
        } catch (error) {
          console.error('Token validation failed:', error)
          dispatch(clearAuth())
          hasValidated.current = true
          setIsValidating(false)
        }
      } else if (!tokens) {
        // No tokens at all
        hasValidated.current = true
        setIsValidating(false)
      } else if (user) {
        // Already have user, no need to validate
        hasValidated.current = true
        setIsValidating(false)
      }
    }

    validateAuth()
  }, [tokens, user, loading, dispatch])

  const signOut = async () => {
    try {
      await dispatch(logout()).unwrap()
      hasValidated.current = false
      router.push('/auth')
    } catch (error) {
      console.error('Logout error:', error)
      hasValidated.current = false
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
    loading: loading || isValidating,
    error,
    message,
    signOut,
    clearError: clearAuthError,
    clearMessage: clearAuthMessage
  }
}