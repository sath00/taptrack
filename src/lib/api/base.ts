import { Tokens, RequestOptions } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export class BaseApiClient {
  protected baseURL: string

  constructor() {
    this.baseURL = API_URL
  }

  async getTokens(): Promise<Tokens | null> {
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
    if (typeof window === 'undefined') return
    localStorage.setItem('tokens', JSON.stringify(tokens))
  }

  async clearTokens(): Promise<void> {
    if (typeof window === 'undefined') return
    localStorage.removeItem('tokens')
    localStorage.removeItem('user')
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
    const newTokens: Tokens = {
      access: data.access,
      refresh: tokens.refresh, // keep existing refresh
    }

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
}