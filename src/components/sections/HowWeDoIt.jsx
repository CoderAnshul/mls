import React from 'react';

const HowWeDoIt = () => {
  const pillars = [
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black/80">
          <path d="M10 25H18M10 29H18M10 21V33.4C10 34.2837 10.7163 35 11.6 35H16.4C17.2837 35 18 34.2837 18 33.4V21M10 21L14 17L18 21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M25 15C25 15 25 21 25 21M31 15C31 15 31 21 31 21M22 21H34V35H22V21Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 13V15M30 13V15M10 10H30" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'DIRECT TO CONSUMER'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black/80">
          <path d="M17 1V5M17 5C14 5 13 7 13 10V14C11 15 9 17 9 20V26C9 28 10 32 17 32C24 32 25 28 25 26V20C25 17 23 15 21 14V10C21 7 20 5 17 5Z" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M12 32L10 41M22 32L24 41" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
      ),
      label: 'DESIGNED IN HOUSE'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black/80">
          <path d="M10 20V32H30V20M10 20H15L17 15H23L25 20H30M10 20H30" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="20" cy="23" r="3" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M30 20L32 15M8 20L6 15" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
      ),
      label: 'NO MASS PRODUCTION'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black/80">
          <path d="M8 32V20L10 14H30L32 20V32H8Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 32V24H20V32" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="24" y="24" width="4" height="4" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
      ),
      label: 'SUPPORTING SMALL FACTORIES'
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black/80">
          <path d="M6 10H34V30H6V10Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 30L8 34H32L30 30" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 16H26V24H14V16Z" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M14 20L20 16L26 20" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
      ),
      label: 'ONLINE & CONCESSIONS'
    }
  ];

  return (
    <section className="py-4 px-4 bg-[#F4F2EA] border-t border-black/5">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-center text-[15px] font-bold tracking-[0.3em] uppercase mb-4 text-[#252423]">
          HOW WE DO IT
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-16 gap-x-4">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="flex flex-col items-center gap-8 text-center px-2">
              <div className="h-24 flex items-center justify-center">
                {pillar.icon}
              </div>
              <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-[#252423] leading-relaxed max-w-[140px]">
                {pillar.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeDoIt;
