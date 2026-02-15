import { useCallback, useEffect, useRef, useState } from 'react';

const safeParseJson = (value) => {
  if (value === null || value === undefined) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const useLocalStorage = (key, defaultValue) => {
  const defaultValueRef = useRef(defaultValue);

  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    const stored = safeParseJson(window.localStorage.getItem(key));
    return stored === null ? defaultValue : stored;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Storage full or unavailable
    }
  }, [key, state]);

  const reset = useCallback(() => setState(defaultValueRef.current), []);

  return [state, setState, { reset }];
};
