import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, Mail, Lock, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: 'Male',
    phone: '',
    emergencyContact: ''
  });
  
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    const result = await register(
      `${formData.firstName} ${formData.lastName}`,
      formData.email,
      formData.password
    );

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-[#f8fbff] px-4 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-2">HealthAI Diagnostic System</h1>
        <p className="text-[#64748b]">Your personal AI-powered health assistant for symptom analysis and treatment guidance</p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-8 border border-gray-100 mb-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#0f172a] mb-1">Create Account</h2>
          <p className="text-[#64748b] text-sm">Join our health diagnostic platform</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-1.5">First Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  name="firstName"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-1.5">Last Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  name="lastName"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0f172a] mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="email" 
                name="email"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="password" 
                  name="password"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-1.5">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="password" 
                  name="confirmPassword"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-1.5">Date of Birth</label>
              <div className="relative">
                <input 
                  type="date" 
                  name="dob"
                  className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-1.5">Gender</label>
              <select
                name="gender"
                className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm bg-white"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-1.5">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="tel" 
                  name="phone"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-1.5">Emergency Contact</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input 
                  type="tel" 
                  name="emergencyContact"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                  placeholder="Emergency contact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-bold text-white bg-[#16a34a] hover:bg-green-700 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors mt-8"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-[#64748b]">Already have an account? </span>
          <Link to="/login" className="font-medium text-green-600 hover:text-green-500">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
