import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import TiltCard from '../components/TiltCard';

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
    <div className="flex min-h-screen bg-slate-50 dark:bg-gray-900 font-sans">
      
      {/* Left Side - Visual / Brand Showcase */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
           <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob"></div>
           <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-violet-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob animation-delay-2000"></div>
           <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-16">
          <div className="flex items-center gap-3">
             <HeartPulse className="w-10 h-10 text-violet-300" />
             <span className="text-2xl font-bold tracking-tight">PreHealth AI</span>
          </div>

          <div className="max-w-md">
             <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="text-5xl font-extrabold mb-6 leading-tight"
             >
               Welcome back to better health.
             </motion.h1>
             <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
               className="text-indigo-200 text-lg leading-relaxed"
             >
               Access your personalized medical profile, analyze symptoms instantly, and manage your treatments securely in one place.
             </motion.p>
          </div>

          <div className="flex items-center gap-4 text-sm text-indigo-300 font-medium">
             <span>Secure.</span>
             <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
             <span>Intelligent.</span>
             <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
             <span>Private.</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 relative perspective-1000">
        <TiltCard className="w-full max-w-md">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-100 dark:border-gray-700"
          >
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
             <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
               <HeartPulse className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
             </div>
             <span className="text-2xl font-bold text-gray-900 dark:text-white">PreHealth</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign in</h2>
            <p className="text-gray-500 dark:text-gray-400">Enter your details to access your account</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input 
                  type="email" 
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-medium flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-4 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all overflow-hidden shadow-lg shadow-indigo-500/30 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
            >
              <span className="relative z-10 flex items-center gap-2">
                 {loading ? 'Signing in...' : 'Sign In'}
                 {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
              {/* Subtle hover sweep effect */}
              <div className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full z-0 opacity-0 group-hover:opacity-100"></div>
            </button>
          </form>

          <div className="mt-10 text-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">Don't have an account? </span>
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors">
              Create Account
            </Link>
          </div>
        </motion.div>
        </TiltCard>
      </div>
    </div>
  );
}
