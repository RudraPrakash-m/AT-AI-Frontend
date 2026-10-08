import { useState, useCallback } from 'react';

export const useChatInput = (initialText = '') => {
  const [value, setValue] = useState(initialText);

  const reset = useCallback(() => {
    setValue('');
  }, []);

  return {
    value,
    setValue,
    reset,
  };
};
