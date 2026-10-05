interface Props {
  score: number;
}

export default function SentimentGauge({ score }: Props) {
  const pct = Math.round((score + 1) * 50);
  const color = score > 0.2 ? '#22c55e' : score < -0.2 ? '#ef4444' : '#f59e0b';
  const label = score > 0.2 ? 'Positive' : score < -0.2 ? 'Negative' : 'Neutral';

  return (
    <div className="flex flex-col gap-1.5">
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-medium" style={{ color }}>
        {label} ({score.toFixed(2)})
      </span>
    </div>
  );
}
