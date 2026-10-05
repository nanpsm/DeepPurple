import { useState } from 'react';
import { Link } from 'react-router-dom';
import EmotionBadge from '../components/EmotionBadge';
import { useCommunications } from '../hooks/useCommunications';
import type { CommunicationSource, Emotion } from '../types';

const SOURCES: Array<{ value: CommunicationSource | ''; label: string }> = [
  { value: '', label: 'All Sources' },
  { value: 'SUPPORT_TICKET', label: 'Support Ticket' },
  { value: 'PRODUCT_REVIEW', label: 'Product Review' },
  { value: 'SOCIAL_MEDIA', label: 'Social Media' },
];

const EMOTIONS: Array<{ value: Emotion | ''; label: string }> = [
  { value: '', label: 'All Emotions' },
  ...(['JOY', 'ANGER', 'FEAR', 'SADNESS', 'SURPRISE', 'DISGUST', 'TRUST'] as Emotion[]).map(e => ({
    value: e,
    label: e.charAt(0) + e.slice(1).toLowerCase(),
  })),
];

export default function CommunicationsList() {
  const [source, setSource] = useState<CommunicationSource | ''>('');
  const [emotion, setEmotion] = useState<Emotion | ''>('');
  const [page, setPage] = useState(0);

  const { data, loading } = useCommunications({ source, emotion, page });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Communications</h1>

      <div className="flex flex-wrap gap-3">
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          value={source}
          onChange={e => { setSource(e.target.value as CommunicationSource | ''); setPage(0); }}
        >
          {SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          value={emotion}
          onChange={e => { setEmotion(e.target.value as Emotion | ''); setPage(0); }}
        >
          {EMOTIONS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 shadow-sm">
            {data?.content.map(comm => (
              <Link
                key={comm.id}
                to={`/communications/${comm.id}`}
                className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 truncate">{comm.text}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(comm.createdAt).toLocaleString()} · {comm.source.replace(/_/g, ' ')}
                  </p>
                </div>
                {comm.primaryEmotion && (
                  <EmotionBadge emotion={comm.primaryEmotion} size="sm" />
                )}
              </Link>
            ))}
            {!data?.content.length && (
              <p className="p-8 text-center text-gray-400">No communications found.</p>
            )}
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex justify-center items-center gap-3">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {page + 1} / {data.totalPages}
              </span>
              <button
                disabled={page >= data.totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
