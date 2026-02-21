import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

// Create a noop (no operation) storage for SSR
const createNoopStorage = () => {
  return {
    getItem(key: string) {
      void key
      return Promise.resolve(null)
    },
    setItem(key: string, value: unknown) {
      void key
      return Promise.resolve(value)
    },
    removeItem(key: string) {
      void key
      return Promise.resolve()
    },
  }
}

// Use localStorage for client-side, noop for server-side
const storage = typeof window !== 'undefined'
  ? createWebStorage('local')
  : createNoopStorage()

export default storage
