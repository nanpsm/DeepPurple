import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Communication, CommunicationSource, Priority } from '../types';
import { EMOTION_COLORS, EMOTION_LABELS, ALL_EMOTIONS } from '../constants';
import EmotionBadge from '../components/EmotionBadge';

const PRIORITY_CONFIG: Record<Priority, { label: string; bg: string; color: string; icon: string }> = {
  LOW:      { label: 'Low Priority',      bg: '#f0fdf4', color: '#16a34a', icon: '🟢' },
  MEDIUM:   { label: 'Medium Priority',   bg: '#fffbeb', color: '#d97706', icon: '🟡' },
  HIGH:     { label: 'High Priority',     bg: '#fff7ed', color: '#ea580c', icon: '🟠' },
  CRITICAL: { label: 'Critical Priority', bg: '#fff1f2', color: '#e11d48', icon: '🔴' },
};

const SOURCES: Array<{ value: CommunicationSource; label: string }> = [
  { value: 'SUPPORT_TICKET', label: 'Customer Support Ticket' },
  { value: 'PRODUCT_REVIEW', label: 'Product Review' },
  { value: 'SOCIAL_MEDIA', label: 'Social Media' },
];


function ResultsPanel({ result, onReset }: { result: Communication; onReset: () => void }) {
  const scores = result.emotionScores;
  const priority = result.priority;
  const pCfg = priority ? PRIORITY_CONFIG[priority] : null;

  // Intensity = primary emotion's score × 100
  const intensity = result.primaryEmotion && scores
    ? Math.round((scores[result.primaryEmotion.toLowerCase() as keyof typeof scores] ?? 0) * 100)
    : null;

  const sentimentLabel = result.sentimentScore == null ? '—'
    : result.sentimentScore > 0.1 ? 'Positive'
    : result.sentimentScore < -0.1 ? 'Negative'
    : 'Neutral';
  const sentimentColor = result.sentimentScore == null ? '#9580c0'
    : result.sentimentScore > 0.1 ? '#16a34a'
    : result.sentimentScore < -0.1 ? '#e11d48'
    : '#d97706';

  return (
    <div className="space-y-4 mt-6">
      {/* 3-column header card */}
      <div style={{ background: '#fff', border: '1.5px solid #ede8fb', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid #f3eeff' }}>
          <p className="font-syne font-extrabold" style={{ fontSize: '13px', color: '#1a0a2e' }}>Analysis Result</p>
          <button onClick={onReset} className="text-sm font-medium" style={{ color: '#7c3aed', background: 'none', border: 'none', cursor: 'pointer' }}>
            Analyse another ↺
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
          {/* Sentiment */}
          <div style={{ padding: '18px', borderRight: '1px solid #f3eeff' }}>
            <p style={{ fontSize: '10px', fontWeight: 600, color: '#9580c0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Sentiment</p>
            <p className="font-syne font-extrabold" style={{ fontSize: '20px', color: sentimentColor, letterSpacing: '-0.3px' }}>{sentimentLabel}</p>
            {result.sentimentScore != null && (
              <p style={{ fontSize: '11px', color: '#c4b5fd', marginTop: '3px' }}>score {result.sentimentScore > 0 ? '+' : ''}{result.sentimentScore.toFixed(2)}</p>
            )}
          </div>
          {/* Emotion */}
          <div style={{ padding: '18px', borderRight: '1px solid #f3eeff' }}>
            <p style={{ fontSize: '10px', fontWeight: 600, color: '#9580c0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Primary Emotion</p>
            {result.primaryEmotion && <EmotionBadge emotion={result.primaryEmotion} />}
            {pCfg && (
              <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '100px', background: pCfg.bg, color: pCfg.color }}>
                {pCfg.icon} {pCfg.label}
              </span>
            )}
          </div>
          {/* Intensity */}
          <div style={{ padding: '18px' }}>
            <p style={{ fontSize: '10px', fontWeight: 600, color: '#9580c0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Intensity</p>
            <p className="font-syne font-extrabold" style={{ fontSize: '20px', color: '#1a0a2e', letterSpacing: '-0.3px' }}>{intensity != null ? `${intensity}%` : '—'}</p>
            {intensity != null && (
              <div style={{ height: '4px', background: '#f3eeff', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${intensity}%`, background: 'linear-gradient(90deg,#7c3aed,#a855f7)', borderRadius: '2px', transition: 'width 0.6s ease' }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
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
        <div className="rounded-lg p-4" style={{ background: '#faf5ff', border: '1px solid #e9d5ff' }}>
          <p className="text-xs font-semibold mb-1.5" style={{ color: '#7c3aed' }}>🤖 AI Explanation</p>
          <p className="text-sm leading-relaxed" style={{ color: '#3b0764' }}>{result.summary}</p>
        </div>
      )}
      </div>
    </div>
  );
}

type CsvRow = { text: string; source: CommunicationSource };

function parseCsvLine(line: string): string[] {
  const cols: string[] = [];
  let cur = '';
  let inQuote = false;
  for (const ch of line) {
    if (ch === '"') inQuote = !inQuote;
    else if (ch === ',' && !inQuote) { cols.push(cur); cur = ''; }
    else cur += ch;
  }
  cols.push(cur);
  return cols.map(s => s.trim().replace(/^"|"$/g, ''));
}

function parseCsv(raw: string, defaultSource: CommunicationSource): CsvRow[] {
  const lines = raw.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  if (!lines.length) return [];
  const first = lines[0].toLowerCase();
  const hasHeader = first.startsWith('text') || first.startsWith('message') || first.startsWith('"text');
  const dataLines = hasHeader ? lines.slice(1) : lines;
  const SOURCE_MAP: Record<string, CommunicationSource> = {
    support_ticket: 'SUPPORT_TICKET', support: 'SUPPORT_TICKET',
    product_review: 'PRODUCT_REVIEW', review: 'PRODUCT_REVIEW',
    social_media: 'SOCIAL_MEDIA', social: 'SOCIAL_MEDIA',
  };
  return dataLines.map(line => {
    const cols = parseCsvLine(line);
    const text = cols[0] ?? '';
    const rawSrc = (cols[1] ?? '').toLowerCase().replace(/\s+/g, '_');
    const source: CommunicationSource = SOURCE_MAP[rawSrc] ?? defaultSource;
    return { text, source };
  }).filter(r => r.text.length >= 10);
}

function CsvUploadTab({ isLoggedIn }: { isLoggedIn: boolean }) {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [defaultSource, setDefaultSource] = useState<CommunicationSource>('SUPPORT_TICKET');
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Communication[]>([]);
  const [done, setDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  function handleFile(file: File) {
    setParseError(null);
    setRows([]);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string ?? '';
      const parsed = parseCsv(text, defaultSource);
      if (!parsed.length) {
        setParseError('No valid rows found. Check that each row has at least 10 characters of text.');
        return;
      }
      setRows(parsed);
    };
    reader.readAsText(file);
  }

  async function handleAnalyse() {
    setLoading(true);
    setParseError(null);
    try {
      const data = await api.submitBulkCommunications(rows);
      setResults(data);
      setDone(true);
    } catch {
      setParseError('Bulk analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setRows([]); setFileName(''); setParseError(null);
    setResults([]); setDone(false); setLoading(false);
  }

  if (done) {
    const emotionCounts = results.reduce<Record<string, number>>((acc, r) => {
      if (r.primaryEmotion) acc[r.primaryEmotion] = (acc[r.primaryEmotion] ?? 0) + 1;
      return acc;
    }, {});
    const topEmotions = Object.entries(emotionCounts).sort(([, a], [, b]) => b - a).slice(0, 3);
    const positiveCount = results.filter(r => (r.sentimentScore ?? 0) >= 0).length;
    const negativeCount = results.length - positiveCount;

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
        <div className="text-center">
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>✅</div>
          <p className="text-lg font-bold text-gray-900">{results.length} of {rows.length} analysed successfully</p>
          {rows.length > results.length && (
            <p className="text-sm text-gray-500 mt-1">{rows.length - results.length} items failed (text too short or Gemini error)</p>
          )}
        </div>
        {topEmotions.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Top emotions detected</p>
            <div className="flex flex-wrap gap-2">
              {topEmotions.map(([emotion, count]) => (
                <span key={emotion} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold" style={{ background: `${(EMOTION_COLORS as Record<string, string>)[emotion] ?? '#a855f7'}22`, color: (EMOTION_COLORS as Record<string, string>)[emotion] ?? '#a855f7' }}>
                  {emotion.charAt(0) + emotion.slice(1).toLowerCase()} · {count}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-3">
          <div className="flex-1 rounded-lg p-3 text-center" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <p className="text-xl font-bold" style={{ color: '#16a34a' }}>{positiveCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">Positive</p>
          </div>
          <div className="flex-1 rounded-lg p-3 text-center" style={{ background: '#fff5f5', border: '1px solid #fecaca' }}>
            <p className="text-xl font-bold" style={{ color: '#dc2626' }}>{negativeCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">Negative</p>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          {isLoggedIn && (
            <button onClick={() => navigate('/history')} className="flex-1 bg-purple-700 text-white py-2.5 rounded-lg font-semibold hover:bg-purple-800 transition-colors text-sm">
              View in history →
            </button>
          )}
          <button onClick={reset} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm">
            Upload another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
      {/* Source picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Default source type</label>
        <div className="flex flex-wrap gap-2">
          {SOURCES.map(s => (
            <button
              key={s.value}
              type="button"
              onClick={() => setDefaultSource(s.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                defaultSource === s.value
                  ? 'bg-purple-700 text-white border-purple-700'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Used when your CSV has no source column. If your CSV has two columns (text, source) the column value takes priority.</p>
      </div>

      {/* Drop zone */}
      {!rows.length && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onClick={() => fileRef.current?.click()}
          style={{ border: `2px dashed ${dragOver ? '#7c3aed' : '#e2d9f5'}`, background: dragOver ? 'rgba(124,58,237,0.04)' : '#fdfaff' }}
          className="rounded-xl p-10 text-center cursor-pointer transition-colors"
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📂</div>
          <p className="text-sm font-semibold text-gray-700">Click to upload or drag & drop a CSV</p>
          <p className="text-xs text-gray-400 mt-1">One row per communication. Columns: <code>text</code> (required), <code>source</code> (optional). Max 100 rows.</p>
          <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      )}

      {parseError && <p className="text-red-500 text-sm">{parseError}</p>}

      {/* Preview table */}
      {rows.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">
              <span className="text-purple-700 font-bold">{rows.length}</span> rows from <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{fileName}</span>
            </p>
            <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">✕ Clear</button>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">#</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Text</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Source</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 5).map((row, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="px-3 py-2 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-3 py-2 text-gray-700 max-w-xs truncate">{row.text}</td>
                    <td className="px-3 py-2">
                      <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">{row.source.replace(/_/g, ' ')}</span>
                    </td>
                  </tr>
                ))}
                {rows.length > 5 && (
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-xs text-gray-400 text-center">…and {rows.length - 5} more rows</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <button
            onClick={handleAnalyse}
            disabled={loading}
            className="w-full mt-4 bg-purple-700 text-white py-2.5 rounded-lg font-semibold hover:bg-purple-800 disabled:opacity-50 transition-colors"
          >
            {loading ? `Analysing ${rows.length} items, please wait…` : `Analyse ${rows.length} items ✨`}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Submit() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'single' | 'csv'>('single');
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
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Analyse Text</h1>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-5 w-fit">
        {(['single', 'csv'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              tab === t ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'single' ? '✍️ Single text' : '📂 CSV batch'}
          </button>
        ))}
      </div>

      {tab === 'csv' && <CsvUploadTab isLoggedIn={!!user} />}

      {tab === 'single' && (
        !result ? (
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
        )
      )}
    </div>
  );
}
