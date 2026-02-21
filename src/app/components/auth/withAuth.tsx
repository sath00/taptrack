'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

/**
 * Wrap page components to guard specific routes that require a user.
 * If no user is found, redirect to sign-in page.
 * @param Component 
 * @returns 
 */

export function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedRoute(props: P) {
    const { user, loading, tokens } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && (!user || !tokens)) {
        router.push('/signin')
      }
    }, [user, loading, tokens, router])

    if (loading) {
      return (
        <div className="min-h-screen bg-bg-tertiary flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-text-secondary">Verifying authentication...</p>
          </div>
        </div>
      )
    }

    if (!user || !tokens) {
      return null
    }

    return <Component {...props} />
  }
}
