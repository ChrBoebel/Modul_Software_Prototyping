export const Toast = ({ show, message }) => {
  return (
    <div className={`toast ${show ? 'show' : ''}`}>
      {message}
    </div>
  );
};
