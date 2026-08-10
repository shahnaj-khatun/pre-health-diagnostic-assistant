import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import TiltCard from '../components/TiltCard';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    // Simulating an API call for password reset
    setTimeout(() => {
      setLoading(false);
      setMessage('If an account exists for this email, you will receive password reset instructions.');
      setEmail('');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-[#f8fbff] dark:bg-gray-900 px-4 font-sans">
      <div className="text-center mb-8 mt-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-2">HealthAI Diagnostic System</h1>
        <p className="text-[#64748b]">Your personal AI-powered health assistant for symptom analysis and treatment guidance</p>
      </div>

      <div className="perspective-1000 w-full max-w-md">
        <TiltCard className="w-full">
          <div className="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden p-10 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-[#0f172a] dark:text-gray-100 font-bold mb-1 text-2xl">Reset Password</h2>
          <p className="text-[#64748b] text-sm text-center">Enter your email address and we'll send you instructions to reset your password.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="email" 
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
              {message}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || Boolean(message)}
            className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-500/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all mt-2"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <Link to="/login" className="flex items-center justify-center gap-2 font-medium text-gray-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
        </div>
      </TiltCard>
      </div>
    </div>
  );
}
