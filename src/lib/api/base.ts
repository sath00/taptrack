import { Tokens, RequestOptions } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Store reference for accessing Redux state
let storeInstance: any = null

export const setStoreInstance = (store: any) => {
  storeInstance = store
}

export class BaseApiClient {
  protected baseURL: string

  constructor() {
    this.baseURL = API_URL
  }

  async getTokens(): Promise<Tokens | null> {
    // First try to get from Redux store
    if (storeInstance) {
      return storeInstance.getState().auth.tokens
    }

    // Fallback to localStorage for initial load
    if (typeof window === 'undefined') return null

    // Check redux-persist storage
    const persistRoot = localStorage.getItem('persist:root')
    if (persistRoot) {
      try {
        const parsed = JSON.parse(persistRoot)
        if (parsed.auth) {
          const auth = JSON.parse(parsed.auth)
          return auth.tokens
        }
      } catch {
        return null
      }
    }

    return null
  }

  async setTokens(tokens: Tokens): Promise<void> {
    // Redux will handle this through the store
    // We don't manually set localStorage anymore
    if (storeInstance) {
      storeInstance.dispatch({ type: 'auth/setTokens', payload: tokens })
    }
  }

  async clearTokens(): Promise<void> {
    // Redux will handle this through the store
    if (storeInstance) {
      storeInstance.dispatch({ type: 'auth/clearAuth' })
    }
  }

  async refreshAccessToken(): Promise<string> {
    const tokens = await this.getTokens()
    if (!tokens?.refresh) throw new Error('No refresh token')

    const response = await fetch(`${this.baseURL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: tokens.refresh })
    })

    if (!response.ok) throw new Error('Token refresh failed')

    const data = await response.json()
    const newTokens = { ...tokens, access: data.access }
    await this.setTokens(newTokens)
    return data.access
  }

  async request<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const tokens = await this.getTokens()

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      }
    }

    // Add auth header if token exists
    if (tokens?.access && !options.skipAuth) {
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${tokens.access}`
    }

    let response = await fetch(`${this.baseURL}${endpoint}`, config)

    // Try to refresh token if 401
    if (response.status === 401 && tokens?.refresh && !options.skipAuth) {
      try {
        const newAccessToken = await this.refreshAccessToken()
        ;(config.headers as Record<string, string>)['Authorization'] = `Bearer ${newAccessToken}`
        response = await fetch(`${this.baseURL}${endpoint}`, config)
      } catch {
        await this.clearTokens()
        if (typeof window !== 'undefined') {
          window.location.href = '/auth'
        }
        throw new Error('Authentication failed')
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || error.error || `Request failed: ${response.status}`)
    }

    return response.json()
  }
}