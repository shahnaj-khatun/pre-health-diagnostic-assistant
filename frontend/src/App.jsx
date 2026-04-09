import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Activity, User, Calendar, MessageSquare, LogOut, HeartPulse } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
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

const Layout = ({ children }) => {
  const { logout } = useAuth() || {};
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: <Activity className="w-5 h-5" /> },
    { name: 'Symptom Checker', path: '/chat', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Medical Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
    { name: 'Treatments', path: '/schedule', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Health History', path: '/history', icon: <Activity className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 flex-col md:flex-row overflow-hidden">
      {/* Desktop Sidebar */}
      <nav className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex h-full">
        <div>
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <HeartPulse className="w-8 h-8 text-teal-600" />
            <span className="text-xl font-bold text-gray-800">PreHealth</span>
          </div>
          <div className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive 
                      ? 'bg-teal-50 text-teal-700 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {link.icon} {link.name}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="p-4 border-t border-gray-100">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </nav>
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between z-20 sticky top-0">
        <div className="flex items-center gap-2 lg:gap-3">
          <HeartPulse className="w-6 h-6 text-teal-600" />
          <span className="text-lg font-bold text-gray-800">PreHealth</span>
        </div>
        <button onClick={logout} className="text-gray-500 p-2 hover:bg-gray-100 rounded-full">
           <LogOut className="w-5 h-5" />
        </button>
      </div>

      <main className="flex-1 overflow-x-hidden overflow-y-auto pb-20 md:pb-0 scroll-smooth">
        {children}
      </main>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         {navLinks.slice(0, 4).map((link) => {
           const isActive = location.pathname === link.path;
           return (
             <Link 
               key={link.path} 
               to={link.path} 
               className={`flex flex-col items-center justify-center w-full py-2 px-1 ${
                 isActive ? 'text-teal-600' : 'text-gray-500 hover:text-teal-500'
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
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
