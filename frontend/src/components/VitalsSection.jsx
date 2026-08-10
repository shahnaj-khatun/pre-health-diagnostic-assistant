import React, { useState, useEffect } from 'react';
import { HeartPulse, Activity, Thermometer, Wind, Plus, Loader2, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import TiltCard from './TiltCard';

export default function VitalsSection() {
    const [vitalsHistory, setVitalsHistory] = useState([]);
    const [latestVitals, setLatestVitals] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    const [formData, setFormData] = useState({
        systolic: '',
        diastolic: '',
        heartRate: '',
        temperature: ''
    });

    useEffect(() => {
        fetchVitals();
    }, []);

    const fetchVitals = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const [latestRes, historyRes] = await Promise.all([
                fetch('/api/vitals/latest', { headers: { 'x-auth-token': token } }),
                fetch('/api/vitals/history', { headers: { 'x-auth-token': token } })
            ]);

            if (latestRes.ok && historyRes.ok) {
                const latestData = await latestRes.json();
                const historyData = await historyRes.json();
                setLatestVitals(latestData);
                setVitalsHistory(historyData);
            } else {
                throw new Error('Failed to fetch vitals data');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                bloodPressure: {
                    systolic: Number(formData.systolic),
                    diastolic: Number(formData.diastolic)
                },
                heartRate: Number(formData.heartRate),
                temperature: Number(formData.temperature)
            };

            const res = await fetch('/api/vitals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setFormData({ systolic: '', diastolic: '', heartRate: '', temperature: '' });
                setShowForm(false);
                fetchVitals(); // Refresh data
            } else {
                throw new Error('Failed to save vitals');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Helper to get status color based on medical thresholds
    const getBPStatus = (systolic, diastolic) => {
        if (systolic < 120 && diastolic < 80) return { label: 'Normal', color: 'text-green-500', bg: 'bg-green-100' };
        if (systolic >= 130 || diastolic >= 80) return { label: 'High', color: 'text-red-500', bg: 'bg-red-100' };
        return { label: 'Elevated', color: 'text-orange-500', bg: 'bg-orange-100' };
    };

    const getHRStatus = (hr) => {
        if (hr >= 60 && hr <= 100) return { label: 'Normal', color: 'text-green-500', bg: 'bg-green-100' };
        if (hr > 100) return { label: 'High', color: 'text-red-500', bg: 'bg-red-100' };
        return { label: 'Low', color: 'text-blue-500', bg: 'bg-blue-100' };
    };

    const getTempStatus = (temp) => {
        if (temp >= 97 && temp <= 99) return { label: 'Normal', color: 'text-green-500', bg: 'bg-green-100' };
        if (temp > 100.4) return { label: 'Fever', color: 'text-red-500', bg: 'bg-red-100' };
        return { label: 'Check', color: 'text-orange-500', bg: 'bg-orange-100' };
    };


    const formatChartData = () => {
        return vitalsHistory.map(v => ({
            ...v,
            systolic: v.bloodPressure?.systolic,
            diastolic: v.bloodPressure?.diastolic,
            date: format(new Date(v.timestamp), 'MMM dd, HH:mm')
        }));
    };

    if (loading) {
        return <div className="flex justify-center items-center py-12"><Loader2 className="animate-spin text-indigo-600 w-8 h-8" /></div>;
    }

    return (
        <div className="space-y-6 mt-8">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Health Vitals</h3>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Record Vitals
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Systolic BP</label>
                        <input type="number" required value={formData.systolic} onChange={e => setFormData({...formData, systolic: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="120" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Diastolic BP</label>
                        <input type="number" required value={formData.diastolic} onChange={e => setFormData({...formData, diastolic: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="80" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Heart Rate (bpm)</label>
                        <input type="number" required value={formData.heartRate} onChange={e => setFormData({...formData, heartRate: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="72" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Temp (°F)</label>
                        <input type="number" step="0.1" required value={formData.temperature} onChange={e => setFormData({...formData, temperature: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" placeholder="98.6" />
                    </div>

                    <div className="lg:col-span-5 flex justify-end gap-3 mt-2">
                        <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Cancel</button>
                        <button type="submit" disabled={submitting} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50">
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Save Vitals
                        </button>
                    </div>
                </form>
            )}

            {latestVitals ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Blood Pressure Card */}
                        <TiltCard>
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-rose-50 dark:bg-rose-900/30 rounded-xl text-rose-500">
                                        <HeartPulse className="w-6 h-6" />
                                    </div>
                                    {(() => {
                                        const status = getBPStatus(latestVitals.bloodPressure?.systolic, latestVitals.bloodPressure?.diastolic);
                                        return <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${status.bg} ${status.color}`}>{status.label}</span>;
                                    })()}
                                </div>
                                <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Blood Pressure</h4>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{latestVitals.bloodPressure?.systolic}/{latestVitals.bloodPressure?.diastolic}</span>
                                    <span className="text-sm text-gray-500">mmHg</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-3">{format(new Date(latestVitals.timestamp), 'MMM dd, yyyy - HH:mm')}</p>
                            </div>
                        </TiltCard>

                        {/* Heart Rate Card */}
                        <TiltCard>
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-xl text-orange-500">
                                        <Activity className="w-6 h-6" />
                                    </div>
                                    {(() => {
                                        const status = getHRStatus(latestVitals.heartRate);
                                        return <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${status.bg} ${status.color}`}>{status.label}</span>;
                                    })()}
                                </div>
                                <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Heart Rate</h4>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{latestVitals.heartRate}</span>
                                    <span className="text-sm text-gray-500">bpm</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-3">{format(new Date(latestVitals.timestamp), 'MMM dd, yyyy - HH:mm')}</p>
                            </div>
                        </TiltCard>

                        {/* Temperature Card */}
                        <TiltCard>
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group hover:shadow-md transition-all h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-amber-500">
                                        <Thermometer className="w-6 h-6" />
                                    </div>
                                    {(() => {
                                        const status = getTempStatus(latestVitals.temperature);
                                        return <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${status.bg} ${status.color}`}>{status.label}</span>;
                                    })()}
                                </div>
                                <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Temperature</h4>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{latestVitals.temperature}</span>
                                    <span className="text-sm text-gray-500">°F</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-3">{format(new Date(latestVitals.timestamp), 'MMM dd, yyyy - HH:mm')}</p>
                            </div>
                        </TiltCard>


                    </div>

                    {/* Vitals Graph */}
                    {vitalsHistory.length > 1 && (
                        <TiltCard>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Vitals History</h4>
                                <div className="h-80 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={formatChartData()} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#9ca3af" />
                                            <YAxis yAxisId="left" tick={{fontSize: 12}} stroke="#9ca3af" />
                                            <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12}} stroke="#9ca3af" />
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                                            />
                                            <Legend />
                                            <Line yAxisId="left" type="monotone" dataKey="systolic" name="Systolic BP" stroke="#f43f5e" strokeWidth={2} activeDot={{ r: 6 }} />
                                            <Line yAxisId="left" type="monotone" dataKey="diastolic" name="Diastolic BP" stroke="#fb923c" strokeWidth={2} />
                                            <Line yAxisId="right" type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#8b5cf6" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </TiltCard>
                    )}
                </>
            ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
                    <Activity className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No vitals recorded yet. Click "Record Vitals" to add your first entry.</p>
                </div>
            )}
        </div>
    );
}
