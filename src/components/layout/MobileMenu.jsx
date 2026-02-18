import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoCloseOutline, IoChevronForward, IoChevronDown } from 'react-icons/io5';

const MobileMenu = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('WOMENS');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  const navItems = [
    { name: 'RAMADAN COLLECTION', hasSub: true },
    { name: 'CLOTHING', hasSub: true },
    { name: 'HIJABS', hasSub: true },
    { name: 'HIJAB ACCESSORIES', hasSub: true },
    { name: 'WHAT TO WEAR', hasSub: true },
    { name: 'SIGNATURE BAKHOOR', hasSub: false },
    { name: 'OUTLET', hasSub: true },
    { name: 'GIFT CARD', hasSub: false },
    { name: 'LOOKBOOK', hasSub: true },
    { name: 'JOURNAL', hasSub: true },
  ];

  return (
    <div className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>

      {/* Menu Content */}
      <div 
        className={`absolute top-0 left-0 w-[85%] max-w-[320px] h-full bg-[#FAF9F6] shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header - Country Selector */}
        <div className="p-6">
          <button className="flex items-center gap-2.5 group">
            <div className="w-5 h-3.5 overflow-hidden border border-neutral-200">
              <img src="https://flagcdn.com/w40/gb.png" alt="UK" className="w-full h-full object-cover" />
            </div>
            <span className="text-[11px] font-bold tracking-widest text-[#1C1C1C] uppercase">UK</span>
            <IoChevronDown size={14} className="text-neutral-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-8 mb-4 border-b border-neutral-100">
          <button 
            onClick={() => setActiveTab('WOMENS')}
            className={`flex-1 text-center py-4 text-[12px] tracking-[0.2em] font-medium transition-all duration-300 relative ${
              activeTab === 'WOMENS' ? 'text-[#1C1C1C]' : 'text-neutral-400'
            }`}
          >
            WOMENS
            {activeTab === 'WOMENS' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[1.5px] bg-[#1C1C1C]"></div>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('MENS')}
            className={`flex-1 text-center py-4 text-[12px] tracking-[0.2em] font-medium transition-all duration-300 relative ${
              activeTab === 'MENS' ? 'text-[#1C1C1C]' : 'text-neutral-400'
            }`}
          >
            MENS
            {activeTab === 'MENS' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[1.5px] bg-[#1C1C1C]"></div>
            )}
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <div className="space-y-0">
            {navItems.map((item, index) => {
              const customPaths = {
                'LOOKBOOK': '/lookbook',
                'JOURNAL': '/journal'
              };
              const path = customPaths[item.name] || `/collections/${item.name.toLowerCase().replace(/\s+/g, '-')}`;
              
              return (
                <Link
                  key={index}
                  to={path}
                  onClick={onClose}
                  className="flex items-center justify-between py-4.5 border-b border-neutral-100/80 last:border-0 group"
                >
                  <span className="text-[11px] font-bold tracking-[0.1em] text-[#333] group-hover:text-black transition-colors uppercase">
                    {item.name}
                  </span>
                  {item.hasSub && (
                    <IoChevronForward size={14} className="text-neutral-300 group-hover:text-black transition-colors" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Close Button Inside for easier access on mobile */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-black transition-colors p-2"
        >
          <IoCloseOutline size={26} />
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
