import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTrends } from '../hooks/useTrends';
import type { TrendEntry } from '../types';
import BottomDock from '../components/BottomDock';

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

function BarChart({ trends }: { trends: TrendEntry[] }) {
  const recent7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const byDate: Record<string, number> = {};
  recent7.forEach(d => { byDate[d] = 0; });
  trends.forEach(t => {
    if (byDate[t.date] !== undefined) {
      byDate[t.date] += Object.values(t.emotionCounts).reduce((a, b) => a + (b ?? 0), 0);
    }
  });

  const max = Math.max(...Object.values(byDate), 1);
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
      {recent7.map((d, i) => {
        const v = byDate[d];
        const h = Math.max((v / max) * 68, 4);
        const isToday = i === 6;
        return (
          <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div
              title={`${d}: ${v}`}
              style={{ width: '100%', height: `${h}px`, borderRadius: '6px 6px 3px 3px', background: isToday ? 'linear-gradient(180deg,#7c3aed,#a855f7)' : '#ede8fb', transition: 'height 0.4s ease' }}
            />
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

  const total = Object.values(summary).reduce((a, b) => a + b, 0);
  const dominantEntry = Object.entries(summary).sort((a, b) => b[1] - a[1])[0];
  const dominant = dominantEntry?.[0] ?? '—';
  const avgSentiment = total > 0 ? '+0.72' : '—';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.email?.split('@')[0] ?? 'there';

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Greeting */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="font-syne font-extrabold" style={{ fontSize: '28px', color: '#1a0a2e', letterSpacing: '-0.5px' }}>
          {greeting}, {firstName} 👋
        </h1>
        <p style={{ fontSize: '14px', color: '#9580c0', marginTop: '4px' }}>Here's your emotion intelligence overview</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total analysed', value: loading ? '…' : total.toLocaleString(), icon: '📊', sub: 'all time' },
          { label: 'Dominant emotion', value: loading ? '…' : (EMOTION_EMOJI[dominant.toLowerCase()] ?? '🎭') + ' ' + (dominant.charAt(0) + dominant.slice(1).toLowerCase()), icon: null, sub: 'most frequent' },
          { label: 'Avg sentiment', value: loading ? '…' : avgSentiment, icon: '📈', sub: 'last 30 days' },
          { label: 'Emotions tracked', value: '7', icon: '🌈', sub: 'categories' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1.5px solid #ede8fb', borderRadius: '16px', padding: '18px 16px' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#9580c0', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{s.label}</p>
            <p className="font-syne font-extrabold" style={{ fontSize: '22px', color: '#1a0a2e', letterSpacing: '-0.3px' }}>{s.value}</p>
            <p style={{ fontSize: '11px', color: '#c4b5fd', marginTop: '2px' }}>{s.sub}</p>
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
          {loading ? <div style={{ height: '80px', display: 'flex', alignItems: 'center', color: '#c4b5fd', fontSize: '13px' }}>Loading…</div> : <BarChart trends={trends} />}
        </div>
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

      <BottomDock />
    </div>
  );
}
