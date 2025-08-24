import React from 'react'
import { Heart, Edit2, FileText, Plus } from 'lucide-react'
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
      className="card"
    >
      <div className="flex items-start justify-between p-4">
        <div className="block">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-2 bg-bg-secondary rounded-lg">
              <FileText size={20} className="text-icon-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-text-primary truncate">{name}</h3>
              <div className="flex items-center gap-4 text-sm text-text-secondary mb-1">
                <span>{expenseCount} expenses</span>
                <span className="text-success font-semibold">
                  ₱{totalAmount.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-text-tertiary">
                Last modified: {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePin}
            >
              <Heart
                size={14}
                className={isPinned ? 'fill-current' : ''}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
            >
              <Edit2 size={14} />
            </Button>
            <Button variant="ghost" size="sm">
              <Plus size={14} />
            </Button>
        </div>
      </div>
    </div>
  )
}

export default SheetCard