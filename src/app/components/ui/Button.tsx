import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  fullWidth = false
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg 
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-3 focus:ring-opacity-30
    disabled:opacity-60 disabled:cursor-not-allowed
    transform active:scale-95
    ${fullWidth ? 'w-full' : ''}
  `

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5'
  }

  const variantClasses = {
    primary: `
      bg-brand text-white
      hover:bg-primary-600 hover:shadow-amber
      focus:ring-primary-300
      disabled:hover:bg-brand disabled:hover:shadow-none
      shadow-sm
    `,
    secondary: `
      bg-transparent text-primary border border-brand
      hover:bg-active hover:shadow-amber
      focus:ring-primary-300
      disabled:hover:bg-transparent disabled:hover:shadow-none
    `,
    outline: `
      bg-primary text-primary border border-primary
      hover:border-brand hover:shadow-amber
      focus:ring-primary-300
      disabled:hover:border-primary disabled:hover:shadow-none
    `,
    ghost: `
      bg-transparent text-secondary
      hover:text-primary hover:bg-hover
      focus:ring-primary-300
      disabled:hover:bg-transparent disabled:hover:text-secondary
    `,
    danger: `
      bg-error text-white
      hover:bg-red-600 hover:shadow-lg
      focus:ring-red-300
      disabled:hover:bg-error disabled:hover:shadow-none
      shadow-sm
    `,
    success: `
      bg-success text-white
      hover:bg-green-600 hover:shadow-lg
      focus:ring-green-300
      disabled:hover:bg-success disabled:hover:shadow-none
      shadow-sm
    `
  }

  const loadingSpinnerColor = {
    primary: 'border-white',
    secondary: 'border-primary',
    outline: 'border-primary',
    ghost: 'border-text-secondary',
    danger: 'border-white',
    success: 'border-white'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      {loading && (
        <div 
          className={`
            animate-spin rounded-full h-4 w-4 border-2 border-t-transparent
            ${loadingSpinnerColor[variant]}
          `} 
        />
      )}
      {children}
    </button>
  )
}

export default Button