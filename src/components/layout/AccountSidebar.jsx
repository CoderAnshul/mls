import React, { useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AccountSidebar = ({ isOpen, onClose }) => {
  const { user, login, register, logout, isAuthenticated } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (isRegistering) {
      result = await register(formData.name, formData.email, formData.password);
    } else {
      result = await login(formData.email, formData.password);
    }

    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div 
      className={`fixed inset-0 z-[200] transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        className={`absolute top-0 right-0 w-full max-w-[400px] h-full bg-[#F4F2EA] shadow-2xl transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-8 md:p-12">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-[13px] tracking-[0.25em] font-medium uppercase text-[#252423]">
              {isAuthenticated ? 'My Account' : isRegistering ? 'Register' : 'Sign In'}
            </h2>
            <button 
              onClick={onClose}
              className="p-1 -mr-1 hover:opacity-70 transition-opacity"
            >
              <IoCloseSharp className="w-6 h-6 stroke-[1.2px]" />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col">
            {isAuthenticated ? (
              <div className="flex flex-col h-full">
                <div className="mb-10">
                  <p className="text-[11px] tracking-widest text-neutral-500 uppercase mb-2">Logged in as</p>
                  <p className="text-[16px] tracking-widest text-[#252423] font-medium uppercase">{user.name}</p>
                  <p className="text-[12px] tracking-widest text-neutral-500 lowercase mt-1">{user.email}</p>
                </div>
                
                <div className="mt-auto space-y-4">
                  <button 
                    onClick={() => { navigate('/wishlist'); onClose(); }}
                    className="w-full border border-black text-black py-4 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-black hover:text-white transition-all"
                  >
                    My Wishlist
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full bg-[#252423] text-white py-4 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-black transition-all"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[11px] tracking-widest uppercase text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-8">
                  {isRegistering && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#252423]">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-transparent border-b border-black/10 py-2.5 text-[13px] tracking-widest focus:border-black transition-colors outline-none"
                        placeholder="Enter your name"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#252423]">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-transparent border-b border-black/10 py-2.5 text-[13px] tracking-widest focus:border-black transition-colors outline-none"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#252423]">Password</label>
                    <input 
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-transparent border-b border-black/10 py-2.5 text-[13px] tracking-widest focus:border-black transition-colors outline-none"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <div className="mt-auto pt-10">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#252423] text-white py-4 text-[11px] tracking-[0.3em] font-bold uppercase hover:bg-black transition-all mb-6 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Processing...' : isRegistering ? 'Create Account' : 'Sign In'}
                  </button>

                  <button 
                    type="button"
                    onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                    className="w-full text-center text-[10px] tracking-[0.2em] font-bold uppercase text-neutral-500 hover:text-black transition-colors"
                  >
                    {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSidebar;
