import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    newsletter: false
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = true;
    if (!formData.lastName) newErrors.lastName = true;
    if (!formData.email) newErrors.email = true;
    if (!formData.password) newErrors.password = true;
    if (!formData.confirmPassword) newErrors.confirmPassword = true;
    
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);

    const fullName = `${formData.firstName} ${formData.lastName}`;
    const result = await register(fullName, formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="bg-[#F4F2EA] min-h-screen pt-12 pb-24 px-4">
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
        <h2 className="text-[20px] md:text-[24px] md:text-[28px] tracking-[0.3em] font-medium uppercase text-[#252423] mb-4">
          Create Account
        </h2>
        <p className="text-[14px] tracking-[0.1em] text-[#252423]/60 leading-relaxed max-w-[450px] mx-auto">
          Registering makes checkout fast and easy for all future visits and saves all your orders in one place.
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-[500px] mx-auto px-4 sm:px-0">
        <div className="bg-[#F4F2EA] border border-black/60 p-8 md:p-12">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] tracking-widest uppercase text-center font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full bg-white border border-black/60 px-4 py-2.5 text-[13px] tracking-widest focus:border-black transition-colors outline-none"
                placeholder="FIRST NAME"
              />
              {fieldErrors.firstName && (
                <p className="text-[#8B0000] text-[8px] tracking-[0.1em] uppercase">This field is required</p>
              )}
            </div>

            <div className="space-y-1">
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full bg-white border border-black/60 px-4 py-2.5 text-[13px] tracking-widest focus:border-black transition-colors outline-none"
                placeholder="LAST NAME"
              />
              {fieldErrors.lastName && (
                <p className="text-[#8B0000] text-[8px] tracking-[0.1em] uppercase">This field is required</p>
              )}
            </div>

            <div className="space-y-1">
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-white border border-black/60 px-4 py-2.5 text-[13px] tracking-widest focus:border-black transition-colors outline-none"
                placeholder="EMAIL ADDRESS"
              />
              {fieldErrors.email && (
                <p className="text-[#8B0000] text-[8px] tracking-[0.1em] uppercase">This field is required</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
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
                <p className="text-[#8B0000] text-[8px] tracking-[0.1em] uppercase">This field is required</p>
              )}
            </div>

            <div className="space-y-1 mb-2">
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-black/60 px-4 py-2.5 text-[13px] tracking-widest focus:border-black transition-colors outline-none"
                  placeholder="CONFIRM PASSWORD"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors"
                >
                  {showConfirmPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-[#8B0000] text-[8px] tracking-[0.1em] uppercase">This field is required</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                name="newsletter"
                id="newsletter"
                checked={formData.newsletter}
                onChange={handleInputChange}
                className="w-4 h-4 border-black/60 rounded-none checked:bg-black accent-black cursor-pointer"
              />
              <label htmlFor="newsletter" className="text-[12px] tracking-[0.15em] font-light uppercase text-[#252423] cursor-pointer">
                I would like to receive the newsletter
              </label>
            </div>

            <div className="pt-6 space-y-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#252423] text-white py-4 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-black transition-all disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-[1px] bg-black/10"></div>
                <span className="text-[10px] tracking-[0.2em] font-bold text-[#252423]/40 uppercase">Or</span>
                <div className="flex-1 h-[1px] bg-black/10"></div>
              </div>

              <Link 
                to="/account/login"
                className="block w-full border border-black text-[#252423] py-4 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-black hover:text-white transition-all text-center"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
