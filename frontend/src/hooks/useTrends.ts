import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { TrendEntry } from '../types';

export function useTrends(from?: string, to?: string) {
  const [trends, setTrends] = useState<TrendEntry[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.getTrends(from, to), api.getSummary()])
      .then(([t, s]) => {
        setTrends(t);
        setSummary(s);
      })
      .finally(() => setLoading(false));
  }, [from, to]);

  return { trends, summary, loading };
}
