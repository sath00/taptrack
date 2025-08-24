import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
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
  fullWidth = false,
}) => {
  const baseClasses = `inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 ease-in-out
    focus:outline-none
    cursor-pointer
    disabled:opacity-60 disabled:cursor-not-allowed
    transform active:scale-95
    ${fullWidth ? 'w-full' : ''}`;

  const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

const variantClasses: Record<ButtonProps['variant'], string> = {
  primary: 'btn-primary shadow-sm',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger shadow-sm',
  success: 'btn-success shadow-sm',
};

  const loadingSpinnerColor: Record<string, string> = {
    primary: 'border-white',
    secondary: 'border-brand',
    outline: 'border-brand',
    ghost: 'border-text-secondary',
    danger: 'border-white',
    success: 'border-white',
  };

  const currentVariantClasses = variantClasses[variant!];
  const currentSizeClasses = sizeClasses[size!];

  return (
    <button
      className={`${baseClasses} ${currentSizeClasses} ${currentVariantClasses} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
    >
      {loading && (
        <span
          className={`animate-spin h-4 w-4 border-2 rounded-full ${loadingSpinnerColor[variant!]} border-r-transparent`}
        />
      )}
      {children}
    </button>
  );
};

export default Button;