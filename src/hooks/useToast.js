import { useState, useCallback, useRef } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState({ show: false, message: '' });
  const timerRef = useRef(null);

  const showToast = useCallback((message) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ show: true, message });
    timerRef.current = setTimeout(() => {
      setToast({ show: false, message: '' });
      timerRef.current = null;
    }, 2000);
  }, []);

  return { toast, showToast };
};
