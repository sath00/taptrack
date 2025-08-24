import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import Input from './Input'
import Button from './Button'

interface EditSheetModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string) => Promise<void>
  onDelete: () => Promise<void>
  currentName: string
}

const EditSheetModal: React.FC<EditSheetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  currentName
}) => {
  const [sheetName, setSheetName] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setSheetName(currentName)
    }
  }, [isOpen, currentName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sheetName.trim() || sheetName.trim() === currentName) {
      onClose()
      return
    }

    setLoading(true)
    try {
      await onSubmit(sheetName.trim())
      onClose()
    } catch (error) {
      console.error('Error updating sheet:', error)
    } finally {
      setLoading(false)
    }
  }

  // TODO: make a confirmation modal
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this sheet? This action cannot be undone.')) {
      return
    }

    setDeleteLoading(true)
    try {
      await onDelete()
      onClose()
    } catch (error) {
      console.error('Error deleting sheet:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading && !deleteLoading) {
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Sheet"
      size="md"
      footerLeft={
        <Button
          type="button"
          variant="danger"
          onClick={handleDelete}
          loading={deleteLoading}
          disabled={loading}
        >
          Delete
        </Button>
      }
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
            Save
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Sheet Name"
          placeholder="Enter sheet name"
          value={sheetName}
          onChange={setSheetName}
          autoFocus
          required
          disabled={loading || deleteLoading}
        />
      </form>
    </Modal>
  )
}

export default EditSheetModal