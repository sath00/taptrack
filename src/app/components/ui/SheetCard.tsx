import React from 'react'
import { Heart, Edit2, FileText } from 'lucide-react'
import Button from './Button'

interface SheetCardProps {
  id: string
  name: string
  expenseCount: number
  totalAmount: number
  createdAt: string
  isPinned?: boolean
  onClick: () => void
  onEdit: () => void
  onTogglePin: () => void
}

const SheetCard: React.FC<SheetCardProps> = ({
  id,
  name,
  expenseCount,
  totalAmount,
  createdAt,
  isPinned = false,
  onClick,
  onEdit,
  onTogglePin
}) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking on action buttons
    const target = e.target as HTMLElement
    if (target.closest('button')) {
      return
    }
    onClick()
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit()
  }

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation()
    onTogglePin()
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-bg-primary rounded-lg shadow-sm border border-border-primary p-4 
                 cursor-pointer hover:shadow-md hover:border-border-secondary 
                 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Sheet Icon and Name */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-shrink-0 p-2 bg-bg-secondary rounded-lg">
              <FileText size={20} className="text-icon-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-text-primary truncate">{name}</h3>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-text-secondary mb-2">
            <span>{expenseCount} expenses</span>
            <span className="text-success font-semibold">
              ₱{totalAmount.toFixed(2)}
            </span>
          </div>

          {/* Created Date */}
          <p className="text-xs text-text-tertiary">
            Created {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handlePin}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isPinned 
                ? 'text-error hover:bg-red-50' 
                : 'text-icon-secondary hover:text-error hover:bg-red-50'
            }`}
            title={isPinned ? 'Unpin' : 'Pin sheet'}
          >
            <Heart size={16} className={isPinned ? 'fill-current' : ''} />
          </button>
          <button
            onClick={handleEdit}
            className="p-2 rounded-lg text-icon-secondary hover:text-icon-primary 
                       hover:bg-bg-secondary transition-colors duration-200"
            title="Edit sheet"
          >
            <Edit2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SheetCard