'use client'

import Link from 'next/link'
import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { login, register, resetPassword } from '@/store/slices/authSlice'
import { useAppDispatch } from '@/store/hooks'
import Button from '@/app/components/ui/Button'
import Input from '@/app/components/ui/Input'
import Image from 'next/image'

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
        <div className="flex justify-center">
          <Image
            src="/logo_540x148.svg"
            alt="TapTrack"
            width={540}
            height={148}
            className="w-[320px] h-auto max-w-none"
            priority
          />
        </div>
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
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            required
          />

          {!isForgotPasswordMode && (
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(value) => {
                  setPassword(value)
                  if (validationError) setValidationError('')
                }}
                className="pr-12"
                required
              />
              <Button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 !p-2 icon-secondary hover:icon-primary transition-colors"
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
              </Button>
            </div>
          )}

          {!isLogin && (
            <p className="text-xs text-secondary">
              Use at least 8 characters with uppercase, lowercase, number, and special character.
            </p>
          )}

          {!isLogin && (
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(value) => {
                  setConfirmPassword(value)
                  if (validationError) setValidationError('')
                }}
                className={`pr-12 ${
                  validationError ? 'border-error' : 'border-primary'
                }`}
                required
              />
              <Button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 !p-2 icon-secondary hover:icon-primary transition-colors"
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
              </Button>
            </div>
          )}

          {!!validationError && <p className="text-sm text-error">{validationError}</p>}

          <Button
            type="submit"
            loading={loading}
            fullWidth
            className="py-3"
          >
            {isForgotPasswordMode ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Sign Up')}
          </Button>
        </form>

        {isLogin && !isForgotPasswordMode && (
          <Button
            onClick={() => setShowForgotPassword(true)}
            variant="ghost"
            fullWidth
            className="mt-3 text-sm text-link hover:opacity-80"
          >
            Forgot your password?
          </Button>
        )}

        {isForgotPasswordMode && (
          <Button
            onClick={() => setShowForgotPassword(false)}
            variant="ghost"
            fullWidth
            className="mt-3 text-sm text-secondary hover:text-primary"
          >
            Back to sign in
          </Button>
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
