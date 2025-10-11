export const Button = ({ children, onClick, variant = 'default', className = '', icon: Icon }) => {
  const buttonClass = variant === 'primary' ? 'btn-primary' : 'btn';

  return (
    <button className={`${buttonClass} ${className}`} onClick={onClick}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};
