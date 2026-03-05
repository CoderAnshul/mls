import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AccountLayout = ({ title, breadcrumbLabel, children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { label: 'Orders', path: '/account/orders' },
    { label: 'My Details', path: '/account/details' },
  ];

  return (
    <div className="bg-[#F4F2EA] min-h-screen pt-12 pb-24 px-4">
      {/* Breadcrumb */}
      <div className="max-w-[1200px] mx-auto mb-10">
        <nav className="text-[10px] tracking-[0.2em] uppercase text-[#252423]/60 font-bold">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/account/orders" className="hover:text-black transition-colors">Account</Link>
          <span className="mx-2">/</span>
          <span>{breadcrumbLabel || title}</span>
        </nav>
      </div>

      {/* Page Title */}
      <h1 className="text-center text-[20px] md:text-[24px] tracking-[0.4em] font-medium uppercase text-[#252423] mb-8">
        {title}
      </h1>

      {/* Tab Navigation */}
      <nav className="flex items-center justify-center gap-8 mb-12">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`text-[11px] tracking-[0.2em] uppercase font-bold transition-colors pb-0.5 ${
                isActive
                  ? 'text-[#252423] border-b border-[#252423]'
                  : 'text-[#252423]/50 hover:text-[#252423]'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
        <button
          onClick={handleSignOut}
          className="text-[11px] tracking-[0.2em] uppercase font-bold text-[#252423]/50 hover:text-[#252423] transition-colors"
        >
          Sign Out
        </button>
      </nav>

      {/* Page Content */}
      <div className="max-w-[800px] mx-auto">
        {children}
      </div>
    </div>
  );
};

export default AccountLayout;
