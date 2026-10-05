import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TrendEntry } from '../types';
import { ALL_EMOTIONS, EMOTION_COLORS, EMOTION_LABELS } from '../constants';

interface Props {
  trends: TrendEntry[];
}

export default function TrendLineChart({ trends }: Props) {
  if (!trends.length) {
    return <p className="text-center text-gray-400 py-8">No trend data yet</p>;
  }

  const chartData = trends.map(t => ({
    date: t.date,
    ...Object.fromEntries(ALL_EMOTIONS.map(e => [e, t.emotionCounts[e] ?? 0])),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        {ALL_EMOTIONS.map(emotion => (
          <Line
            key={emotion}
            type="monotone"
            dataKey={emotion}
            name={EMOTION_LABELS[emotion]}
            stroke={EMOTION_COLORS[emotion]}
            dot={false}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
