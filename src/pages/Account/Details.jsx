import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AccountLayout from './AccountLayout';
import { api } from '../../utils/api';
import { useToast } from '../../components/common/Toast';

const Details = () => {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      toast.show('PASSWORDS DO NOT MATCH', 'error');
      return;
    }

    setLoading(true);
    try {
      const updateData = { name };
      if (password) updateData.password = password;

      const updatedUser = await api.user.updateProfile(updateData);
      
      // Update local storage and context
      const userData = JSON.parse(localStorage.getItem('user'));
      const newUserData = { ...userData, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
      
      toast.show('DETAILS UPDATED SUCCESSFULLY', 'success');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.show(error?.response?.data?.message || 'UPDATE FAILED', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccountLayout title="My Details" breadcrumbLabel="Details">
      <form onSubmit={handleUpdate} className="space-y-10 max-w-xl">
        {/* Full Name */}
        <div>
          <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#252423] mb-3 block">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-black/10 bg-transparent px-4 py-4 text-[12px] tracking-[0.15em] uppercase outline-none focus:border-black/30 transition-colors"
            required
            placeholder="ENTER YOUR FULL NAME"
          />
        </div>

        {/* Email - Read Only */}
        <div>
          <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#252423] mb-3 block opacity-50">
            Email Address (READ ONLY)
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full border border-black/5 bg-black/[0.02] px-4 py-4 text-[12px] tracking-[0.15em] uppercase outline-none cursor-not-allowed text-[#252423]/50"
          />
        </div>

        {/* Password Section */}
        <div className="pt-4">
          <h3 className="text-[11px] tracking-[0.25em] uppercase font-bold text-[#252423] mb-8 border-b border-black/10 pb-2">
            Change Password
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#252423] mb-3 block">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-black/10 bg-transparent px-4 py-4 text-[12px] tracking-[0.15em] uppercase outline-none focus:border-black/30 transition-colors"
                placeholder="LEAVE BLANK TO KEEP CURRENT"
              />
            </div>

            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#252423] mb-3 block">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-black/10 bg-transparent px-4 py-4 text-[12px] tracking-[0.15em] uppercase outline-none focus:border-black/30 transition-colors"
                placeholder="RE-ENTER NEW PASSWORD"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#252423] text-white text-[12px] tracking-[0.3em] font-bold py-5 hover:bg-black transition-colors ${
              loading ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            {loading ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
          </button>
        </div>
      </form>
    </AccountLayout>
  );
};

export default Details;
