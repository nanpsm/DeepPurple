import type { Emotion } from './types';

export const EMOTION_COLORS: Record<Emotion, string> = {
  JOY: '#f59e0b',
  ANGER: '#ef4444',
  FEAR: '#7c3aed',
  SADNESS: '#3b82f6',
  SURPRISE: '#06b6d4',
  DISGUST: '#22c55e',
  TRUST: '#10b981',
};

export const EMOTION_LABELS: Record<Emotion, string> = {
  JOY: 'Joy',
  ANGER: 'Anger',
  FEAR: 'Fear',
  SADNESS: 'Sadness',
  SURPRISE: 'Surprise',
  DISGUST: 'Disgust',
  TRUST: 'Trust',
};

export const ALL_EMOTIONS: Emotion[] = [
  'JOY', 'ANGER', 'FEAR', 'SADNESS', 'SURPRISE', 'DISGUST', 'TRUST',
];
