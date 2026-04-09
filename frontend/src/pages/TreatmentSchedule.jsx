import { useState } from 'react';
import { Pill, CheckCircle2, Clock, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';

export default function TreatmentSchedule() {
  const [schedule, setSchedule] = useState([
    { id: 1, name: 'Amoxicillin 500mg', type: 'Antibiotic', time: '08:00 AM', status: 'taken', instructions: 'Take with food' },
    { id: 2, name: 'Vitamin D3 2000 IU', type: 'Supplement', time: '09:00 AM', status: 'pending', instructions: 'Daily dose' },
    { id: 3, name: 'Ibuprofen 400mg', type: 'Pain Reliever', time: '02:00 PM', status: 'pending', instructions: 'As needed for pain' },
    { id: 4, name: 'Amoxicillin 500mg', type: 'Antibiotic', time: '08:00 PM', status: 'pending', instructions: 'Take with food' },
  ]);

  const toggleStatus = (id) => {
    setSchedule(schedule.map(item => 
      item.id === id ? { ...item, status: item.status === 'taken' ? 'pending' : 'taken' } : item
    ));
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Treatment Schedule</h1>
          <p className="text-gray-500 mt-1">Track your daily medications and treatments</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 border border-gray-200 rounded-xl shadow-sm">
           <CalendarIcon className="w-5 h-5 text-teal-600" />
           <span className="font-medium text-gray-800">Today, March 26</span>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-700 rounded-2xl p-6 shadow-md text-white">
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-bold">Daily Progress</h2>
           <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
             1 / 4 Completed
           </span>
        </div>
        <div className="w-full bg-teal-800 rounded-full h-3 mb-2 overflow-hidden">
          <div className="bg-white h-3 rounded-full" style={{ width: '25%' }}></div>
        </div>
        <p className="text-teal-100 text-sm">Stay on track! You have 3 reminders left today.</p>
      </div>

      {/* Schedule List */}
      <div className="space-y-4 pt-4">
        {schedule.map(item => (
          <div key={item.id} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:shadow-md">
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                item.status === 'taken' ? 'bg-green-100 text-green-600' : 'bg-teal-50 text-teal-600'
              }`}>
                <Pill className="w-6 h-6" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-bold text-lg ${item.status === 'taken' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {item.name}
                  </h3>
                  {item.status === 'taken' && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">TAKEN</span>}
                </div>
                <div className="flex items-center text-sm text-gray-500 gap-3">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {item.time}</span>
                  <span className="flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {item.instructions}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => toggleStatus(item.id)}
              className={`w-full md:w-auto px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                item.status === 'taken' 
                  ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' 
                  : 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm'
              }`}
            >
               {item.status === 'taken' ? 'Undo' : 'Mark as Taken'}
               {item.status !== 'taken' && <CheckCircle2 className="w-5 h-5" />}
            </button>
            
          </div>
        ))}
      </div>
    </div>
  );
}
