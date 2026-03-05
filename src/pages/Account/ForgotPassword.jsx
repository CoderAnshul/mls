import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    setError('');
    if (fieldErrors.email) {
      setFieldErrors(prev => ({ ...prev, email: false }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = true;
    
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    setError('');
    
    try {
      await api.auth.forgotPassword(email);
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F4F2EA] h-screen pt-8 pb-24 px-4">
      {/* Breadcrumb */}
      <div className="max-w-[1200px] mx-auto mb-16">
        <nav className="text-[10px] tracking-[0.2em] uppercase text-[#252423]/60 font-bold">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span>Account</span>
        </nav>
      </div>

      {/* Title & Description */}
      <div className="text-center mb-10 max-w-[600px] mx-auto">
        <h2 className="text-[20px] md:text-[24px] md:text-[28px] tracking-[0.4em] font-medium uppercase text-[#252423] mb-3">
          Recover Your Password
        </h2>
        <p className="text-[14px] tracking-[0.1em] text-[#252423]/60 leading-relaxed max-w-[450px] mx-auto">
          We will send you an email to reset your password.
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-[500px] mx-auto px-4 sm:px-0">
        <div className="bg-[#F4F2EA] border border-black/60 p-8 md:p-12">
          {success ? (
            <div className="text-center py-8">
              <p className="text-[13px] tracking-widest text-emerald-600 font-bold uppercase mb-8">
                Recovery email sent successfully.
              </p>
              <Link 
                to="/account/login"
                className="inline-block w-full bg-[#252423] text-white py-4 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-black transition-all"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] tracking-widest uppercase text-center font-bold">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <input 
                  type="email" 
                  value={email}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-black/60 px-4 py-2.5 text-[13px] tracking-widest focus:border-black transition-colors outline-none"
                  placeholder="EMAIL"
                />
                {fieldErrors.email && (
                  <p className="text-[#8B0000] text-[11px] tracking-[0.1em] uppercase">This field is required</p>
                )}
              </div>

              <div className="pt-6 space-y-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#252423] text-white py-4 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-black transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Recover Password'}
                </button>

                <Link 
                  to="/account/login"
                  className="block w-full border border-black text-[#252423] py-4 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-black hover:text-white transition-all text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
