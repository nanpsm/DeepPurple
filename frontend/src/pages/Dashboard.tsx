import type { ReactNode } from 'react';
import EmotionPieChart from '../components/EmotionPieChart';
import TrendLineChart from '../components/TrendLineChart';
import { useTrends } from '../hooks/useTrends';

export default function Dashboard() {
  const { trends, summary, loading } = useTrends();

  const totalAnalyses = Object.values(summary).reduce((a, b) => a + b, 0);
  const dominantEntry = Object.entries(summary).sort((a, b) => b[1] - a[1])[0];
  const dominantEmotion = dominantEntry ? dominantEntry[0] : '—';

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading insights…</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Emotion Intelligence Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Analysed" value={totalAnalyses.toLocaleString()} />
        <StatCard label="Dominant Emotion" value={dominantEmotion} />
        <StatCard label="Emotions Tracked" value="7" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Emotion Distribution">
          <EmotionPieChart data={summary} />
        </Card>
        <Card title="Emotion Trends (Last 30 Days)">
          <TrendLineChart trends={trends} />
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-700 mb-4">{title}</h2>
      {children}
    </div>
  );
}
