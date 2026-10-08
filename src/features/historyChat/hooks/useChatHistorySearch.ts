import { useState, useEffect } from 'react';

export const useChatHistorySearch = (initialQuery = '', delay = 250) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchTerm);
    }, delay);

    return () => clearTimeout(handler);
  }, [searchTerm, delay]);

  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedQuery('');
  };

  return {
    searchTerm,
    setSearchTerm,
    debouncedQuery,
    clearSearch,
    isSearching: Boolean(searchTerm.trim()),
  };
};
