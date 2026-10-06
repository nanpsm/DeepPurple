import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Communication, CommunicationSource } from '../types';
import { EMOTION_COLORS, EMOTION_LABELS, ALL_EMOTIONS } from '../constants';
import EmotionBadge from '../components/EmotionBadge';

const SOURCES: Array<{ value: CommunicationSource; label: string }> = [
  { value: 'SUPPORT_TICKET', label: 'Customer Support Ticket' },
  { value: 'PRODUCT_REVIEW', label: 'Product Review' },
  { value: 'SOCIAL_MEDIA', label: 'Social Media' },
];

function SentimentBar({ score }: { score: number }) {
  const pct = Math.round(Math.abs(score) * 100);
  const positive = score >= 0;
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Negative</span>
        <span className="font-medium text-gray-700">
          {positive ? '+' : ''}{score.toFixed(2)}
        </span>
        <span>Positive</span>
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-px h-full bg-gray-300" />
        </div>
        <div
          className="absolute top-0 h-full rounded-full"
          style={{
            width: `${pct / 2}%`,
            left: positive ? '50%' : `${50 - pct / 2}%`,
            backgroundColor: positive ? '#10b981' : '#ef4444',
          }}
        />
      </div>
    </div>
  );
}

function ResultsPanel({ result, onReset }: { result: Communication; onReset: () => void }) {
  const scores = result.emotionScores;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5 mt-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Primary Emotion</p>
          {result.primaryEmotion && <EmotionBadge emotion={result.primaryEmotion} />}
        </div>
        <button
          onClick={onReset}
          className="text-sm text-purple-700 hover:text-purple-900 font-medium shrink-0"
        >
          Analyse another ↺
        </button>
      </div>

      {result.sentimentScore != null && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Sentiment</p>
          <SentimentBar score={result.sentimentScore} />
        </div>
      )}

      {scores && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Emotion Breakdown</p>
          <div className="space-y-2">
            {ALL_EMOTIONS.map(emotion => {
              const key = emotion.toLowerCase() as keyof typeof scores;
              const value = scores[key] ?? 0;
              const pct = Math.round(value * 100);
              const color = EMOTION_COLORS[emotion];
              return (
                <div key={emotion} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-16 shrink-0">{EMOTION_LABELS[emotion]}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-9 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {result.topics && result.topics.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Topics</p>
          <div className="flex flex-wrap gap-2">
            {result.topics.map(t => (
              <span
                key={t}
                className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.summary && (
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Summary</p>
          <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>
        </div>
      )}
    </div>
  );
}

export default function Submit() {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [source, setSource] = useState<CommunicationSource>('SUPPORT_TICKET');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Communication | null>(null);

  function reset() {
    setResult(null);
    setText('');
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length < 10) {
      setError('Text must be at least 10 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await api.submitCommunication(text, source);
      setResult(data);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(msg ?? 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analyse Text</h1>

      {!result ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Source Type</label>
            <div className="flex flex-wrap gap-2">
              {SOURCES.map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSource(s.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    source === s.value
                      ? 'bg-purple-700 text-white border-purple-700'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text{' '}
              <span className="text-gray-400 font-normal">(10–10,000 chars)</span>
            </label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={8}
              maxLength={10000}
              placeholder="Paste the customer communication here…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-y"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{text.length.toLocaleString()} / 10,000</p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-700 text-white py-2.5 rounded-lg font-semibold hover:bg-purple-800 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Analysing…' : 'Analyse Emotions'}
          </button>
        </form>
      ) : (
        <>
          <ResultsPanel result={result} onReset={reset} />
          {!user && (
            <p className="mt-4 text-sm text-gray-500 text-center">
              <Link to="/signup" className="text-purple-700 font-medium hover:underline">Create a free account</Link>
              {' '}to save your history and access the dashboard.
            </p>
          )}
        </>
      )}
    </div>
  );
}
