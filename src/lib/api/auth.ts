import { BaseApiClient } from './base'
import { User, AuthResponse } from './types'

export class AuthApiClient extends BaseApiClient {
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

    // Let Redux handle the storage
    await this.setTokens(data.tokens)
    return data
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true
    })

    // Let Redux handle the storage
    await this.setTokens(data.tokens)
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

export const authApi = new AuthApiClient()