import React, { useState } from 'react'
import Modal from './Modal'
import Input from './Input'
import Button from './Button'

interface CreateSheetModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string) => Promise<void>
}

const CreateSheetModal: React.FC<CreateSheetModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [sheetName, setSheetName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sheetName.trim()) return

    setLoading(true)
    try {
      await onSubmit(sheetName.trim())
      setSheetName('')
      onClose()
    } catch (error) {
      console.error('Error creating sheet:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setSheetName('')
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Sheet"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Sheet Name"
          placeholder="Enter sheet name (e.g., Monthly Expenses, Trip Budget)"
          value={sheetName}
          onChange={(e) => setSheetName(e.target.value)}
          autoFocus
          required
          disabled={loading}
        />
        
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={!sheetName.trim()}
          >
            Create Sheet
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateSheetModal