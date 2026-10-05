import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { Emotion } from '../types';
import { EMOTION_COLORS, EMOTION_LABELS } from '../constants';

interface Props {
  data: Record<string, number>;
}

export default function EmotionPieChart({ data }: Props) {
  const chartData = Object.entries(data)
    .filter(([, v]) => v > 0)
    .map(([emotion, value]) => ({
      name: EMOTION_LABELS[emotion as Emotion] ?? emotion,
      value,
      color: EMOTION_COLORS[emotion as Emotion] ?? '#9333ea',
    }));

  if (!chartData.length) {
    return <p className="text-center text-gray-400 py-8">No data yet</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(v: number) => v.toLocaleString()} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
