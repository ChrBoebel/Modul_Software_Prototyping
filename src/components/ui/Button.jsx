export const Button = ({ children, onClick, variant = 'default', className = '' }) => {
  const buttonClass = variant === 'primary' ? 'btn-primary' : 'btn';

  return (
    <button className={`${buttonClass} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};
