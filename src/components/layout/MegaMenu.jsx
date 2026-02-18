import React from 'react';
import { Link } from 'react-router-dom';

const MegaMenu = ({ data, isVisible, onClose }) => {
  if (!data) return null;

  return (
    <div 
      className={`absolute top-full left-0 w-full bg-[#F4F2EA] border-t border-neutral-200/60 shadow-2xl transition-all duration-500 ease-in-out origin-top z-40 ${
        isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-8 py-12">
        <div className="flex gap-16">
          {/* Links Columns */}
          <div className="flex-1 flex gap-12">
            {data.columns?.map((column, idx) => (
              <div key={idx} className="flex-1 min-w-[200px]">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-800 mb-8 pb-4 border-b border-neutral-300/40">
                  {column.title}
                </h3>
                <ul className="space-y-4">
                  {column.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link 
                        to={link.href} 
                        className="text-[13px] text-neutral-600 hover:text-black transition-colors duration-300 font-normal block"
                        onClick={onClose}
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Feature Cards */}
          <div className="flex gap-6 shrink-0 h-[400px]">
            {data.features?.map((feature, fIdx) => (
              <Link 
                key={fIdx} 
                to={feature.link}
                className="group relative w-[280px] h-full overflow-hidden cursor-pointer"
                onClick={onClose}
              >
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 flex flex-col justify-end p-8 text-center">
                  <h4 className="text-white text-2xl font-serif italic mb-4">
                    {feature.title}
                  </h4>
                  <div className="flex justify-center">
                    <span className="text-white text-[11px] uppercase tracking-[0.2em] border-b border-white pb-1 font-medium group-hover:pb-2 transition-all">
                      SHOP NOW
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
