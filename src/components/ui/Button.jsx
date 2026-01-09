import { forwardRef } from 'react';

const variantClasses = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  danger: 'btn btn-danger',
  link: 'btn btn-link',
  icon: 'btn btn-icon'
};

const sizeClasses = {
  default: '',
  sm: 'btn-sm'
};

export const Button = forwardRef(({
  variant = 'secondary',
  size = 'default',
  icon: Icon,
  iconPosition = 'left',
  children,
  disabled = false,
  type = 'button',
  className = '',
  ariaLabel,
  ...rest
}, ref) => {
  const classes = [
    variantClasses[variant] || variantClasses.secondary,
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled}
      aria-label={ariaLabel}
      {...rest}
    >
      {Icon && iconPosition === 'left' && (
        <Icon size={iconSize} aria-hidden="true" />
      )}
      {children}
      {Icon && iconPosition === 'right' && (
        <Icon size={iconSize} aria-hidden="true" />
      )}
    </button>
  );
});

Button.displayName = 'Button';
