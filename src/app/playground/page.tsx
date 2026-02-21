'use client'

import { useRouter } from 'next/navigation'
import Button from '../components/ui/Button'

export default function PlaygroundPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-bg-tertiary p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-bg-primary rounded-lg shadow-md border border-border-primary p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary text-center mb-3">
            UI Playground
          </h1>
          <p className="text-center text-text-secondary mb-8">
            Open a component playground page.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              fullWidth
              variant="primary"
              className="py-4"
              onClick={() => router.push('/playground/button')}
            >
              Button Playground
            </Button>
            <Button
              fullWidth
              variant="outline"
              className="py-4"
              onClick={() => router.push('/playground/input')}
            >
              Input Playground
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
