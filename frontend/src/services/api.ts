import axios from 'axios';
import { supabase } from '../lib/supabase';
import type { Communication, CommunicationSource, PageResponse, TrendEntry, TopicEmotionData } from '../types';

export interface CompareResult { periodA: TrendEntry[]; periodB: TrendEntry[]; }

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

  getAvgSentiment: () =>
    client.get<number>('/analytics/avg-sentiment').then(r => r.data),

  getTopicEmotions: () =>
    client.get<TopicEmotionData>('/analytics/topic-emotions').then(r => r.data),

  submitBulkCommunications: (items: Array<{ text: string; source: CommunicationSource }>) =>
    client.post<Communication[]>('/communications/bulk', items).then(r => r.data),

  getAlerts: () =>
    client.get<Communication[]>('/analytics/alerts').then(r => r.data),

  comparePeriods: (from1: string, to1: string, from2: string, to2: string) =>
    client.get<CompareResult>('/analytics/compare', { params: { from1, to1, from2, to2 } }).then(r => r.data),
};
