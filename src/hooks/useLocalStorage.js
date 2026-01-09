import { useEffect, useMemo, useState } from 'react';

const safeParseJson = (value) => {
  if (value === null || value === undefined) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const useLocalStorage = (key, defaultValue) => {
  const defaultValueMemo = useMemo(() => defaultValue, [defaultValue]);

  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return defaultValueMemo;
    const stored = safeParseJson(window.localStorage.getItem(key));
    return stored === null ? defaultValueMemo : stored;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  const reset = () => setState(defaultValueMemo);

  return [state, setState, { reset }];
};

