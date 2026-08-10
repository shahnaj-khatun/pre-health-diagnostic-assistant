import { useState, useEffect } from 'react';
import { Pill, CheckCircle2, Clock, Calendar as CalendarIcon, AlertCircle, Trash2, Plus, Loader2 } from 'lucide-react';

export default function TreatmentSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTreatment, setNewTreatment] = useState({ name: '', type: 'Medication', time: '', instructions: '' });
  
  useEffect(() => {
    fetchTreatments();
  }, []);

  const fetchTreatments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/treatments', {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (res.ok) setSchedule(data);
    } catch (err) {
      console.error('Failed to fetch treatments', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'taken' ? 'pending' : 'taken';
      
      setSchedule(schedule.map(item => 
        item._id === id ? { ...item, status: newStatus } : item
      ));

      const token = localStorage.getItem('token');
      const res = await fetch(`/api/treatments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to update status");
    } catch (err) {
       console.error(err);
       fetchTreatments();
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/treatments/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        setSchedule(schedule.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTreatment = async (e) => {
    e.preventDefault();
    if (!newTreatment.name || !newTreatment.time) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/treatments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(newTreatment)
      });
      const data = await res.json();
      if (res.ok) {
        setSchedule([data, ...schedule]);
        setShowAddForm(false);
        setNewTreatment({ name: '', type: 'Medication', time: '', instructions: '' });
      }
    } catch (err) {
       console.error("Failed to add treatment", err);
    }
  };

  const completedCount = schedule.filter(s => s.status === 'taken').length;
  const totalCount = schedule.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Treatment Schedule</h1>
          <p className="text-gray-500 mt-1">Track your daily medications and treatments</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
           <CalendarIcon className="w-5 h-5 text-indigo-600" />
           <span className="font-medium text-gray-800 dark:text-gray-200">
             Today, {new Date().toLocaleString('default', { month: 'long', day: 'numeric' })}
           </span>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-2xl p-6 shadow-md text-white">
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-bold">Daily Progress</h2>
           <span className="bg-white dark:bg-gray-800/20 px-3 py-1 rounded-full text-sm font-medium">
             {completedCount} / {totalCount} Completed
           </span>
        </div>
        <div className="w-full bg-indigo-800 rounded-full h-3 mb-2 overflow-hidden">
          <div className="bg-white dark:bg-gray-800 h-3 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <p className="text-indigo-100 text-sm">
          {totalCount === 0 ? "You have no treatments scheduled." : 
            completedCount === totalCount ? "Great job! You've taken all your treatments for today." :
            `Stay on track! You have ${totalCount - completedCount} reminders left today.`
          }
        </p>
      </div>

      {/* Add Treatment Button & Form */}
      <div className="flex justify-start">
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-white dark:bg-gray-800 text-indigo-600 border border-indigo-200 hover:bg-indigo-50 font-medium py-2 px-4 rounded-xl shadow-sm flex items-center gap-2 transition"
        >
           <Plus className="w-5 h-5" /> 
           {showAddForm ? 'Cancel Adding' : 'Add New Treatment'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddTreatment} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 grid md:grid-cols-2 gap-4 hover-3d">
          <h3 className="md:col-span-2 font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">New Treatment Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
            <input type="text" required value={newTreatment.name} onChange={e => setNewTreatment({...newTreatment, name: e.target.value})} className="w-full border-gray-200 dark:border-gray-700 rounded-xl focus:ring-indigo-500 py-2 px-3 border outline-none font-sans" placeholder="e.g. Vitamin C" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <input type="text" value={newTreatment.type} onChange={e => setNewTreatment({...newTreatment, type: e.target.value})} className="w-full border-gray-200 dark:border-gray-700 rounded-xl focus:ring-indigo-500 py-2 px-3 border outline-none font-sans" placeholder="e.g. Supplement" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input type="time" required value={newTreatment.time} onChange={e => setNewTreatment({...newTreatment, time: e.target.value})} className="w-full border-gray-200 dark:border-gray-700 rounded-xl focus:ring-indigo-500 py-2 px-3 border outline-none font-sans" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
            <input type="text" value={newTreatment.instructions} onChange={e => setNewTreatment({...newTreatment, instructions: e.target.value})} className="w-full border-gray-200 dark:border-gray-700 rounded-xl focus:ring-indigo-500 py-2 px-3 border outline-none font-sans" placeholder="e.g. After meal" />
          </div>

          <div className="md:col-span-2 flex justify-end mt-2">
            <button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700 font-medium py-2.5 px-6 rounded-xl shadow-sm transition">
              Save Treatment
            </button>
          </div>
        </form>
      )}

      {/* Schedule List */}
      <div className="space-y-4 pt-4">
        {loading ? (
           <div className="flex justify-center p-8 text-indigo-600"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : schedule.length === 0 ? (
           <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm text-gray-500">
             No treatments scheduled yet. Add one above!
           </div>
        ) : (
          schedule.map(item => (
            <div key={item._id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover-3d">
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  item.status === 'taken' ? 'bg-green-100 text-green-600' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  <Pill className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-bold text-lg ${item.status === 'taken' ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
                      {item.name}
                    </h3>
                    {item.status === 'taken' && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">TAKEN</span>}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 gap-3">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {item.time}</span>
                    {item.instructions && <span className="flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {item.instructions}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button 
                  onClick={() => toggleStatus(item._id, item.status)}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                    item.status === 'taken' 
                      ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                  }`}
                >
                  {item.status === 'taken' ? 'Undo' : 'Mark as Taken'}
                  {item.status !== 'taken' && <CheckCircle2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition"
                  title="Remove Treatment"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
            </div>
          ))
        )}
      </div>
    </div>
  );
}
