export const Button = ({ children, onClick, variant = 'default', className = '', icon: Icon, ...props }) => {
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
      // Maintain existing behavior for 'default' or unspecified variants
      // If the style guide implies 'default' should be secondary, we can map it, 
      // but safe bet is to keep it as the base 'btn' which usually has some styling.
      // In the new CSS, .btn has base styles but no color. 
      // We might need a 'btn-default' or just use 'btn' if it has enough styling.
      // Previous 'btn' had transparent bg.
      buttonClass = 'btn'; 
  }

  return (
    <button className={`${buttonClass} ${className}`} onClick={onClick} {...props}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};
