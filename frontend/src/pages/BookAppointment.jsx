import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BookAppointment() {
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    doctorId: '',
    doctorName: '',
    date: '',
    time: '',
    reason: ''
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/doctors');
        if (res.ok) {
          const data = await res.json();
          setDoctors(data);
        }
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '01:30 PM', '02:00 PM', '03:30 PM', '04:00 PM'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          doctorId: formData.doctorId,
          doctorName: formData.doctorName,
          date: formData.date,
          time: formData.time,
          reason: formData.reason
        })
      });

      if (res.ok) {
        setStep(3); 
      } else {
        const errorData = await res.json();
        alert(errorData.msg || "Failed to book appointment. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong joining server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Book an Appointment</h1>
        <p className="text-gray-500 mt-1">Schedule a visit with one of our specialists</p>
      </div>

      {step === 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6">Step 1: Select a Doctor</h2>
          
          {loading ? (
             <div className="flex justify-center p-8 text-indigo-600"><Loader2 className="w-8 h-8 animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map(doc => (
                <button
                  key={doc._id}
                  onClick={() => {
                    setFormData({...formData, doctorId: doc._id, doctorName: doc.name});
                    setStep(2);
                  }}
                  disabled={!doc.available}
                  className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                    doc.available 
                      ? 'border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-sm cursor-pointer' 
                      : 'border-gray-100 dark:border-gray-700 bg-gray-50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${doc.available ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'}`}>
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">{doc.name}</h3>
                    <p className="text-sm text-gray-500">{doc.specialty}</p>
                    {doc.experience && <p className="text-xs text-gray-400">{doc.experience}</p>}
                    {!doc.available && <span className="text-xs text-rose-500 font-medium mt-1 block">Currently Unavailable</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Step 2: Choose Date & Time</h2>
            <button onClick={() => setStep(1)} className="text-sm text-indigo-600 font-medium hover:underline">Change Doctor</button>
          </div>
          
          <div className="mb-6 p-4 bg-indigo-50 rounded-xl flex items-center gap-3">
             <User className="w-5 h-5 text-indigo-600" />
             <span className="font-medium text-indigo-900">Booking with {formData.doctorName}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="date" 
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-800"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Times</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <select 
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white dark:bg-gray-800 appearance-none"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  >
                    <option value="" disabled>Select a time slot</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea 
                  required
                  rows="3"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                  placeholder="Briefly describe your symptoms or reason for the appointment..."
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                ></textarea>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button 
                type="submit" 
                disabled={submitting}
                className={`flex-1 ${submitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-xl font-bold py-3 transition-colors shadow-sm flex items-center justify-center gap-2`}
              >
                {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Details saving...</> : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-[#0f172a] dark:text-gray-100xl font-bold text-gray-900 dark:text-gray-100 mb-2">Appointment Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your appointment with <span className="font-semibold text-gray-900 dark:text-gray-100">{formData.doctorName}</span> has been successfully scheduled for <span className="font-semibold text-gray-900 dark:text-gray-100">{formData.date}</span> at <span className="font-semibold text-gray-900 dark:text-gray-100">{formData.time}</span>.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/" className="w-full bg-indigo-600 text-white rounded-xl font-bold py-3 hover:bg-indigo-700 transition-colors shadow-sm inline-block">
              Return to Dashboard
            </Link>
            <button className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 rounded-xl font-medium py-3 hover:bg-gray-50 transition-colors inline-block">
              Add to Calendar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
