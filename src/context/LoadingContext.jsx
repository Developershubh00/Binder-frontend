import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  const showLoading = useCallback(() => {
    countRef.current += 1;
    setCount(countRef.current);
  }, []);

  const hideLoading = useCallback(() => {
    countRef.current = Math.max(0, countRef.current - 1);
    setCount(countRef.current);
  }, []);

  const withLoading = useCallback(async (promiseOrFn) => {
    showLoading();
    try {
      return typeof promiseOrFn === 'function' ? await promiseOrFn() : await promiseOrFn;
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  const value = useMemo(
    () => ({ isLoading: count > 0, showLoading, hideLoading, withLoading }),
    [count, showLoading, hideLoading, withLoading]
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export const useLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    return {
      isLoading: false,
      showLoading: () => {},
      hideLoading: () => {},
      withLoading: async (p) => (typeof p === 'function' ? p() : p),
    };
  }
  return ctx;
};

export default LoadingContext;
