import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

// Create a noop (no operation) storage for SSR
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null)
    },
    setItem(_key: string, value: unknown) {
      return Promise.resolve(value)
    },
    removeItem(_key: string) {
      return Promise.resolve()
    },
  }
}

// Use localStorage for client-side, noop for server-side
const storage = typeof window !== 'undefined'
  ? createWebStorage('local')
  : createNoopStorage()

export default storage