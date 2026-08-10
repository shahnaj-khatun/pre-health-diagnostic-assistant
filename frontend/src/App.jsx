import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Activity, User, Calendar, MessageSquare, LogOut, HeartPulse, Moon, Sun, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import './index.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import HealthChat from './pages/HealthChat';
import TreatmentSchedule from './pages/TreatmentSchedule';
import HealthHistory from './pages/HealthHistory';
import BookAppointment from './pages/BookAppointment';
import ForgotPassword from './pages/ForgotPassword';

const Layout = ({ children }) => {
  const { logout } = useAuth() || {};
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { name: t('dashboard'), path: '/', icon: <Activity className="w-5 h-5" /> },
    { name: 'Symptom Checker', path: '/chat', icon: <MessageSquare className="w-5 h-5" /> },
    { name: t('medicalProfile'), path: '/profile', icon: <User className="w-5 h-5" /> },
    { name: t('schedule'), path: '/schedule', icon: <Calendar className="w-5 h-5" /> },
    { name: t('history'), path: '/history', icon: <Activity className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-gray-900 flex-col md:flex-row overflow-hidden">
      {/* Desktop Sidebar */}
      <nav className="w-full md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between hidden md:flex h-full">
        <div>
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
            <HeartPulse className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">PreHealth</span>
          </div>
          <div className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  to={link.path} 
                >
                  <motion.div
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 shadow-sm ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-700 font-semibold border-l-4 border-indigo-500' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {link.icon} {link.name}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <div className="flex justify-between items-center px-4 py-2">
             <button onClick={toggleTheme} className="text-gray-500 hover:text-indigo-600 transition p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
               {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>
             <button onClick={toggleLanguage} className="flex items-center gap-1 text-gray-500 hover:text-indigo-600 transition font-medium px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
               <Globe className="w-4 h-4" /> {language.toUpperCase()}
             </button>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition dark:hover:bg-rose-900/30">
            <LogOut className="w-5 h-5" /> {t('logout')}
          </button>
        </div>
      </nav>
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-20 sticky top-0">
        <div className="flex items-center gap-2 lg:gap-3">
          <HeartPulse className="w-6 h-6 text-indigo-600" />
          <span className="text-lg font-bold text-gray-800 dark:text-gray-200">PreHealth</span>
        </div>
        <button onClick={logout} className="text-gray-500 p-2 hover:bg-gray-100 rounded-full">
           <LogOut className="w-5 h-5" />
        </button>
      </div>

      <main className="flex-1 overflow-x-hidden overflow-y-auto pb-20 md:pb-0 scroll-smooth relative bg-slate-50 dark:bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around p-2 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         {navLinks.slice(0, 4).map((link) => {
           const isActive = location.pathname === link.path;
           return (
             <Link 
               key={link.path} 
               to={link.path} 
               className={`flex flex-col items-center justify-center w-full py-2 px-1 ${
                 isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'
               }`}
             >
               {link.icon}
               <span className="text-[10px] sm:text-xs mt-1 font-medium">{link.name.split(' ')[0]}</span>
             </Link>
           );
         })}
      </div>
    </div>
  );
};

import { Navigate } from 'react-router-dom';

// A simple auth guard component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth() || {};
  
  if (!user || !user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Layout><HealthChat /></Layout></ProtectedRoute>} />
        <Route path="/schedule" element={<ProtectedRoute><Layout><TreatmentSchedule /></Layout></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><Layout><HealthHistory /></Layout></ProtectedRoute>} />
        <Route path="/book" element={<ProtectedRoute><Layout><BookAppointment /></Layout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
