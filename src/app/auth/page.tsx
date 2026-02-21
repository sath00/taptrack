'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { login, register, resetPassword } from '@/store/slices/authSlice'
import { useAppDispatch } from '@/store/hooks'

export default function AuthPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user, loading, error, message, clearError: clearAuthError, clearMessage: clearAuthMessage } = useAuth()

  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  useEffect(() => {
    // Clear messages when component mounts
    clearAuthError()
    clearAuthMessage()
  }, [clearAuthError, clearAuthMessage])

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearAuthError()
    clearAuthMessage()

    try {
      if (isLogin) {
        await dispatch(login({ email, password })).unwrap()
        router.push('/dashboard')
      } else {
        await dispatch(register({ email, password })).unwrap()
        setTimeout(() => router.push('/dashboard'), 1500)
      }
    } catch (error) {
      // Error is handled by Redux state
      console.error('Auth error:', error)
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
    } catch (error) {
      // Error is handled by Redux state
      console.error('Password reset error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Budget Tracker
        </h1>

        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 px-4 rounded-l-lg font-medium transition-colors ${
              isLogin
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-r-lg font-medium transition-colors ${
              !isLogin
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={showForgotPassword ? handleForgotPassword : handleAuth} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          {!showForgotPassword && (
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : (
              showForgotPassword ? 'Send Reset Link' : (isLogin ? 'Login' : 'Sign Up')
            )}
          </button>
        </form>

        {isLogin && !showForgotPassword && (
          <button
            onClick={() => setShowForgotPassword(true)}
            className="w-full mt-3 text-sm text-blue-500 hover:text-blue-600"
          >
            Forgot your password?
          </button>
        )}

        {showForgotPassword && (
          <button
            onClick={() => setShowForgotPassword(false)}
            className="w-full mt-3 text-sm text-gray-500 hover:text-gray-600"
          >
            Back to login
          </button>
        )}

        {(message || error) && (
          <p className={`mt-4 text-sm text-center ${
            message ? 'text-green-600' : 'text-red-600'
          }`}>
            {message || error}
          </p>
        )}
      </div>
    </div>
  )
}
