import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, MessageSquare, Calendar, ShieldAlert, ArrowRight, HeartPulse } from 'lucide-react';

export default function Home() {
  const { user } = useAuth() || { user: { name: 'Demo User' } };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-700 rounded-3xl p-8 md:p-10 shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
           <div>
             <h1 className="text-3xl md:text-4xl font-bold mb-2">Good afternoon, {user?.name?.split(' ')[0] || 'User'}!</h1>
             <p className="text-teal-100 text-lg">Your health looks stable today. You have 3 pending treatments.</p>
           </div>
           <Link to="/schedule" className="bg-white text-teal-700 px-6 py-3 rounded-xl font-bold hover:bg-teal-50 shadow-sm transition-colors flex items-center gap-2 flex-shrink-0">
             View Schedule <ArrowRight className="w-5 h-5" />
           </Link>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/chat" className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-teal-200 transition-all group">
           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <MessageSquare className="w-6 h-6" />
           </div>
           <h3 className="font-bold text-gray-900 text-lg mb-1">AI Symptom Checker</h3>
           <p className="text-gray-500 text-sm">Analyze symptoms & get advice</p>
        </Link>
        
        <Link to="/schedule" className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-teal-200 transition-all group">
           <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Calendar className="w-6 h-6" />
           </div>
           <h3 className="font-bold text-gray-900 text-lg mb-1">Treatments</h3>
           <p className="text-gray-500 text-sm">3 reminders today</p>
        </Link>
        
        <Link to="/history" className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-teal-200 transition-all group">
           <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Activity className="w-6 h-6" />
           </div>
           <h3 className="font-bold text-gray-900 text-lg mb-1">Health History</h3>
           <p className="text-gray-500 text-sm">View past consultations</p>
        </Link>
      </div>

      {/* Recent Activity / Vitals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
           <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
             <HeartPulse className="w-6 h-6 text-teal-600" /> Recent Vitals
           </h2>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Heart Rate</h4>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                </div>
                <div className="text-right">
                   <div className="font-bold text-xl text-gray-900">72 <span className="text-sm text-gray-500 font-normal">bpm</span></div>
                   <span className="text-xs font-semibold text-green-600">Normal</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Blood Pressure</h4>
                    <span className="text-xs text-gray-500">Yesterday</span>
                  </div>
                </div>
                <div className="text-right">
                   <div className="font-bold text-xl text-gray-900">118/76</div>
                   <span className="text-xs font-semibold text-green-600">Optimal</span>
                </div>
              </div>
           </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
           <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
             <Calendar className="w-6 h-6 text-teal-600" /> Upcoming
           </h2>
           <div className="flex flex-col items-center justify-center h-48 text-center bg-slate-50 rounded-xl border border-dashed border-gray-200">
             <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-3">
                <Calendar className="w-8 h-8 text-teal-600" />
             </div>
             <h4 className="text-gray-900 font-medium">No Upcoming Appointments</h4>
             <p className="text-gray-500 text-sm mt-1 max-w-xs mb-4">You don't have any medical appointments scheduled right now.</p>
             <Link to="/book" className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors">
               Book Appointment
             </Link>
           </div>
        </div>
      </div>

    </div>
  );
}
