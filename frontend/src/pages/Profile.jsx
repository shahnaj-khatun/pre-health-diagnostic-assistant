import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Calendar, HeartPulse, Activity, Edit2, Save, Upload, FileText, Loader2, Trash2 } from 'lucide-react';
import VitalsSection from '../components/VitalsSection';

export default function Profile() {
  const { user } = useAuth() || {};
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    dob: '',
    bloodType: '',
    height: '',
    weight: '',
    bmi: null,
  });

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
         setLoading(false);
         return;
      }
      const res = await fetch('/api/auth/profile', {
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setProfileData({
          name: data.name || user?.name || '',
          email: data.email || user?.email || '',
          phone: data.profile?.phone || '',
          dob: data.profile?.dob || '',
          bloodType: data.profile?.bloodGroup || '',
          height: data.profile?.height || '',
          weight: data.profile?.weight || '',
          bmi: data.profile?.bmi || null,
        });
        setPrescriptions(data.prescriptions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          dob: profileData.dob,
          bloodType: profileData.bloodType,
          height: profileData.height,
          weight: profileData.weight
        })
      });
      if (res.ok) {
        const data = await res.json();
        setProfileData(prev => ({
           ...prev,
           bmi: data.profile?.bmi
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('prescription', file);

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/prescriptions', {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setPrescriptions(data);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDoc = async (e, id) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/auth/prescriptions/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      if (res.ok) {
        const data = await res.json();
        setPrescriptions(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return { label: 'N/A', color: 'text-gray-500' };
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
    if (bmi >= 18.5 && bmi < 24.9) return { label: 'Normal', color: 'text-green-500' };
    if (bmi >= 25 && bmi < 29.9) return { label: 'Overweight', color: 'text-orange-500' };
    return { label: 'Obese', color: 'text-red-500' };
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-indigo-600 w-8 h-8" /></div>;
  }

  const bmiData = getBMICategory(profileData.bmi);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Medical Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your personal health information</p>
        </div>
        <button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
            isEditing 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {isEditing ? <><Save className="w-4 h-4" /> Save</> : <><Edit2 className="w-4 h-4" /> Edit</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden hover-3d">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-400 to-indigo-600"></div>
            <div className="relative pt-16 flex flex-col items-center">
              <div className="w-28 h-28 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-xl mb-4 relative flex items-center justify-center">
                <div className="w-full h-full bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                   <User className="w-12 h-12" />
                </div>
              </div>
              
              {isEditing ? (
                 <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="text-xl font-bold text-center border-b border-indigo-300 focus:outline-none focus:border-indigo-600 bg-transparent dark:text-white" />
              ) : (
                <h2 className="text-[#0f172a] dark:text-gray-100xl font-bold text-gray-900 dark:text-gray-100">{profileData.name}</h2>
              )}
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{profileData.email}</p>
              
              <div className="w-full space-y-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <Phone className="w-4 h-4 text-indigo-500" />
                  {isEditing ? (
                    <input type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="border-b border-indigo-300 focus:outline-none focus:border-indigo-600 flex-1 px-1 bg-transparent" placeholder="Phone" />
                  ) : <span>{profileData.phone || 'Not provided'}</span>}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  {isEditing ? (
                    <input type="date" value={profileData.dob} onChange={e => setProfileData({...profileData, dob: e.target.value})} className="border-b border-indigo-300 focus:outline-none focus:border-indigo-600 flex-1 px-1 bg-transparent" />
                  ) : <span>{profileData.dob || 'Not provided'}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Physical Characteristics & BMI */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover-3d">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                 <Activity className="w-6 h-6 text-indigo-600" /> Physical & BMI
               </h3>
               {profileData.bmi && (
                 <span className={`px-4 py-1.5 rounded-full text-sm font-bold bg-white dark:bg-gray-900 ${bmiData.color} border border-gray-100 dark:border-gray-800 shadow-sm`}>
                    {bmiData.label} (BMI: {profileData.bmi.toFixed(1)})
                 </span>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 text-center transition-all hover:shadow-md">
                <span className="block text-sm text-gray-500 dark:text-gray-400 font-medium mb-2 w-full text-center">Blood Type</span>
                {isEditing ? (
                   <input type="text" value={profileData.bloodType} onChange={e => setProfileData({...profileData, bloodType: e.target.value})} className="w-full text-center font-bold text-gray-900 dark:text-white bg-transparent border-b border-indigo-300 focus:outline-none text-[#0f172a] dark:text-gray-100xl" placeholder="O+" />
                ) : <span className="block font-bold text-indigo-600 text-[#0f172a] dark:text-gray-100xl">{profileData.bloodType || '-'}</span>}
              </div>
              <div className="p-5 bg-slate-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 text-center transition-all hover:shadow-md">
                <span className="block text-sm text-gray-500 dark:text-gray-400 font-medium mb-2 text-center w-full">Height (cm)</span>
                {isEditing ? (
                   <input type="number" value={profileData.height} onChange={e => setProfileData({...profileData, height: e.target.value})} className="w-full text-center font-bold text-gray-900 dark:text-white bg-transparent border-b border-indigo-300 focus:outline-none text-[#0f172a] dark:text-gray-100xl" placeholder="170" />
                ) : <span className="block font-bold text-gray-900 dark:text-white text-[#0f172a] dark:text-gray-100xl">{profileData.height || '-'}</span>}
              </div>
              <div className="p-5 bg-slate-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 text-center transition-all hover:shadow-md">
                <span className="block text-sm text-gray-500 dark:text-gray-400 font-medium mb-2 text-center w-full">Weight (kg)</span>
                {isEditing ? (
                   <input type="number" value={profileData.weight} onChange={e => setProfileData({...profileData, weight: e.target.value})} className="w-full text-center font-bold text-gray-900 dark:text-white bg-transparent border-b border-indigo-300 focus:outline-none text-[#0f172a] dark:text-gray-100xl" placeholder="65" />
                ) : <span className="block font-bold text-gray-900 dark:text-white text-[#0f172a] dark:text-gray-100xl">{profileData.weight || '-'}</span>}
              </div>
            </div>
            {isEditing && (
              <p className="text-xs text-center text-gray-400 mt-4">Save profile to recalculate BMI</p>
            )}
          </div>

          {/* Prescription Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover-3d">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FileText className="w-6 h-6 text-indigo-600" /> Medical Documents
                </h3>
               <label className="cursor-pointer bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Upload
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,.pdf" />
               </label>
            </div>

            {prescriptions.length === 0 ? (
               <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                 <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                 <p className="text-gray-500 dark:text-gray-400">No documents uploaded yet</p>
               </div>
            ) : (
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                 {prescriptions.map((doc, idx) => (
                   <div key={idx} className="relative group block">
                     <a href={doc.url} target="_blank" rel="noreferrer" className="block">
                       <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 aspect-square flex flex-col justify-center items-center hover:border-indigo-400 transition-colors relative">
                          {doc.url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                              <img src={doc.url} alt="docs" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          ) : (
                              <>
                                <FileText className="w-10 h-10 text-gray-400 mb-2" />
                                <span className="text-xs text-gray-500 truncate w-full px-4 text-center">{doc.filename}</span>
                              </>
                          )}
                       </div>
                     </a>
                     <button 
                       onClick={(e) => handleDeleteDoc(e, doc._id)} 
                       className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white rounded-xl text-red-500 shadow-md transition-colors z-10" 
                       title="Delete"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Vitals Tracking Section */}
      <VitalsSection />
    </div>
  );
}
