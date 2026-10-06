import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
        <p className="text-gray-500 mb-8">Your history and dashboard are ready.</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/submit')}
            className="bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors"
          >
            Analyse Text
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="border border-purple-300 text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="mb-6">
        <span className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full mb-4">
          AI-powered emotion analysis
        </span>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Understand the emotions<br />behind every message
        </h1>
        <p className="text-gray-500 text-lg">
          Analyse customer support tickets, product reviews, and social media text
          to uncover emotion, sentiment, and key topics.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3 mt-10">
        <button
          onClick={() => navigate('/signup')}
          className="bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors"
        >
          Create free account
        </button>
        <button
          onClick={() => navigate('/signin')}
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Sign in
        </button>
        <button
          onClick={() => navigate('/submit')}
          className="text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
        >
          Try as guest →
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Guest mode: analysis only, no history saved
      </p>
    </div>
  );
}
