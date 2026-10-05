import type { Emotion } from '../types';
import { EMOTION_COLORS, EMOTION_LABELS } from '../constants';

interface Props {
  emotion: Emotion;
  size?: 'sm' | 'md';
}

export default function EmotionBadge({ emotion, size = 'md' }: Props) {
  const color = EMOTION_COLORS[emotion];
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
      style={{ backgroundColor: `${color}22`, color }}
    >
      {EMOTION_LABELS[emotion]}
    </span>
  );
}
