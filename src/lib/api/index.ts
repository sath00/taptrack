// Barrel export for convenient imports
export * from './types'
export * from './base'
export * from './auth'
export * from './expenses'

// Legacy compatibility - single api object
import { AuthApiClient } from './auth'
import { ExpensesApiClient } from './expenses'
import { CreateExpenseData, UpdateExpenseData } from './types'

class ApiClient extends AuthApiClient {
  expenses: ExpensesApiClient

  constructor() {
    super()
    this.expenses = new ExpensesApiClient()
  }

  // Expose expenses methods at root level for backwards compatibility
  getSheets(search = '') {
    return this.expenses.getSheets(search)
  }

  getSheet(id: string) {
    return this.expenses.getSheet(id)
  }

  createSheet(name: string) {
    return this.expenses.createSheet(name)
  }

  updateSheet(id: string, name: string) {
    return this.expenses.updateSheet(id, name)
  }

  deleteSheet(id: string) {
    return this.expenses.deleteSheet(id)
  }

  togglePinSheet(id: string) {
    return this.expenses.togglePinSheet(id)
  }

  getSheetStats() {
    return this.expenses.getSheetStats()
  }

  getExpenses(sheetId: string | null = null) {
    return this.expenses.getExpenses(sheetId)
  }

  createExpense(data: CreateExpenseData) {
    return this.expenses.createExpense(data)
  }

  updateExpense(id: string, data: UpdateExpenseData) {
    return this.expenses.updateExpense(id, data)
  }

  deleteExpense(id: string) {
    return this.expenses.deleteExpense(id)
  }

  getRecentExpenses(sheetId: string, limit = 5) {
    return this.expenses.getRecentExpenses(sheetId, limit)
  }

  getExpensesByCategory(sheetId: string | null = null) {
    return this.expenses.getExpensesByCategory(sheetId)
  }
}

export const api = new ApiClient()