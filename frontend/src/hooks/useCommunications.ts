import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Communication, CommunicationSource, PageResponse } from '../types';

interface Filters {
  source?: CommunicationSource | '';
  emotion?: string;
  page?: number;
}

export function useCommunications(filters: Filters = {}) {
  const [data, setData] = useState<PageResponse<Communication> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .listCommunications(filters)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.source, filters.emotion, filters.page]);

  return { data, loading, error };
}
