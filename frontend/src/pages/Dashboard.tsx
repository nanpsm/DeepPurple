import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTrends } from '../hooks/useTrends';
import { api } from '../services/api';
import type { Communication, TrendEntry, TopicEmotionData } from '../types';

const PRIORITY_COLOR: Record<string, string> = {
  LOW: '#16a34a', MEDIUM: '#d97706', HIGH: '#ea580c', CRITICAL: '#e11d48',
};

const EMOTION_COLORS: Record<string, string> = {
  joy: '#f59e0b', anger: '#ef4444', fear: '#8b5cf6',
  sadness: '#3b82f6', surprise: '#06b6d4', disgust: '#22c55e', trust: '#10b981',
};

const EMOTION_EMOJI: Record<string, string> = {
  joy: '😊', anger: '😠', fear: '😨',
  sadness: '😢', surprise: '🤩', disgust: '🤢', trust: '🤝',
};

function DonutChart({ data }: { data: Record<string, number> }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  if (total === 0) return <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c4b5fd', fontSize: '13px' }}>No data yet</div>;

  const emotions = Object.entries(data).filter(([, v]) => v > 0);
  const r = 52, cx = 70, cy = 70, stroke = 16;
  const circ = 2 * Math.PI * r;

  let offset = 0;
  const slices = emotions.map(([key, val]) => {
    const pct = val / total;
    const s = { key, pct, offset, color: EMOTION_COLORS[key.toLowerCase()] ?? '#a855f7' };
    offset += pct;
    return s;
  });

  const dominant = emotions.sort((a, b) => b[1] - a[1])[0];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        {slices.map(s => (
          <circle
            key={s.key}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={`${s.pct * circ} ${circ}`}
            strokeDashoffset={-s.offset * circ}
            transform="rotate(-90 70 70)"
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" style={{ fontSize: '11px', fill: '#9580c0', fontFamily: "'Inter', sans-serif" }}>top</text>
        <text x={cx} y={cy + 10} textAnchor="middle" style={{ fontSize: '14px', fontWeight: 700, fill: '#1a0a2e', fontFamily: "'Inter', sans-serif", textTransform: 'capitalize' }}>
          {dominant?.[0] ?? '—'}
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {emotions.slice(0, 5).map(([key, val]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: EMOTION_COLORS[key.toLowerCase()] ?? '#a855f7', flexShrink: 0 }} />
            <span style={{ fontSize: '12px', color: '#1a0a2e', textTransform: 'capitalize', minWidth: '64px' }}>{key}</span>
            <span style={{ fontSize: '12px', color: '#9580c0' }}>{Math.round(val / total * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StackedBarChart({ trends }: { trends: TrendEntry[] }) {
  const recent7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const byDate: Record<string, Record<string, number>> = {};
  recent7.forEach(d => { byDate[d] = {}; });
  trends.forEach(t => {
    if (byDate[t.date] !== undefined) {
      Object.entries(t.emotionCounts).forEach(([e, cnt]) => {
        byDate[t.date][e] = (byDate[t.date][e] ?? 0) + (cnt ?? 0);
      });
    }
  });

  const maxTotal = Math.max(...recent7.map(d =>
    Object.values(byDate[d]).reduce((a, b) => a + b, 0)
  ), 1);
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
      {recent7.map((d, i) => {
        const counts = byDate[d];
        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        const barH = total > 0 ? Math.max((total / maxTotal) * 68, 6) : 3;
        const isToday = i === 6;
        const segments = Object.entries(counts).filter(([, v]) => v > 0).sort(([a], [b]) => a.localeCompare(b));
        return (
          <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div title={`${d}: ${total}`} style={{ width: '100%', height: `${barH}px`, borderRadius: '6px 6px 3px 3px', overflow: 'hidden', background: total === 0 ? '#f5f3ff' : undefined, display: 'flex', flexDirection: 'column' }}>
              {total === 0 ? null : segments.map(([emotion, count]) => (
                <div key={emotion} style={{ width: '100%', height: `${(count / total) * barH}px`, background: EMOTION_COLORS[emotion.toLowerCase()] ?? '#a855f7', flexShrink: 0 }} />
              ))}
            </div>
            <span style={{ fontSize: '10px', color: isToday ? '#7c3aed' : '#c4b5fd', fontWeight: isToday ? 700 : 400 }}>
              {days[new Date(d + 'T12:00:00').getDay()]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { trends, summary, loading } = useTrends();
  const [avgSentimentVal, setAvgSentimentVal] = useState<number | null>(null);
  const [topicEmotions, setTopicEmotions] = useState<TopicEmotionData>({});
  const [alerts, setAlerts] = useState<Communication[]>([]);

  // Compare periods state — default: period A = last 7 days, period B = 7 days before that
  const today = new Date().toISOString().slice(0, 10);
  const minus7 = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const minus14 = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10);
  const [compareA, setCompareA] = useState({ from: minus7, to: today });
  const [compareB, setCompareB] = useState({ from: minus14, to: minus7 });
  const [compareData, setCompareData] = useState<{ periodA: TrendEntry[]; periodB: TrendEntry[] } | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);

  useEffect(() => {
    api.getAvgSentiment().then(v => setAvgSentimentVal(v)).catch(() => {});
    api.getTopicEmotions().then(v => setTopicEmotions(v)).catch(() => {});
    api.getAlerts().then(v => setAlerts(v)).catch(() => {});
  }, []);

  function runCompare() {
    setCompareLoading(true);
    api.comparePeriods(
      compareA.from + 'T00:00:00', compareA.to + 'T23:59:59',
      compareB.from + 'T00:00:00', compareB.to + 'T23:59:59',
    ).then(d => { setCompareData(d); setCompareLoading(false); })
     .catch(() => setCompareLoading(false));
  }

  function periodSummary(entries: TrendEntry[]) {
    const total = entries.reduce((s, e) => s + Object.values(e.emotionCounts).reduce((a: number, b) => a + (b ?? 0), 0), 0);
    const combined: Record<string, number> = {};
    entries.forEach(e => Object.entries(e.emotionCounts).forEach(([k, v]) => { combined[k] = (combined[k] ?? 0) + (v ?? 0); }));
    const dominant = Object.entries(combined).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
    return { total, dominant };
  }

  const total = Object.values(summary).reduce((a, b) => a + b, 0);
  const dominantEntry = Object.entries(summary).sort((a, b) => b[1] - a[1])[0];
  const dominant = dominantEntry?.[0] ?? '—';
  const avgSentimentDisplay = avgSentimentVal === null
    ? (loading ? '…' : '—')
    : (avgSentimentVal >= 0 ? '+' : '') + avgSentimentVal.toFixed(2);

  // Polarity buckets
  const positive = (summary['joy'] ?? 0) + (summary['trust'] ?? 0);
  const neutral = (summary['surprise'] ?? 0);
  const negative = (summary['anger'] ?? 0) + (summary['fear'] ?? 0) + (summary['sadness'] ?? 0) + (summary['disgust'] ?? 0);
  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.email?.split('@')[0] ?? 'there';

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: '20px' }}>
        <h1 className="font-syne font-extrabold" style={{ fontSize: '26px', color: '#1a0a2e', letterSpacing: '-0.5px' }}>
          {greeting}, {firstName} 👋
        </h1>
        <p style={{ fontSize: '13px', color: '#9580c0', marginTop: '3px' }}>Here's your customer communication overview</p>
      </div>

      {/* Hero overview card */}
      <div style={{ background: '#fff', border: '1.5px solid #ede8fb', borderRadius: '20px', padding: '22px 24px', marginBottom: '16px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#9580c0', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
          Customer Communication Overview
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <p className="font-syne font-extrabold" style={{ fontSize: '42px', color: '#1a0a2e', letterSpacing: '-1px', lineHeight: 1 }}>
              {loading ? '…' : total.toLocaleString()}
            </p>
            <p style={{ fontSize: '12px', color: '#9580c0', marginTop: '4px' }}>Total communications analysed</p>
          </div>
          {!loading && total > 0 && (
            <div style={{ display: 'flex', gap: '10px', paddingBottom: '4px', flexWrap: 'wrap' }}>
              {[
                { label: 'Positive', value: pct(positive), color: '#16a34a', bg: '#f0fdf4', bar: '#bbf7d0' },
                { label: 'Neutral',  value: pct(neutral),  color: '#d97706', bg: '#fffbeb', bar: '#fde68a' },
                { label: 'Negative', value: pct(negative), color: '#e11d48', bg: '#fff1f2', bar: '#fecdd3' },
              ].map(({ label, value, color, bg, bar }) => (
                <div key={label} style={{ background: bg, borderRadius: '12px', padding: '10px 14px', minWidth: '90px' }}>
                  <p className="font-syne font-extrabold" style={{ fontSize: '22px', color, lineHeight: 1 }}>{value}%</p>
                  <p style={{ fontSize: '11px', fontWeight: 600, color, opacity: 0.75, marginTop: '2px' }}>{label}</p>
                  <div style={{ height: '3px', background: bar, borderRadius: '2px', marginTop: '6px' }}>
                    <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Secondary stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '16px' }}>
        {[
          { label: 'Dominant emotion', value: loading ? '…' : (EMOTION_EMOJI[dominant.toLowerCase()] ?? '🎭') + ' ' + (dominant.charAt(0) + dominant.slice(1).toLowerCase()), sub: 'most frequent' },
          { label: 'Avg sentiment',    value: loading ? '…' : avgSentimentDisplay, sub: 'all time' },
          { label: 'Emotions tracked', value: '7', sub: 'categories' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1.5px solid #ede8fb', borderRadius: '14px', padding: '14px 16px' }}>
            <p style={{ fontSize: '10px', fontWeight: 600, color: '#9580c0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>{s.label}</p>
            <p className="font-syne font-extrabold" style={{ fontSize: '18px', color: '#1a0a2e', letterSpacing: '-0.3px' }}>{s.value}</p>
            <p style={{ fontSize: '10px', color: '#c4b5fd', marginTop: '1px' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
        <div style={{ background: '#fff', border: '1.5px solid #ede8fb', borderRadius: '16px', padding: '20px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#1a0a2e', marginBottom: '14px' }}>Emotion distribution</p>
          {loading ? <div style={{ height: '100px', display: 'flex', alignItems: 'center', color: '#c4b5fd', fontSize: '13px' }}>Loading…</div> : <DonutChart data={summary} />}
        </div>
        <div style={{ background: '#fff', border: '1.5px solid #ede8fb', borderRadius: '16px', padding: '20px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#1a0a2e', marginBottom: '14px' }}>Last 7 days</p>
          {loading ? <div style={{ height: '80px', display: 'flex', alignItems: 'center', color: '#c4b5fd', fontSize: '13px' }}>Loading…</div> : <StackedBarChart trends={trends} />}
        </div>
      </div>

      {/* Topic × Emotion section */}
      {Object.keys(topicEmotions).length > 0 && (
        <div style={{ background: '#fff', border: '1.5px solid #ede8fb', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#1a0a2e', marginBottom: '16px' }}>Topic × Emotion breakdown</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(topicEmotions).slice(0, 6).map(([topic, emotionMap]) => {
              const topicTotal = Object.values(emotionMap).reduce((a, b) => a + b, 0);
              const segments = Object.entries(emotionMap).sort(([, a], [, b]) => b - a);
              return (
                <div key={topic} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#1a0a2e', width: '90px', flexShrink: 0, textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{topic}</span>
                  <div style={{ flex: 1, height: '10px', borderRadius: '100px', overflow: 'hidden', background: '#f5f3ff', display: 'flex' }}>
                    {segments.map(([emotion, count]) => (
                      <div
                        key={emotion}
                        title={`${emotion}: ${count}`}
                        style={{ height: '100%', width: `${(count / topicTotal) * 100}%`, background: EMOTION_COLORS[emotion.toLowerCase()] ?? '#a855f7', flexShrink: 0 }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '11px', color: '#9580c0', width: '28px', textAlign: 'right', flexShrink: 0 }}>{topicTotal}</span>
                </div>
              );
            })}
          </div>
          {/* Emotion legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '14px' }}>
            {Object.entries(EMOTION_COLORS).map(([e, color]) => (
              <div key={e} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: '11px', color: '#9580c0', textTransform: 'capitalize' }}>{e}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts section */}
      {alerts.length > 0 && (
        <div style={{ background: '#fff1f2', border: '1.5px solid #fecdd3', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '16px' }}>🚨</span>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#e11d48' }}>Emotion Alerts</p>
            <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 600, background: '#e11d48', color: '#fff', borderRadius: '100px', padding: '2px 8px' }}>{alerts.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {alerts.slice(0, 5).map(a => {
              const pColor = a.priority ? PRIORITY_COLOR[a.priority] : '#e11d48';
              return (
                <div key={a.id} style={{ background: '#fff', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: pColor, flexShrink: 0, marginTop: '4px' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '12px', color: '#1a0a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.text}</p>
                    {a.summary && <p style={{ fontSize: '11px', color: '#9580c0', marginTop: '2px' }}>{a.summary}</p>}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: pColor, flexShrink: 0 }}>{a.priority}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Compare Periods section */}
      <div style={{ background: '#fff', border: '1.5px solid #ede8fb', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
        <p style={{ fontSize: '13px', fontWeight: 700, color: '#1a0a2e', marginBottom: '14px' }}>Compare Periods</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          {(['A', 'B'] as const).map(period => {
            const cfg = period === 'A' ? compareA : compareB;
            const set = period === 'A' ? setCompareA : setCompareB;
            return (
              <div key={period} style={{ background: '#f8f5ff', borderRadius: '10px', padding: '12px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#7c3aed', marginBottom: '8px' }}>Period {period}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <input type="date" value={cfg.from} max={cfg.to}
                    onChange={e => set(p => ({ ...p, from: e.target.value }))}
                    style={{ fontSize: '12px', border: '1px solid #ddd6fe', borderRadius: '6px', padding: '4px 8px', background: '#fff', color: '#1a0a2e' }} />
                  <input type="date" value={cfg.to} min={cfg.from}
                    onChange={e => set(p => ({ ...p, to: e.target.value }))}
                    style={{ fontSize: '12px', border: '1px solid #ddd6fe', borderRadius: '6px', padding: '4px 8px', background: '#fff', color: '#1a0a2e' }} />
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={runCompare} disabled={compareLoading}
          style={{ width: '100%', padding: '9px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', opacity: compareLoading ? 0.7 : 1 }}>
          {compareLoading ? 'Loading…' : 'Compare →'}
        </button>
        {compareData && (() => {
          const a = periodSummary(compareData.periodA);
          const b = periodSummary(compareData.periodB);
          const delta = a.total - b.total;
          return (
            <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {([['A', a, compareA] as const, ['B', b, compareB] as const]).map(([lbl, s, cfg]) => (
                <div key={lbl} style={{ background: '#f8f5ff', borderRadius: '10px', padding: '12px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#7c3aed', marginBottom: '6px' }}>
                    Period {lbl} · {cfg.from} → {cfg.to}
                  </p>
                  <p className="font-syne font-extrabold" style={{ fontSize: '24px', color: '#1a0a2e' }}>{s.total}</p>
                  <p style={{ fontSize: '11px', color: '#9580c0', marginTop: '2px', textTransform: 'capitalize' }}>dominant: {s.dominant}</p>
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', fontSize: '12px', color: delta > 0 ? '#16a34a' : delta < 0 ? '#e11d48' : '#9580c0', fontWeight: 600 }}>
                {delta > 0 ? `▲ +${delta} more communications in Period A` : delta < 0 ? `▼ ${Math.abs(delta)} fewer communications in Period A` : 'No change between periods'}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Quick analyse card */}
      <div
        style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', borderRadius: '16px', padding: '22px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', cursor: 'pointer' }}
        onClick={() => navigate('/submit')}
      >
        <div>
          <p className="font-syne font-extrabold" style={{ fontSize: '17px', color: '#fff', marginBottom: '4px' }}>Analyse new text ✨</p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>Paste any message to detect emotions instantly</p>
        </div>
        <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>→</div>
      </div>

      {/* Recent analyses */}
      {!loading && total > 0 && (
        <div style={{ background: '#fff', border: '1.5px solid #ede8fb', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#1a0a2e' }}>Recent activity</p>
            <button onClick={() => navigate('/history')} style={{ fontSize: '12px', color: '#7c3aed', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(summary).filter(([,v]) => v > 0).slice(0, 4).map(([emotion, count]) => (
              <div key={emotion} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `${EMOTION_COLORS[emotion.toLowerCase()] ?? '#a855f7'}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                  {EMOTION_EMOJI[emotion.toLowerCase()] ?? '🎭'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a0a2e', textTransform: 'capitalize' }}>{emotion}</span>
                    <span style={{ fontSize: '12px', color: '#9580c0' }}>{count} analyses</span>
                  </div>
                  <div style={{ height: '4px', background: '#f3eeff', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(count / Math.max(total, 1)) * 100}%`, background: EMOTION_COLORS[emotion.toLowerCase()] ?? '#a855f7', borderRadius: '2px' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
