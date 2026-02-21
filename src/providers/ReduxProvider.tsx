'use client'

import { Provider, useStore } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { makeStore, AppStore } from '@/store/store'
import { setStoreInstance } from '@/lib/api/base'
import { useRef, useEffect, ReactNode } from 'react'

interface ReduxProviderProps {
  children: ReactNode
}

function StoreInitializer() {
  const store = useStore() as AppStore

  useEffect(() => {
    setStoreInstance(store)
  }, [store])

  return null
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  const storeRef = useRef<AppStore>(null)

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
        <StoreInitializer />
        {children}
      </PersistGate>
    </Provider>
  )
}
