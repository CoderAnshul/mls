import React, { useEffect, useRef } from 'react';
import { IoCloseSharp } from 'react-icons/io5';

const SearchOverlay = ({ isOpen, onClose }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 400);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-black/20" 
        onClick={onClose}
      />
      <div className="absolute top-0 left-0 w-full bg-[#F4F2EA] flex items-center h-[74px] px-8 animate-in slide-in-from-top duration-500 ease-out">
        <div className="w-full relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="SEARCH..."
            className="w-full bg-transparent border-none outline-none text-[15px] tracking-[0.2em] font-light placeholder:text-neutral-500 uppercase"
            style={{ fontFamily: 'var(--font-primary, sans-serif)' }}
          />
          <button 
            onClick={onClose}
            className="p-2 -mr-2 hover:opacity-70 transition-opacity"
          >
            <IoCloseSharp className="w-6 h-6 stroke-[1px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
