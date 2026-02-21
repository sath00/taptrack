'use client'

import Link from 'next/link'
import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { login, register, resetPassword } from '@/store/slices/authSlice'
import { useAppDispatch } from '@/store/hooks'

type AuthMode = 'signin' | 'signup'

interface AuthFormProps {
  mode: AuthMode
}

export default function AuthForm({ mode }: AuthFormProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user, loading, error, message, clearError: clearAuthError, clearMessage: clearAuthMessage } = useAuth()

  const isLogin = mode === 'signin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationError, setValidationError] = useState('')

  const isForgotPasswordMode = isLogin && showForgotPassword

  const getPasswordStrengthErrors = (value: string): string[] => {
    const errors: string[] = []
    if (value.length < 8) errors.push('at least 8 characters')
    if (!/[a-z]/.test(value)) errors.push('one lowercase letter')
    if (!/[A-Z]/.test(value)) errors.push('one uppercase letter')
    if (!/\d/.test(value)) errors.push('one number')
    if (!/[^A-Za-z0-9]/.test(value)) errors.push('one special character')
    return errors
  }

  useEffect(() => {
    clearAuthError()
    clearAuthMessage()
  }, [clearAuthError, clearAuthMessage])

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  useEffect(() => {
    if (!isLogin && showForgotPassword) {
      setShowForgotPassword(false)
    }
  }, [isLogin, showForgotPassword])

  const handleAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearAuthError()
    clearAuthMessage()
    setValidationError('')

    if (!isLogin && password !== confirmPassword) {
      setValidationError('Passwords do not match.')
      return
    }

    if (!isLogin) {
      const passwordStrengthErrors = getPasswordStrengthErrors(password)
      if (passwordStrengthErrors.length > 0) {
        setValidationError(`Password must include ${passwordStrengthErrors.join(', ')}.`)
        return
      }
    }

    try {
      if (isLogin) {
        await dispatch(login({ email, password })).unwrap()
        router.push('/dashboard')
      } else {
        await dispatch(register({ email, password })).unwrap()
        setTimeout(() => router.push('/dashboard'), 1500)
      }
    } catch (err) {
      console.error('Auth error:', err)
    }
  }

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) {
      return
    }

    try {
      await dispatch(resetPassword(email)).unwrap()
      setShowForgotPassword(false)
    } catch (err) {
      console.error('Password reset error:', err)
    }
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="bg-primary rounded-xl shadow-xl w-full max-w-md p-8 border border-secondary">
        <h1 className="text-3xl font-bold text-primary text-center mb-2">
          Budget Tracker
        </h1>
        <p className="text-center text-secondary mb-8">Track smarter with your monthly plan.</p>

        <div className="flex mb-6 bg-tertiary rounded-lg p-1">
          <Link
            href="/signin"
            className={`flex-1 py-2 px-4 rounded-md font-medium text-center transition-colors ${
              isLogin
                ? 'bg-brand text-white'
                : 'text-secondary hover:bg-hover'
            }`}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className={`flex-1 py-2 px-4 rounded-md font-medium text-center transition-colors ${
              !isLogin
                ? 'bg-brand text-white'
                : 'text-secondary hover:bg-hover'
            }`}
          >
            Sign Up
          </Link>
        </div>

        <form onSubmit={isForgotPasswordMode ? handleForgotPassword : handleAuth} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none focus:border-focus text-primary"
              required
            />
          </div>

          {!isForgotPasswordMode && (
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (validationError) setValidationError('')
                }}
                className="w-full px-4 py-3 pr-12 border border-primary rounded-lg focus:outline-none focus:border-focus text-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 icon-secondary hover:icon-primary transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3l18 18" />
                    <path d="M10.58 10.58A2 2 0 0 0 13.42 13.42" />
                    <path d="M9.88 5.09A9.77 9.77 0 0 1 12 4c5 0 9.27 3.11 11 8a11.82 11.82 0 0 1-3.2 4.8" />
                    <path d="M6.61 6.61A11.77 11.77 0 0 0 1 12c1.73 4.89 6 8 11 8a9.76 9.76 0 0 0 5.39-1.61" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          )}

          {!isLogin && (
            <p className="text-xs text-secondary">
              Use at least 8 characters with uppercase, lowercase, number, and special character.
            </p>
          )}

          {!isLogin && (
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (validationError) setValidationError('')
                }}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:border-focus text-primary ${
                  validationError ? 'border-error' : 'border-primary'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 icon-secondary hover:icon-primary transition-colors"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3l18 18" />
                    <path d="M10.58 10.58A2 2 0 0 0 13.42 13.42" />
                    <path d="M9.88 5.09A9.77 9.77 0 0 1 12 4c5 0 9.27 3.11 11 8a11.82 11.82 0 0 1-3.2 4.8" />
                    <path d="M6.61 6.61A11.77 11.77 0 0 0 1 12c1.73 4.89 6 8 11 8a9.76 9.76 0 0 0 5.39-1.61" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          )}

          {!!validationError && <p className="text-sm text-error">{validationError}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading
              ? 'Loading...'
              : (isForgotPasswordMode ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Sign Up'))}
          </button>
        </form>

        {isLogin && !isForgotPasswordMode && (
          <button
            onClick={() => setShowForgotPassword(true)}
            className="w-full mt-3 text-sm text-link hover:opacity-80"
          >
            Forgot your password?
          </button>
        )}

        {isForgotPasswordMode && (
          <button
            onClick={() => setShowForgotPassword(false)}
            className="w-full mt-3 text-sm text-secondary hover:text-primary"
          >
            Back to sign in
          </button>
        )}

        {(message || error) && (
          <p className={`mt-4 text-sm text-center ${
            message ? 'text-success' : 'text-error'
          }`}>
            {message || error}
          </p>
        )}
      </div>
    </div>
  )
}
