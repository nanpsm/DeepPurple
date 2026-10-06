import axios from 'axios';
import { supabase } from '../lib/supabase';
import type { Communication, CommunicationSource, PageResponse, TrendEntry } from '../types';

const client = axios.create({ baseURL: '/api' });

client.interceptors.request.use(async config => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export const api = {
  submitCommunication: (text: string, source: CommunicationSource) =>
    client.post<Communication>('/communications', { text, source }).then(r => r.data),

  listCommunications: (params: {
    source?: CommunicationSource | '';
    emotion?: string;
    from?: string;
    to?: string;
    page?: number;
    size?: number;
  }) => {
    const clean = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    );
    return client.get<PageResponse<Communication>>('/communications', { params: clean }).then(r => r.data);
  },

  getCommunication: (id: string) =>
    client.get<Communication>(`/communications/${id}`).then(r => r.data),

  getTrends: (from?: string, to?: string) =>
    client.get<TrendEntry[]>('/analytics/trends', { params: { from, to } }).then(r => r.data),

  getSummary: () =>
    client.get<Record<string, number>>('/analytics/summary').then(r => r.data),
};
