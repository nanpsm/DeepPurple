import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCommunications } from '../hooks/useCommunications';
import type { CommunicationSource, Emotion } from '../types';
import BottomDock from '../components/BottomDock';

const EMOTION_COLORS: Record<string, string> = {
  JOY: '#f59e0b', ANGER: '#ef4444', FEAR: '#8b5cf6',
  SADNESS: '#3b82f6', SURPRISE: '#06b6d4', DISGUST: '#22c55e', TRUST: '#10b981',
};

const EMOTION_EMOJI: Record<string, string> = {
  JOY: '😊', ANGER: '😠', FEAR: '😨',
  SADNESS: '😢', SURPRISE: '🤩', DISGUST: '🤢', TRUST: '🤝',
};

const SOURCE_LABEL: Record<string, string> = {
  SUPPORT_TICKET: 'Support', PRODUCT_REVIEW: 'Review', SOCIAL_MEDIA: 'Social',
};

const SOURCES: Array<{ value: CommunicationSource | ''; label: string }> = [
  { value: '', label: 'All sources' },
  { value: 'SUPPORT_TICKET', label: 'Support ticket' },
  { value: 'PRODUCT_REVIEW', label: 'Product review' },
  { value: 'SOCIAL_MEDIA', label: 'Social media' },
];

const EMOTIONS: Array<{ value: Emotion | ''; label: string }> = [
  { value: '', label: 'All emotions' },
  ...(['JOY', 'ANGER', 'FEAR', 'SADNESS', 'SURPRISE', 'DISGUST', 'TRUST'] as Emotion[]).map(e => ({
    value: e,
    label: EMOTION_EMOJI[e] + ' ' + e.charAt(0) + e.slice(1).toLowerCase(),
  })),
];

function formatRelative(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffH < 1) return 'Just now';
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD < 7) return `${diffD}d ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function CommunicationsList() {
  const [source, setSource] = useState<CommunicationSource | ''>('');
  const [emotion, setEmotion] = useState<Emotion | ''>('');
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const { data, loading } = useCommunications({ source, emotion, page });

  const filtered = data?.content.filter(c =>
    !search || c.text.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 className="font-syne font-extrabold" style={{ fontSize: '26px', color: '#1a0a2e', letterSpacing: '-0.4px', marginBottom: '4px' }}>
          Analysis history
        </h1>
        <p style={{ fontSize: '14px', color: '#9580c0' }}>All your past emotion analyses</p>
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: '14px' }}>
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', pointerEvents: 'none' }}>🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search analyses…"
          style={{ width: '100%', background: '#fff', border: '1.5px solid #ede8fb', borderRadius: '12px', padding: '10px 14px 10px 38px', fontSize: '14px', color: '#1a0a2e', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" }}
          onFocus={e => (e.target.style.borderColor = '#a855f7')}
          onBlur={e => (e.target.style.borderColor = '#ede8fb')}
        />
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {SOURCES.map(s => (
          <button
            key={s.value}
            onClick={() => { setSource(s.value); setPage(0); }}
            style={{
              background: source === s.value ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#fff',
              color: source === s.value ? '#fff' : '#7a6a96',
              border: source === s.value ? 'none' : '1.5px solid #ede8fb',
              borderRadius: '100px', padding: '7px 14px', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            }}
          >
            {s.label}
          </button>
        ))}
        <div style={{ width: '1px', background: '#ede8fb', margin: '0 4px' }} />
        {EMOTIONS.map(e => (
          <button
            key={e.value}
            onClick={() => { setEmotion(e.value); setPage(0); }}
            style={{
              background: emotion === e.value ? `${EMOTION_COLORS[e.value] ?? '#a855f7'}22` : '#fff',
              color: emotion === e.value ? (EMOTION_COLORS[e.value] ?? '#7c3aed') : '#7a6a96',
              border: emotion === e.value ? `1.5px solid ${EMOTION_COLORS[e.value] ?? '#a855f7'}` : '1.5px solid #ede8fb',
              borderRadius: '100px', padding: '7px 14px', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            }}
          >
            {e.label}
          </button>
        ))}
      </div>

      {/* Entry list */}
      {loading ? (
        <div style={{ background: '#fff', border: '1.5px solid #ede8fb', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#c4b5fd', fontSize: '14px' }}>
          Loading analyses…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1.5px solid #ede8fb', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</div>
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#1a0a2e', marginBottom: '4px' }}>No analyses found</p>
          <p style={{ fontSize: '13px', color: '#9580c0' }}>Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(comm => {
            const emo = comm.primaryEmotion as string | undefined;
            const color = emo ? (EMOTION_COLORS[emo] ?? '#a855f7') : '#a855f7';
            const emoji = emo ? (EMOTION_EMOJI[emo] ?? '🎭') : '🎭';
            return (
              <Link
                key={comm.id}
                to={`/history/${comm.id}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div
                  style={{ background: '#fff', border: '1.5px solid #ede8fb', borderRadius: '16px', padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: '14px', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#c4b5fd'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(124,58,237,0.08)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#ede8fb'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                >
                  {/* Emotion icon */}
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                    {emoji}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', color: '#1a0a2e', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.5, margin: 0 }}>
                      {comm.text}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                      {emo && (
                        <span style={{ fontSize: '11px', fontWeight: 700, color, background: `${color}18`, borderRadius: '100px', padding: '2px 10px', textTransform: 'capitalize' }}>
                          {emo.charAt(0) + emo.slice(1).toLowerCase()}
                        </span>
                      )}
                      {comm.source && (
                        <span style={{ fontSize: '11px', color: '#9580c0', fontWeight: 500 }}>
                          {SOURCE_LABEL[comm.source] ?? comm.source}
                        </span>
                      )}
                      <span style={{ fontSize: '11px', color: '#c4b5fd' }}>
                        {formatRelative(comm.createdAt)}
                      </span>
                    </div>
                  </div>

                  <span style={{ fontSize: '16px', color: '#c4b5fd', flexShrink: 0, alignSelf: 'center' }}>›</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            style={{ background: '#fff', border: '1.5px solid #ede8fb', borderRadius: '100px', padding: '8px 20px', fontSize: '13px', fontWeight: 600, color: '#7c3aed', cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.4 : 1, fontFamily: "'Inter', sans-serif" }}
          >
            ← Prev
          </button>
          <span style={{ fontSize: '13px', color: '#9580c0' }}>
            {page + 1} / {data.totalPages}
          </span>
          <button
            disabled={page >= data.totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', border: 'none', borderRadius: '100px', padding: '8px 20px', fontSize: '13px', fontWeight: 600, color: '#fff', cursor: page >= data.totalPages - 1 ? 'not-allowed' : 'pointer', opacity: page >= data.totalPages - 1 ? 0.4 : 1, fontFamily: "'Inter', sans-serif" }}
          >
            Load more →
          </button>
        </div>
      )}

      <BottomDock />
    </div>
  );
}
