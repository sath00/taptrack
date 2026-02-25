'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Button from './components/ui/Button'

export default function Home() {
  const router = useRouter()
  const { user, tokens, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    if (tokens && user) {
      router.push('/dashboard')
    }
  }, [tokens, user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-disabled flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-disabled flex items-center justify-center p-6">
      <section className="w-full max-w-xl bg-primary border border-border-primary rounded-2xl shadow-sm p-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary">
          TapTrack
        </h1>
        <p className="mt-3 text-secondary">
          Keep your expenses organized in one place.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-center">
          <Link href="/dashboard" className="sm:min-w-[150px]">
            <Button fullWidth>Go to Dashboard</Button>
          </Link>
          <Link href="/signin" className="sm:min-w-[150px]">
            <Button variant="secondary" fullWidth>Sign In</Button>
          </Link>
          <Link href="/signup" className="sm:min-w-[150px]">
            <Button variant="outline" fullWidth>Sign Up</Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
