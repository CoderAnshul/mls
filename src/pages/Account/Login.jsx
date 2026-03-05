import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e, setter, fieldName) => {
    setter(e.target.value);
    setError('');
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = true;
    if (!password) newErrors.password = true;
    
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="bg-[#F4F2EA] h-screen pt-12 pb-24 px-4">
      {/* Breadcrumb */}
      <div className="max-w-[1200px] mx-auto mb-16">
        <nav className="text-[10px] tracking-[0.2em] uppercase text-[#252423]/60 font-bold">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span>Account</span>
        </nav>
      </div>

      {/* Title */}
      <h2 className="text-center text-[20px] md:text-[24px] md:text-[28px] tracking-[0.3em] font-medium uppercase text-[#252423] mb-8">
        Sign In
      </h2>

      {/* Form Container */}
      <div className="max-w-[500px] mx-auto">
        <div className="bg-[#F4F2EA] border border-black/60 p-8 md:p-12">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] tracking-widest uppercase text-center font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <input 
                type="email" 
                value={email}
                onChange={(e) => handleInputChange(e, setEmail, 'email')}
                className="w-full bg-white border border-black/60 px-4 py-2.5 text-[13px] tracking-widest focus:border-black transition-colors outline-none"
                placeholder="EMAIL"
              />
              {fieldErrors.email && (
                <p className="text-[#8B0000] text-[11px] tracking-[0.1em] uppercase">This field is required</p>
              )}
            </div>

            <div className='!mb-0 space-y-1'>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handleInputChange(e, setPassword, 'password')}
                  className="w-full bg-white border border-black/60 px-4 py-2.5 text-[13px] tracking-widest focus:border-black transition-colors outline-none"
                  placeholder="PASSWORD"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                >
                  {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[#8B0000] text-[11px] tracking-[0.1em] uppercase">This field is required</p>
              )}
            </div>

            <div >
              <Link 
                to="/account/forgot-password"
                className="text-[13px] tracking-[0.2em] mt-2 font-bold uppercase text-[#252423]/60 hover:text-black transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="pt-6 space-y-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#252423] text-white py-4 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-black transition-all disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-[1px] bg-black/10"></div>
                <span className="text-[10px] tracking-[0.2em] font-bold text-[#252423]/40 uppercase">Or</span>
                <div className="flex-1 h-[1px] bg-black/10"></div>
              </div>

              <Link 
                to="/account/register"
                className="block w-full border border-black text-[#252423] py-4 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-black hover:text-white transition-all text-center"
              >
                Create a new account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
