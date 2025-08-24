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
      footerRight={
        <>
          <Button
            type="button"
            variant="secondary"
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
            onClick={handleSubmit}
          >
            Create
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Enter sheet name"
          value={sheetName}
          onChange={setSheetName}
          autoFocus
          required
          disabled={loading}
        />
      </form>
    </Modal>
  )
}

export default CreateSheetModal