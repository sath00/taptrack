import { Tokens, RequestOptions } from './types'
import { isTokenExpired } from '@/lib/utils/jwt'

const resolveApiUrl = (): string => {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (!configuredUrl) return '/api'

  // Keep browser requests same-origin so Next rewrites can proxy to Django.
  if (configuredUrl.startsWith('http://') || configuredUrl.startsWith('https://')) {
    return '/api'
  }

  return configuredUrl.endsWith('/') ? configuredUrl.slice(0, -1) : configuredUrl
}

const API_URL = resolveApiUrl()

// Store reference for accessing Redux state
interface StoreInstance {
  getState: () => {
    auth: {
      tokens: Tokens | null
    }
  }
  dispatch: (action: { type: string; payload?: unknown }) => void
}

let storeInstance: StoreInstance | null = null

export const setStoreInstance = (store: StoreInstance) => {
  storeInstance = store
}

export class BaseApiClient {
  protected baseURL: string

  constructor() {
    this.baseURL = API_URL
  }

  private normalizeEndpoint(endpoint: string): string {
    const [path, query = ''] = endpoint.split('?')
    const withLeadingSlash = path.startsWith('/') ? path : `/${path}`
    const normalizedPath = withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
    return query ? `${normalizedPath}?${query}` : normalizedPath
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

  async refreshAccessToken(): Promise<Tokens> {
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
    return newTokens
  }


  /**
   * Ensure your security credentials are valid before the request is sent.

   * @param endpoint
   * @param options
   * @returns
   */
  async request<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const normalizedEndpoint = this.normalizeEndpoint(endpoint)
    let tokens = await this.getTokens()

    // Check if access token is expired and refresh if needed (only if we need auth)
    if (tokens?.access && !options.skipAuth && isTokenExpired(tokens.access)) {
      try {
        // Token is expired, try to refresh
        await this.refreshAccessToken()
        tokens = await this.getTokens() // Get updated tokens
      } catch {
        // Refresh failed, clear tokens and redirect
        await this.clearTokens()
        if (typeof window !== 'undefined') {
          window.location.href = '/signin'
        }
        throw new Error('Session expired. Please login again.')
      }
    }

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

    let response = await fetch(`${this.baseURL}${normalizedEndpoint}`, config)

    // Try to refresh token if 401 (as a fallback)
    if (response.status === 401 && tokens?.refresh && !options.skipAuth) {
      try {
        await this.refreshAccessToken()
        tokens = await this.getTokens()
        ;(config.headers as Record<string, string>)['Authorization'] = `Bearer ${tokens?.access}`
        response = await fetch(`${this.baseURL}${normalizedEndpoint}`, config)
      } catch {
        await this.clearTokens()
        if (typeof window !== 'undefined') {
          window.location.href = '/signin'
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
