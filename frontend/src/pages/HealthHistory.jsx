import { useState, useEffect } from 'react';
import { Activity, Calendar as CalendarIcon, FileText, ChevronRight, Stethoscope, Trash2 } from 'lucide-react';

export default function HealthHistory() {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalVisits: 0, activePrescriptions: 0, upcomingAppts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
           setLoading(false);
           return;
        }

        const headers = { 'x-auth-token': token };

        const [histRes, treatRes, apptRes] = await Promise.all([
          fetch('/api/symptoms', { headers }),
          fetch('/api/treatments', { headers }),
          fetch('/api/appointments', { headers })
        ]);
        
        let histData = [];
        if (histRes.ok) {
          histData = await histRes.json();
          setHistory(histData);
        }

        let treatData = [];
        if (treatRes.ok) {
          treatData = await treatRes.json();
        }

        let apptData = [];
        if (apptRes.ok) {
          apptData = await apptRes.json();
        }

        setStats({
          totalVisits: histData.length,
          activePrescriptions: treatData.length,
          upcomingAppts: apptData.length
        });

      } catch (err) {
        console.error("Error fetching history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this log?")) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/symptoms/${id}`, {
         method: 'DELETE',
         headers: { 'x-auth-token': token }
      });
      if (res.ok) {
         setHistory(history.filter(item => (item._id || item.id) !== id));
      } else {
         console.error("Failed to delete record");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadReport = () => {
    let reportContent = `HealthAI Diagnostic System\n\nMEDICAL HISTORY REPORT\n\nTotal Logs: ${history.length}\n\n---\n\n`;
    
    history.forEach((record, index) => {
       reportContent += `${index + 1}. ${new Date(record.date).toLocaleDateString()}\nAI Diagnostic Assessment\nSymptoms: ${record.symptoms.join(', ')}\nAssessment: ${record.diagnosis}\nUrgency: ${record.urgency.toUpperCase()}\n\n`;
    });
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Medical_History_Report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Health History</h1>
        <p className="text-gray-500 mt-1">Review past consultations and medical events</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline / History List */}
        <div className="lg:col-span-2 space-y-4">
           {loading ? (
             <div className="text-center py-10 text-gray-500">Loading your history...</div>
           ) : history.length === 0 ? (
             <div className="text-center py-10 text-gray-500 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8">
                <Stethoscope className="w-12 h-12 text-indigo-200 mx-auto mb-3" />
                <p>No health history found.</p>
                <p className="text-sm mt-1">Visit the Symptom Checker to start logging your health events.</p>
             </div>
           ) : (
             history.map((record) => (
               <div key={record._id || record.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl p-6 transition-colors hover:border-indigo-200 cursor-pointer group hover-3d">
                 <div className="flex items-start justify-between">
                   <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{record.diagnosis || "Health Event"}</h3>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full flex items-center gap-1">
                             <CalendarIcon className="w-3 h-3" /> {new Date(record.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-indigo-700 font-medium text-sm mb-2">
                           Urgency: <span className="uppercase text-gray-600">{record.urgency}</span>
                        </p>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                           <span className="font-semibold block text-xs uppercase text-gray-400 mb-1">Symptoms:</span>
                           {record.symptoms && record.symptoms.join(', ')}
                        </p>
                      </div>
                   </div>
                   <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                     <button
                       onClick={(e) => handleDelete(e, record._id || record.id)}
                       className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
                       title="Delete record"
                     >
                       <Trash2 className="w-5 h-5" />
                     </button>
                     <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-600 transition-colors hidden sm:block" />
                   </div>
                 </div>
               </div>
             ))
           )}
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
           {/* Quick Stats */}
           <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover-3d">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
               <Activity className="w-5 h-5 text-indigo-600" /> Summary
             </h3>
             <ul className="space-y-4">
               <li className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
                 <span className="text-gray-600">Total Visits (Logs)</span>
                 <span className="font-bold text-xl text-indigo-600">{stats.totalVisits}</span>
               </li>
               <li className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
                 <span className="text-gray-600">Active Prescriptions</span>
                 <span className="font-bold text-xl text-indigo-600">{stats.activePrescriptions}</span>
               </li>
               <li className="flex justify-between items-center">
                 <span className="text-gray-600">Upcoming Appts</span>
                 <span className="font-bold text-xl text-indigo-600">{stats.upcomingAppts}</span>
               </li>
             </ul>
           </div>

           {/* Download Report */}
           <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 shadow-md text-white hover-3d">
              <h3 className="font-bold text-lg mb-2">Need a copy?</h3>
              <p className="text-indigo-100 text-sm mb-4">Download your complete medical history report for your personal records or insurance.</p>
              <button 
                onClick={handleDownloadReport}
                className="w-full bg-white dark:bg-gray-800 text-indigo-700 font-bold py-3 rounded-xl shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" /> Download PDF
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
