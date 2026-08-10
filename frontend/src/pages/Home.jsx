import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, MessageSquare, Calendar, ShieldAlert, ArrowRight, HeartPulse, Loader2, Thermometer, Wind, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

export default function Home() {
  const { user } = useAuth() || { user: { name: 'Demo User' } };
  
  const [appointments, setAppointments] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [latestVitals, setLatestVitals] = useState(null);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getBPStatus = (systolic, diastolic) => {
      if (systolic < 120 && diastolic < 80) return { label: 'Optimal', color: 'text-green-600' };
      if (systolic >= 130 || diastolic >= 80) return { label: 'High', color: 'text-red-600' };
      return { label: 'Elevated', color: 'text-orange-600' };
  };

  const getHRStatus = (hr) => {
      if (hr >= 60 && hr <= 100) return { label: 'Normal', color: 'text-green-600' };
      if (hr > 100) return { label: 'High', color: 'text-red-600' };
      return { label: 'Low', color: 'text-blue-600' };
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
           setLoading(false);
           return;
        }

        const opts = { headers: { 'x-auth-token': token } };
        
        const [appRes, treatRes, vitalsRes] = await Promise.all([
          fetch('/api/appointments', opts),
          fetch('/api/treatments', opts),
          fetch('/api/vitals/latest', opts)
        ]);

        if (appRes.ok) setAppointments(await appRes.json());
        if (treatRes.ok) setTreatments(await treatRes.json());
        if (vitalsRes.ok) {
            const vData = await vitalsRes.json();
            if (vData && vData.bloodPressure) {
                setLatestVitals(vData);
            }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleDeleteAppointment = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        setAppointments(appointments.filter(app => app._id !== id));
      } else {
        alert("Failed to delete appointment");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting appointment");
    }
  };

  const pendingTreatmentsCount = treatments.filter(t => t.status === 'pending').length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-3xl p-8 md:p-10 shadow-lg text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white dark:bg-gray-800 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
           <div>
             <h1 className="text-3xl md:text-4xl font-bold mb-2">{getGreeting()}, {user?.name?.split(' ')[0] || 'User'}!</h1>
             <p className="text-indigo-100 text-lg">Your health looks stable today. You have {pendingTreatmentsCount} pending treatments.</p>
           </div>
           <Link to="/schedule" className="bg-white dark:bg-gray-800 text-indigo-700 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 shadow-sm transition-colors flex items-center gap-2 flex-shrink-0">
             View Schedule <ArrowRight className="w-5 h-5" />
           </Link>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { to: '/chat', icon: <MessageSquare className="w-6 h-6" />, title: 'AI Symptom Checker', desc: 'Analyze symptoms & get advice', colors: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600' },
          { to: '/schedule', icon: <Calendar className="w-6 h-6" />, title: 'Treatments', desc: `${pendingTreatmentsCount} reminders today`, colors: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600' },
          { to: '/history', icon: <Activity className="w-6 h-6" />, title: 'Health History', desc: 'View past consultations', colors: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600' }
        ].map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
          >
            <Link to={item.to} className="block bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 rounded-2xl shadow-sm hover-3d group h-full glass-card">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:text-white group-hover:scale-110 transition-all duration-300 ${item.colors}`}>
                  {item.icon}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1 group-hover:text-indigo-600 transition-colors">{item.title}</h3>
              <p className="text-gray-500 text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">{item.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity / Vitals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 glass-card hover-3d"
        >
           <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
             <HeartPulse className="w-6 h-6 text-indigo-600" /> Recent Vitals
           </h2>
           <div className="space-y-4">
              {loading ? (
                  <div className="flex justify-center items-center h-48"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
              ) : latestVitals ? (
                  <>
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
                            <HeartPulse className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">Heart Rate</h4>
                            <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(latestVitals.timestamp), { addSuffix: true })}</span>
                          </div>
                        </div>
                        <div className="text-right">
                           <div className="font-bold text-xl text-gray-900 dark:text-gray-100">{latestVitals.heartRate} <span className="text-sm text-gray-500 font-normal">bpm</span></div>
                           <span className={`text-xs font-semibold ${getHRStatus(latestVitals.heartRate).color}`}>{getHRStatus(latestVitals.heartRate).label}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            <Activity className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">Blood Pressure</h4>
                            <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(latestVitals.timestamp), { addSuffix: true })}</span>
                          </div>
                        </div>
                        <div className="text-right">
                           <div className="font-bold text-xl text-gray-900 dark:text-gray-100">{latestVitals.bloodPressure?.systolic}/{latestVitals.bloodPressure?.diastolic}</div>
                           <span className={`text-xs font-semibold ${getBPStatus(latestVitals.bloodPressure?.systolic, latestVitals.bloodPressure?.diastolic).color}`}>{getBPStatus(latestVitals.bloodPressure?.systolic, latestVitals.bloodPressure?.diastolic).label}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                            <Thermometer className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">Temperature</h4>
                            <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(latestVitals.timestamp), { addSuffix: true })}</span>
                          </div>
                        </div>
                        <div className="text-right">
                           <div className="font-bold text-xl text-gray-900 dark:text-gray-100">{latestVitals.temperature} <span className="text-sm text-gray-500 font-normal">°F</span></div>
                        </div>
                      </div>
                  </>
              ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center bg-slate-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                      <HeartPulse className="w-8 h-8 text-gray-300 mb-3" />
                      <p className="text-gray-500 text-sm">No recent vitals found.</p>
                      <Link to="/profile" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2">Add Vitals</Link>
                  </div>
              )}
           </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 glass-card hover-3d"
        >
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
               <Calendar className="w-6 h-6 text-indigo-600" /> Upcoming
             </h2>
           </div>

           {loading ? (
             <div className="flex justify-center items-center h-48"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>
           ) : appointments.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-48 text-center bg-slate-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
               <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                  <Calendar className="w-8 h-8 text-indigo-600" />
               </div>
               <h4 className="text-gray-900 dark:text-gray-100 font-medium">No Upcoming Appointments</h4>
               <p className="text-gray-500 text-sm mt-1 max-w-xs mb-4">You don't have any medical appointments scheduled right now.</p>
               <Link to="/book" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors">
                 Book Appointment
               </Link>
             </div>
           ) : (
             <div className="space-y-4">
                {appointments.slice(0, 2).map((app, i) => {
                  // Fallback date parsing if format is '2026-04-16'
                  let displayMonth = 'N/A';
                  let displayDay = '00';
                  if (app.date) {
                    const parts = app.date.split('-');
                    if (parts.length === 3) {
                      const dateObj = new Date(app.date);
                      displayMonth = dateObj.toLocaleString('default', { month: 'short' }) || parts[1];
                      displayDay = dateObj.getDate() || parts[2];
                    }
                  }
                  
                  return (
                    <div key={app._id || i} className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                      <div className="flex gap-4 items-center">
                         <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-indigo-600 font-bold text-center leading-tight shadow-sm min-w-[60px]">
                           <div className="text-xs uppercase">{displayMonth}</div>
                           <div className="text-xl">{displayDay}</div>
                         </div>
                         <div>
                           <h4 className="font-bold text-gray-900 dark:text-gray-100">{app.doctorName}</h4>
                           <p className="text-sm text-gray-500">{app.time}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-white dark:bg-gray-800 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-full capitalize">
                          {app.status}
                        </span>
                        <button
                          onClick={() => handleDeleteAppointment(app._id)}
                          className="p-2 bg-white dark:bg-gray-800 border border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-full transition-colors shadow-sm ml-2"
                          title="Cancel Appointment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div className="pt-2 text-center">
                  <Link to="/book" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors block">
                    Book Another Appointment
                  </Link>
                </div>
             </div>
           )}
        </motion.div>
      </div>

    </div>
  );
}
