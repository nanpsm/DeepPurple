import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmotionBadge from '../components/EmotionBadge';
import EmotionPieChart from '../components/EmotionPieChart';
import SentimentGauge from '../components/SentimentGauge';
import TopicCloud from '../components/TopicCloud';
import { api } from '../services/api';
import type { Communication } from '../types';

export default function CommunicationDetail() {
  const { id } = useParams<{ id: string }>();
  const [comm, setComm] = useState<Communication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) api.getCommunication(id).then(setComm).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-gray-400">Loading…</p>;
  if (!comm) return <p className="text-red-500">Communication not found.</p>;

  const pieData = comm.emotionScores
    ? Object.fromEntries(
        Object.entries(comm.emotionScores).map(([k, v]) => [k.toUpperCase(), Math.round(v * 100)])
      )
    : {};

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/communications" className="text-purple-600 hover:underline text-sm">
          ← Back
        </Link>
        <span className="text-gray-300">|</span>
        <span className="text-sm text-gray-500">
          {comm.source.replace(/_/g, ' ')} · {new Date(comm.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{comm.text}</p>
        {comm.summary && (
          <p className="text-sm text-gray-500 italic border-l-4 border-purple-200 pl-3">
            {comm.summary}
          </p>
        )}
      </div>

      {comm.primaryEmotion && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Primary Emotion</h3>
              <EmotionBadge emotion={comm.primaryEmotion} />
            </div>
            {comm.sentimentScore != null && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Sentiment</h3>
                <SentimentGauge score={comm.sentimentScore} />
              </div>
            )}
            {comm.topics && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Topics</h3>
                <TopicCloud topics={comm.topics} />
              </div>
            )}
          </div>

          {comm.emotionScores && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Emotion Breakdown</h3>
              <EmotionPieChart data={pieData} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
