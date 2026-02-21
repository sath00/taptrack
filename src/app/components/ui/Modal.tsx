"use client"

import React, { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Button from "./Button"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footerLeft?: React.ReactNode   // ✅ new left slot
  footerRight?: React.ReactNode  // ✅ new right slot
  size?: "sm" | "md" | "lg" | "xl"
  showCloseButton?: boolean
  className?: string
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footerLeft,
  footerRight,
  size = "md",
  showCloseButton = true,
  className = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // Disable body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          aria-modal="true"
          role="dialog"
          aria-labelledby={title ? "modal-title" : undefined}
          aria-describedby="modal-content"
        >
          <motion.div
            ref={modalRef}
            className={`bg-white rounded-2xl shadow-lg w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto ${className}`}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-4">
                {title && (
                  <h2 id="modal-title" className="text-lg font-semibold text-text-primary">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="!p-2 !rounded-full !text-icon-secondary hover:!text-icon-primary"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </Button>
                )}
              </div>
            )}

            {/* Content */}
            <div id="modal-content" className="p-4 mb-4">
              {children}
            </div>

            {/* Footer (optional) */}
            {(footerLeft || footerRight) && (
              <div className="flex items-center justify-between gap-2 p-4 border-t border-primary">
                <div className="flex gap-2">{footerLeft}</div>
                <div className="flex gap-2">{footerRight}</div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
