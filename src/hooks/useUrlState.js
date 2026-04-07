import { useState, useEffect, useCallback } from 'react';

function read() {
  return new URLSearchParams(window.location.search);
}

function push(cat, q) {
  const p = new URLSearchParams();
  if (cat) p.set('cat', cat);
  if (q) p.set('q', q);
  const search = p.toString();
  window.history.pushState({}, '', search ? `?${search}` : window.location.pathname);
}

export function useUrlState() {
  const [category, _setCategory] = useState(() => read().get('cat') || null);
  const [query, _setQuery] = useState(() => read().get('q') || '');

  useEffect(() => {
    const handler = () => {
      const p = read();
      _setCategory(p.get('cat') || null);
      _setQuery(p.get('q') || '');
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const setCategory = useCallback((cat) => {
    _setCategory(cat);
    // Read current query at call time to avoid stale closure
    const currentQuery = read().get('q') || '';
    push(cat, currentQuery);
  }, []);

  const setQuery = useCallback((q) => {
    _setQuery(q);
    const currentCat = read().get('cat') || null;
    push(currentCat, q);
  }, []);

  return { category, query, setCategory, setQuery };
}
