import { ReactNode } from 'react';
import { typography } from '@/styles/typography';
import { colors } from '@/styles/colors';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'fixed';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
}: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md transition-colors min-w-[173px] min-h-[60px]';
  
  const variantClasses = {
    primary: `text-white`,
    secondary: 'text-black',
    outline: 'border border-gray-300 hover:border-gray-400 text-black',
  };
  
  const sizeClasses = {
    sm: 'text-sm px-3 py-2',
    md: 'text-base px-4 py-3',
    lg: 'text-lg px-6 py-5',
    fixed: 'text-base w-[173px] h-[60px]',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${typography.button.primary}
        ${disabledClasses}
        ${widthClass}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: variant === 'primary' ? colors.primary.darkpurple : undefined,
        color: variant === 'primary' ? colors.supporting.white : undefined,
      }}
    >
      {children}
    </button>
  );
};

export default Button;