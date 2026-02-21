'use client'

import { LogOut, Plus, User } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'

interface TopbarProps {
  title?: string
  searchQuery: string
  onSearchChange: (value: string) => void
  onAddSheet?: () => void
  showAddButton?: boolean
  addButtonLabel?: string
  searchPlaceholder?: string
  onLogout: () => void
  isLoggingOut: boolean
}

export default function Topbar({
  title = 'Dashboard',
  searchQuery,
  onSearchChange,
  onAddSheet,
  showAddButton = true,
  addButtonLabel = 'Add new sheet',
  searchPlaceholder = 'Search sheets...',
  onLogout,
  isLoggingOut,
}: TopbarProps) {
  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden px-4 py-4 border-b border-secondary bg-primary flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">
          <span className="text-primary">Tap</span>
          <span className="text-text-primary">Track</span>
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="text" size="sm" aria-label="Profile" className="!p-2 !min-w-0">
            <User size={16} />
          </Button>
          <Button
            variant="textDanger"
            size="sm"
            aria-label="Logout"
            className="!p-2 !min-w-0"
            onClick={onLogout}
            loading={isLoggingOut}
          >
            <LogOut size={16} />
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-secondary bg-primary">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h1 className="text-3xl font-semibold text-text-primary">{title}</h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full lg:w-auto lg:min-w-[560px]">
            <div className="w-full sm:flex-1">
              <Input
                variant="search"
                value={searchQuery}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
                className="bg-primary"
              />
            </div>
            {showAddButton && (
              <Button onClick={onAddSheet} variant="primary" className="shrink-0 sm:px-5 sm:py-3">
                <Plus size={16} />
                {addButtonLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
