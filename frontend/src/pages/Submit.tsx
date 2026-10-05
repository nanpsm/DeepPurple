import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { CommunicationSource } from '../types';

const SOURCES: Array<{ value: CommunicationSource; label: string }> = [
  { value: 'SUPPORT_TICKET', label: 'Customer Support Ticket' },
  { value: 'PRODUCT_REVIEW', label: 'Product Review' },
  { value: 'SOCIAL_MEDIA', label: 'Social Media' },
];

export default function Submit() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [source, setSource] = useState<CommunicationSource>('SUPPORT_TICKET');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length < 10) {
      setError('Text must be at least 10 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await api.submitCommunication(text, source);
      navigate(`/communications/${result.id}`);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(msg ?? 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analyse Text</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Source Type</label>
          <div className="flex flex-wrap gap-2">
            {SOURCES.map(s => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSource(s.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  source === s.value
                    ? 'bg-purple-700 text-white border-purple-700'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Text{' '}
            <span className="text-gray-400 font-normal">(10–10,000 chars)</span>
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={8}
            maxLength={10000}
            placeholder="Paste the customer communication here…"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-y"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{text.length.toLocaleString()} / 10,000</p>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-700 text-white py-2.5 rounded-lg font-semibold hover:bg-purple-800 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Analysing…' : 'Analyse Emotions'}
        </button>
      </form>
    </div>
  );
}
