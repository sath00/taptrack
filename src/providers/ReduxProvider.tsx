'use client'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { makeStore, AppStore } from '@/store/store'
import { useRef, ReactNode } from 'react'

interface ReduxProviderProps {
  children: ReactNode
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  const storeRef = useRef<AppStore | undefined>(undefined)

  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate
        loading={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        }
        persistor={storeRef.current.__persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  )
}
