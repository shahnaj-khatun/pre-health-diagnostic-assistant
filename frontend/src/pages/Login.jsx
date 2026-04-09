import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-[#f8fbff] px-4 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-2">HealthAI Diagnostic System</h1>
        <p className="text-[#64748b]">Your personal AI-powered health assistant for symptom analysis and treatment guidance</p>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-8 border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#0f172a] mb-1">Welcome Back</h2>
          <p className="text-[#64748b] text-sm">Sign in to your health account</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="email" 
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type={showPassword ? "text" : "password"}
                className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-[#64748b]">Don't have an account? </span>
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">Create Account</Link>
        </div>
      </div>
    </div>
  );
}
