export const Toast = ({ show, message }) => {
  return (
    <div
      className={`toast ${show ? 'show' : ''}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {message}
    </div>
  );
};
