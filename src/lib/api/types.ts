// ============================================
// Auth Types
// ============================================

export interface User {
  id: string
  email: string
  // Add other user fields as needed
}

export interface Tokens {
  access: string
  refresh: string
}

export interface AuthResponse {
  user: User
  tokens: Tokens
}

// ============================================
// Expense Sheet Types
// ============================================

export interface ExpenseSheet {
  id: string
  name: string
  user_id: string
  is_pinned: boolean
  created_at: string
  updated_at: string
  expense_count?: number
  total_amount?: number
}

export interface CreateSheetData {
  name: string
  is_pinned?: boolean
}

export interface UpdateSheetData {
  name?: string
  is_pinned?: boolean
}

export interface SheetStats {
  total_sheets: number
  total_expenses: number
  total_amount: number
}

// ============================================
// Expense Types
// ============================================

export interface Expense {
  id: string
  sheet_id: string
  user_id: string
  amount: string | number
  category: string
  description?: string
  date: string
  created_at: string
  updated_at: string
}

export interface CreateExpenseData {
  sheet_id: string
  amount: string | number
  category: string
  description?: string
  date?: string
}

export interface UpdateExpenseData {
  amount?: string | number
  category?: string
  description?: string
  date?: string
}

export interface CategoryExpense {
  category: string
  total: number
  count: number
}

// ============================================
// API Request Types
// ============================================

export interface RequestOptions extends RequestInit {
  skipAuth?: boolean
}