import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { userAPI } from '../services/api';

// Floating Label Input Component
const FloatingInput = ({ label, name, value, onChange, type = 'text', required = false }) => {
  const hasValue = value && value.length > 0;
  
  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        required={required}
        className={`peer w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl 
          focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 
          font-montserrat text-base md:text-lg transition-all text-white placeholder-transparent shadow-lg
          ${hasValue ? 'pt-5 pb-2' : ''}`}
      />
      <label 
        className={`absolute left-4 transition-all duration-200 pointer-events-none font-montserrat
          text-white/70 
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base
          peer-focus:top-1 peer-focus:text-xs peer-focus:text-primary
          ${hasValue ? 'top-1 text-xs text-primary' : 'top-3.5 text-base'}`}
      >
        {label}{required && ' *'}
      </label>
    </div>
  );
};

// Floating Label Textarea Component
const FloatingTextarea = ({ label, name, value, onChange, rows = 3 }) => {
  const hasValue = value && value.length > 0;
  
  return (
    <div className="relative">
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        rows={rows}
        className={`peer w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl 
          focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 
          font-montserrat text-base md:text-lg transition-all resize-none text-white placeholder-transparent shadow-lg
          ${hasValue ? 'pt-5 pb-2' : ''}`}
      />
      <label 
        className={`absolute left-4 transition-all duration-200 pointer-events-none font-montserrat
          text-white/70 
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base
          peer-focus:top-1 peer-focus:text-xs peer-focus:text-primary
          ${hasValue ? 'top-1 text-xs text-primary' : 'top-3.5 text-base'}`}
      >
        {label}
      </label>
    </div>
  );
};

const Account = () => {
  const { user, loading: authLoading, getToken } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    address: '',
    state: '',
    country: 'India',
    pincode: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const token = await getToken();
        if (!token) return;
        
        const response = await userAPI.getProfile(token);
        if (response.success && response.user) {
          setFormData({
            name: response.user.name || '',
            mobileNumber: response.user.mobileNumber || '',
            address: response.user.address || '',
            state: response.user.state || '',
            country: response.user.country || 'India',
            pincode: response.user.pincode || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setMessage({ type: 'error', text: 'Failed to load profile' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, getToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Name is required' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await userAPI.updateProfile(token, formData);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[url('/Background.avif')] bg-cover bg-center bg-no-repeat flex items-center justify-center pt-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary relative z-10 drop-shadow-lg" />
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      {/* Page Background with Background.avif - NO OVERLAY */}
      <div className="min-h-screen bg-[url('/Background.avif')] bg-cover bg-center bg-no-repeat relative pt-16">
        
        {/* Content */}
        <div className="relative z-10 py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-3 sm:mb-4 drop-shadow-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm sm:text-base font-medium font-montserrat">Back</span>
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-primary font-rubik drop-shadow-lg">My Account</h1>
              <p className="text-primary/80 mt-1 font-montserrat text-sm md:text-base drop-shadow-md">Manage your profile information</p>
            </div>

            {/* Profile Card with ProfileBg.avif Inside - NO OVERLAY */}
            <div className="relative rounded-2xl shadow-2xl overflow-hidden">
              {/* Profile Card Background Image - FULL COVERAGE */}
              <div className="absolute inset-0 bg-[url('/ProfileBg.avif')] bg-cover bg-center" />
              
              {/* Card Content */}
              <div className="relative z-10 p-4 sm:p-6 md:p-8">
                {/* User Info Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-white/30">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-lg sm:text-xl md:text-2xl font-bold drop-shadow-lg">
                      {formData.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-white font-rubik truncate drop-shadow-lg">{formData.name || 'User'}</h2>
                    <p className="text-white/90 font-montserrat text-sm sm:text-base truncate drop-shadow-md">{user.email}</p>
                  </div>
                </div>

                {/* Message - Color matches Save Changes button */}
                {message.text && (
                  <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl text-sm font-semibold font-montserrat flex items-center gap-2 ${
                    message.type === 'success' 
                      ? 'bg-primary/20 text-primary border border-primary/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-400/30'
                  }`}>
                    {message.text}
                  </div>
                )}

                {/* Form with Floating Labels - NO ICONS */}
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  {/* Grid Layout - 2 columns on desktop */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    {/* Name */}
                    <FloatingInput
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />

                    {/* Mobile Number */}
                    <FloatingInput
                      label="Mobile Number"
                      name="mobileNumber"
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Address - Full Width */}
                  <FloatingTextarea
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                  />

                  {/* State & Country Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    {/* State */}
                    <FloatingInput
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    />

                    {/* Country */}
                    <FloatingInput
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Pincode - Half Width on Desktop */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    <FloatingInput
                      label="Pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 sm:pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-montserrat text-sm sm:text-base shadow-lg shadow-primary/25"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Account;
