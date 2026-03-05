import React, { useState, useEffect } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';

const AccountSidebar = ({ isOpen, onClose }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div 
      className={`fixed inset-0 z-[99] transition-opacity duration-300 ${
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
        className={`absolute top-0 right-0 w-full max-w-[400px] h-full bg-[#F3F2EA] shadow-2xl transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-8 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <h5 className="text-lg tracking-[0.2em] font-medium uppercase text-[#252423]">
              My Account
            </h5>
            <button 
              onClick={onClose}
              className="p-1 -mr-1 hover:opacity-70 transition-opacity text-black"
            >
              <IoCloseSharp className="w-6 h-6 font-light opacity-50" />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col pt-4 border-t border-black/5">
            {isAuthenticated ? (
              /* Authenticated View (5th Screenshot) */
              <div className="flex flex-col h-full">
                <div className="mb-10 text-center pt-4">
                  <p className="text-[13px] tracking-[0.05em] text-[#252423] mb-1">
                    <span className="italic font-light">{getGreeting()}, </span>
                    <span className="underline cursor-pointer hover:text-black/70 transition-colors">{user?.name?.split(' ')[0] || 'Guest'}!</span>
                  </p>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => handleNavigate('/account/orders')}
                    className="w-full bg-[#252423] text-white py-4 text-[11px] tracking-[0.3em] font-bold uppercase transition-all hover:bg-black"
                  >
                    My Orders
                  </button>
                  <button 
                    onClick={() => handleNavigate('/account/details')}
                    className="w-full bg-[#252423] text-white py-4 text-[11px] tracking-[0.3em] font-bold uppercase transition-all hover:bg-black"
                  >
                    My Details
                  </button>

                  <button 
                    onClick={() => handleNavigate('/wishlist')}
                    className="w-full bg-[#252423] text-white py-4 text-[11px] tracking-[0.3em] font-bold uppercase transition-all hover:bg-black"
                  >
                    My Wishlist ({wishlist.length})
                  </button>
                </div>

                <div className="mt-10 text-center">
                  <button 
                    onClick={handleLogout}
                    className="text-[10px] tracking-[0.3em] font-bold uppercase text-[#252423]/60 hover:text-black transition-all border-b border-transparent hover:border-black/20 pb-0.5"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              /* Landing Options View (Redirect to full pages) */
              <div className="flex flex-col h-full">
                <div className="mb-10 text-center pt-8">
                  <p className="text-[12px] tracking-[0.1em] text-neutral-500 text-center font-light">
                    You are not logged in
                  </p>
                </div>
                
                <div className="space-y-4">
                  <button 
                    onClick={() => handleNavigate('/account/login')}
                    className="w-full bg-[#252423] text-white py-4 text-[11px] tracking-[0.3em] font-bold uppercase transition-all hover:bg-black"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => handleNavigate('/wishlist')}
                    className="w-full bg-[#252423] text-white py-4 text-[11px] tracking-[0.3em] font-bold uppercase transition-all hover:bg-black"
                  >
                    My Wishlist ({wishlist.length})
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSidebar;
