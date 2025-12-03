export const Button = ({ children, onClick, variant = 'secondary', className = '', icon: Icon, ...props }) => {
  let buttonClass = 'btn';

  switch (variant) {
    case 'primary':
      buttonClass = 'btn btn-primary';
      break;
    case 'secondary':
      buttonClass = 'btn btn-secondary';
      break;
    case 'link':
      buttonClass = 'btn-link';
      break;
    default:
      // Default to secondary style (outlined) as it seems to be the standard "Button" in the guide
      // unless explicitly primary.
      buttonClass = 'btn btn-secondary'; 
  }

  return (
    <button className={`${buttonClass} ${className}`} onClick={onClick} {...props}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};
