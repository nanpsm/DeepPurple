export type CommunicationSource = 'SUPPORT_TICKET' | 'PRODUCT_REVIEW' | 'SOCIAL_MEDIA';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type Emotion = 'JOY' | 'ANGER' | 'FEAR' | 'SADNESS' | 'SURPRISE' | 'DISGUST' | 'TRUST';

export interface EmotionScores {
  joy: number;
  anger: number;
  fear: number;
  sadness: number;
  surprise: number;
  disgust: number;
  trust: number;
}

export interface Communication {
  id: string;
  text: string;
  source: CommunicationSource;
  createdAt: string;
  analyzedAt: string | null;
  primaryEmotion: Emotion | null;
  sentimentScore: number | null;
  emotionScores: EmotionScores | null;
  topics: string[] | null;
  summary: string | null;
  priority: Priority | null;
  alert: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface TrendEntry {
  date: string;
  emotionCounts: Partial<Record<Emotion, number>>;
}

export type TopicEmotionData = Record<string, Record<string, number>>;
