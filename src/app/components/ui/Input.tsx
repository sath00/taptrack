import React from 'react'
import Search from 'lucide-react/dist/esm/icons/search'

interface InputProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  autoFocus?: boolean
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  icon?: React.ReactNode
  variant?: 'default' | 'search'
}

interface SelectProps {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  autoFocus = false,
  disabled = false,
  required = false,
  name,
  id,
  onKeyDown,
  icon,
  variant = 'default'
}) => {
  const baseClasses = `
    w-full px-4 py-3 border border-border-medium rounded-lg 
    focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
    disabled:bg-surface-secondary disabled:text-text-tertiary
    transition-colors bg-surface-primary text-text-primary
  `

  const searchClasses = variant === 'search' ? 'pl-10' : ''

  if (variant === 'search') {
    return (
      <div className="relative">
        <Search 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary"
        />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${baseClasses} ${searchClasses} ${className}`}
          autoFocus={autoFocus}
          disabled={disabled}
          required={required}
          name={name}
          id={id}
          onKeyDown={onKeyDown}
        />
      </div>
    )
  }

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${baseClasses} ${icon ? 'pl-10' : ''} ${className}`}
        autoFocus={autoFocus}
        disabled={disabled}
        required={required}
        name={name}
        id={id}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  children,
  className = '',
  disabled = false,
  required = false,
  name,
  id
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`
        w-full px-4 py-3 border border-border-medium rounded-lg 
        focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
        disabled:bg-surface-secondary disabled:text-text-tertiary
        transition-colors bg-surface-primary text-text-primary
        ${className}
      `}
      disabled={disabled}
      required={required}
      name={name}
      id={id}
    >
      {children}
    </select>
  )
}

export default Input