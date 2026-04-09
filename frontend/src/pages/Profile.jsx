import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Calendar, HeartPulse, Activity, ShieldAlert, Edit2, Save } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth() || { user: { name: 'Demo User', email: 'demo@example.com' } };
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Jane Doe',
    email: user?.email || 'jane.doe@example.com',
    phone: '+1 (555) 123-4567',
    dob: '1985-06-15',
    bloodType: 'O+',
    height: '165 cm',
    weight: '62 kg',
  });

  const handleSave = () => {
    setIsEditing(false);
    // Conceptually save profile
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Profile</h1>
          <p className="text-gray-500 mt-1">Manage your personal health information</p>
        </div>
        <button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            isEditing 
              ? 'bg-teal-600 text-white hover:bg-teal-700' 
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {isEditing ? <><Save className="w-4 h-4" /> Save Changes</> : <><Edit2 className="w-4 h-4" /> Edit Profile</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-teal-400 to-teal-600"></div>
            <div className="relative pt-12 flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md mb-4 flex items-center justify-center">
                <div className="w-full h-full bg-teal-50 rounded-full flex items-center justify-center text-teal-600">
                   <User className="w-10 h-10" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{profileData.name}</h2>
              <p className="text-sm text-gray-500 mb-6">{profileData.email}</p>
              
              <div className="w-full space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-teal-500" />
                  {isEditing ? (
                    <input type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} className="border-b border-teal-300 focus:outline-none focus:border-teal-600 flex-1 px-1 bg-transparent" />
                  ) : <span>{profileData.email}</span>}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-teal-500" />
                  {isEditing ? (
                    <input type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="border-b border-teal-300 focus:outline-none focus:border-teal-600 flex-1 px-1 bg-transparent" />
                  ) : <span>{profileData.phone}</span>}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-teal-500" />
                  {isEditing ? (
                    <input type="date" value={profileData.dob} onChange={e => setProfileData({...profileData, dob: e.target.value})} className="border-b border-teal-300 focus:outline-none focus:border-teal-600 flex-1 px-1 bg-transparent" />
                  ) : <span>{profileData.dob}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Details and History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" /> Physical Characteristics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-gray-100 text-center">
                <span className="block text-xs text-gray-500 font-medium mb-1">Blood Type</span>
                {isEditing ? (
                   <input type="text" value={profileData.bloodType} onChange={e => setProfileData({...profileData, bloodType: e.target.value})} className="w-full text-center font-bold text-gray-900 bg-transparent border-b border-teal-300 focus:outline-none" />
                ) : <span className="block font-bold text-gray-900 text-lg">{profileData.bloodType}</span>}
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-gray-100 text-center">
                <span className="block text-xs text-gray-500 font-medium mb-1">Height</span>
                {isEditing ? (
                   <input type="text" value={profileData.height} onChange={e => setProfileData({...profileData, height: e.target.value})} className="w-full text-center font-bold text-gray-900 bg-transparent border-b border-teal-300 focus:outline-none" />
                ) : <span className="block font-bold text-gray-900 text-lg">{profileData.height}</span>}
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-gray-100 text-center">
                <span className="block text-xs text-gray-500 font-medium mb-1">Weight</span>
                {isEditing ? (
                   <input type="text" value={profileData.weight} onChange={e => setProfileData({...profileData, weight: e.target.value})} className="w-full text-center font-bold text-gray-900 bg-transparent border-b border-teal-300 focus:outline-none" />
                ) : <span className="block font-bold text-gray-900 text-lg">{profileData.weight}</span>}
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-gray-100 text-center">
                <span className="block text-xs text-gray-500 font-medium mb-1">BMI</span>
                <span className="block font-bold text-gray-900 text-lg">22.8</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
             <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" /> Allergies & Conditions
            </h3>
            <div className="space-y-4">
              <div className="p-4 border border-rose-100 bg-rose-50/50 rounded-xl">
                 <h4 className="font-medium text-rose-800 text-sm mb-2">Known Allergies</h4>
                 <div className="flex flex-wrap gap-2">
                   <span className="px-3 py-1 bg-white border border-rose-200 text-rose-600 rounded-full text-xs font-medium">Penicillin</span>
                   <span className="px-3 py-1 bg-white border border-rose-200 text-rose-600 rounded-full text-xs font-medium">Peanuts</span>
                 </div>
              </div>
              <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl">
                 <h4 className="font-medium text-blue-800 text-sm mb-2">Chronic Conditions</h4>
                 <div className="flex flex-wrap gap-2">
                   <span className="px-3 py-1 bg-white border border-blue-200 text-blue-600 rounded-full text-xs font-medium">Mild Asthma</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
