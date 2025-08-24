import React, { FC, ReactNode } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

// --- Updated Prop Interfaces ---

// InputProps: Changed onChange to pass the value directly
interface InputProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void // Accepts string value instead of event object
  className?: string
  autoFocus?: boolean
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  icon?: React.ReactNode
  variant?: 'default' | 'search'
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  helperText?: string
  label?: string
}

// TextAreaProps: Changed onChange to pass the value directly
interface TextAreaProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void // Accepts string value instead of event object
  className?: string
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  rows?: number
  error?: boolean
  helperText?: string
  label?: string
}

// SelectProps: Changed onChange to pass the value directly
interface SelectProps {
  value?: string
  onChange?: (value: string) => void // Accepts string value instead of event object
  children: React.ReactNode
  className?: string
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  error?: boolean
  helperText?: string
  label?: string
}

// Reusable label and helper text component
const FieldWrapper: FC<{ label?: string; id?: string; required?: boolean; helperText?: string; error?: boolean; children: ReactNode }> = ({
  label,
  id,
  required,
  helperText,
  error,
  children,
}) => (
  <div className="space-y-1">
    {label && (
      <label
        htmlFor={id}
        className="block text-sm font-medium text-text-primary"
      >
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
    )}
    {children}
    {helperText && (
      <p className={`text-xs ${error ? 'text-error' : 'text-text-secondary'}`}>
        {helperText}
      </p>
    )}
  </div>
)

// --- Updated Input Component ---

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange, // No need for 'e' now, it will be the string value
  className = '',
  autoFocus = false,
  disabled = false,
  required = false,
  name,
  id,
  onKeyDown,
  icon,
  variant = 'default',
  size = 'md',
  error = false,
  helperText,
  label
}) => {
  const sizeClasses = {
    sm: 'py-2',
    md: 'py-3',
    lg: 'py-4'
  }

  const paddingClass = (variant === 'search' || icon) ? 'pl-10' : 'pl-4';

  const baseClasses = cn(
    'form-input',
    'rounded-lg w-full',
    'transition-all duration-200',
    paddingClass,
    sizeClasses[size],
    {
      'form-input-error': error,
    },
    className,
  )

  const renderInput = () => {
    return (
      <div className="relative">
        { (variant === 'search' || icon) && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 icon-secondary">
            {variant === 'search' ? <Search size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} /> : icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          // The key change is here: extract the value before calling onChange
          onChange={(e) => onChange?.(e.target.value)}
          className={baseClasses}
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
    <FieldWrapper label={label} id={id} required={required} helperText={helperText} error={error}>
      {renderInput()}
    </FieldWrapper>
  )
}

// --- Updated TextArea Component ---

export const TextArea: React.FC<TextAreaProps> = ({
  placeholder,
  value,
  onChange, // No need for 'e' now, it will be the string value
  className = '',
  disabled = false,
  required = false,
  name,
  id,
  rows = 4,
  error = false,
  helperText,
  label
}) => {
  const baseClasses = cn(
    'form-input',
    'px-4 py-3 rounded-lg w-full resize-y',
    {
      'form-input-error': error,
    },
    className
  )

  return (
    <FieldWrapper label={label} id={id} required={required} helperText={helperText} error={error}>
      <textarea
        placeholder={placeholder}
        value={value}
        // The key change is here: extract the value before calling onChange
        onChange={(e) => onChange?.(e.target.value)}
        className={baseClasses}
        disabled={disabled}
        required={required}
        name={name}
        id={id}
        rows={rows}
      />
    </FieldWrapper>
  )
}

// --- Updated Select Component ---

export const Select: React.FC<SelectProps> = ({
  value,
  onChange, // No need for 'e' now, it will be the string value
  children,
  className = '',
  disabled = false,
  required = false,
  name,
  id,
  error = false,
  helperText,
  label
}) => {
  const baseClasses = cn(
    'form-input',
    'px-4 py-3 rounded-lg w-full cursor-pointer',
    {
      'form-input-error': error,
    },
    className
  )

  return (
    <FieldWrapper label={label} id={id} required={required} helperText={helperText} error={error}>
      <select
        value={value}
        // The key change is here: extract the value before calling onChange
        onChange={(e) => onChange?.(e.target.value)}
        className={baseClasses}
        disabled={disabled}
        required={required}
        name={name}
        id={id}
      >
        {children}
      </select>
    </FieldWrapper>
  )
}

export default Input