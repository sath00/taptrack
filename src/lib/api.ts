import { User, Tokens } from '@/store/slices/authSlice'
import type { AppStore } from '@/store/store'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'


let store: AppStore | null = null

export const setStore = (storeInstance: AppStore) => {
  store = storeInstance
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean
}

interface AuthResponse {
  user: User
  tokens: Tokens
}

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = API_URL
  }

  async getTokens(): Promise<Tokens | null> {
    if (store) {
      return store.getState().auth.tokens
    }

    // Fallback to localStorage for client-side
    if (typeof window === 'undefined') return null

    const tokens = localStorage.getItem('tokens')
    if (!tokens) return null

    try {
      return JSON.parse(tokens)
    } catch {
      return null
    }
  }

  async setTokens(tokens: Tokens): Promise<void> {
    if (store) {
      store.dispatch({ type: 'auth/setTokens', payload: tokens })
    }

    // Also update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('tokens', JSON.stringify(tokens))
    }
  }

  async clearTokens(): Promise<void> {
    if (store) {
      store.dispatch({ type: 'auth/clearAuth' })
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem('tokens')
      localStorage.removeItem('user')
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
    const newTokens: Tokens = { ...tokens, access: data.access }
    await this.setTokens(newTokens)
    return newTokens
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
        const newTokens = await this.refreshAccessToken()
        ;(config.headers as Record<string, string>)['Authorization'] = `Bearer ${newTokens.access}`
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

  // Auth endpoints
  async register(email: string, password: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        password_confirm: password
      }),
      skipAuth: true
    })

    await this.setTokens(data.tokens)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    return data
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true
    })
    
    await this.setTokens(data.tokens)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    return data
  }

  async logout(): Promise<void> {
    const tokens = await this.getTokens()
    if (tokens?.refresh) {
      try {
        await this.request('/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: tokens.refresh })
        })
      } catch {
        // Continue with logout even if request fails
      }
    }
    await this.clearTokens()
  }

  async resetPassword(email: string): Promise<{ message: string }> {
    return this.request('/auth/password-reset/', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true
    })
  }

  async getProfile(): Promise<User> {
    return this.request<User>('/auth/profile/')
  }
}

export const api = new ApiClient()