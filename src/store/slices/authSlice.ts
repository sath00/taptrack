import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { api } from '@/lib/api'

// Types
export interface User {
  id: string
  email: string
  // Add other user fields as needed
}

export interface Tokens {
  access: string
  refresh: string
}

interface AuthState {
  user: User | null
  tokens: Tokens | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  message: string | null
}

interface LoginCredentials {
  email: string
  password: string
}

interface AuthResponse {
  user: User
  tokens: Tokens
}

// Async thunks for auth operations
export const login = createAsyncThunk<AuthResponse, LoginCredentials>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await api.login(email, password)
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed')
    }
  }
)

export const register = createAsyncThunk<AuthResponse, LoginCredentials>(
  'auth/register',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await api.register(email, password)
      return data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed')
    }
  }
)

export const logout = createAsyncThunk<void, void>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.logout()
    } catch (error) {
      // Continue with logout even if request fails
      console.error('Logout error:', error)
    }
  }
)

export const refreshToken = createAsyncThunk<{ tokens: Tokens }, void>(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState }
      if (!state.auth.tokens?.refresh) {
        throw new Error('No refresh token available')
      }

      const newTokens = await api.refreshAccessToken()
      return { tokens: newTokens }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Token refresh failed')
    }
  }
)

export const fetchProfile = createAsyncThunk<User, void>(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const profile = await api.getProfile()
      return profile
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile')
    }
  }
)

export const resetPassword = createAsyncThunk<{ message: string }, string>(
  'auth/resetPassword',
  async (email, { rejectWithValue }) => {
    try {
      await api.resetPassword(email)
      return { message: 'Password reset link sent to your email!' }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Password reset failed')
    }
  }
)

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  message: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearMessage: (state) => {
      state.message = null
    },
    clearAuth: (state) => {
      state.user = null
      state.tokens = null
      state.isAuthenticated = false
      state.error = null
      state.message = null
    },
    setTokens: (state, action: PayloadAction<Tokens>) => {
      state.tokens = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
        state.message = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.tokens = action.payload.tokens
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
        state.message = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.tokens = action.payload.tokens
        state.isAuthenticated = true
        state.message = 'Registration successful!'
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.tokens = null
        state.isAuthenticated = false
        state.message = 'Logged out successfully'
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false
        // Still clear auth data even if logout request failed
        state.user = null
        state.tokens = null
        state.isAuthenticated = false
      })

      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.tokens = action.payload.tokens
      })
      .addCase(refreshToken.rejected, (state) => {
        // Clear auth if refresh fails
        state.user = null
        state.tokens = null
        state.isAuthenticated = false
      })

      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.loading = false
        state.user = null
        state.tokens = null
        state.isAuthenticated = false
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true
        state.error = null
        state.message = null
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false
        state.message = action.payload.message
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearMessage, clearAuth, setTokens } = authSlice.actions
export default authSlice