import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5';

const Journal = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchVisible]);

  const articles = [
    {
      id: 1,
      title: "HONOURING THE LIGHT WITHIN: THE MEANING BEHIND AAB'S 2026 RAMADAN DESIGNS",
      date: "04 FEB 2026",
      image: "https://aabcollection.com/cdn/shop/articles/Light_Beauty_and_Strength_Header.jpg?v=1706698655&width=800",
      excerpt: "Inspired by women, Aab's Ramadan 2026 Collection: Light, Beauty & Strength weaves together softness, timelessness, and meaning. Join us behind the scenes as we share the detailed embroidery process that brings each piece — and story — to life."
    },
    {
      id: 2,
      title: "DESIGNED FOR THE WOMAN WHO INSPIRES: INTRODUCING LIGHT, BEAUTY, AND STRENGTH",
      date: "28 JAN 2026",
      image: "https://aabcollection.com/cdn/shop/articles/Screen_Shot_2024-01-31_at_12.08.33.png?v=1706703554&width=800",
      excerpt: "This Ramadan, we present a collection to honour women for the light they carry, the beauty they embody, and the strength they hold. Designed with refined silhouettes, intentional construction, and artisan embroidery, this collection is an ode to women."
    },
    {
      id: 3,
      title: "INSIDE AAB'S AW25 EVENT: THE EVENT EVERYONE'S TALKING ABOUT",
      date: "21 OCT 2025",
      image: "https://aabcollection.com/cdn/shop/articles/Inside_Aab_s_AW24_Event_Header.jpg?v=1731670984&width=800",
      excerpt: "Aab's AW25 event at Meet Bros in London celebrated creativity, connection, and craftsmanship. Guests styled the new collection in rich tones and luxe textures, enjoyed the lively Aab-ticulate game, and ended the evening with a cozy candle-lit dinner capturing the spirit of the season."
    }
  ];

  return (
    <div className="bg-[#F4F2EA] min-h-screen pt-8 pb-20 px-4 md:px-8 lg:px-12 transition-all duration-500">
      {/* Breadcrumbs */}
      <div className="max-w-screen-2xl mx-auto mb-12">
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] font-light uppercase text-neutral-500">
          <Link to="/" className="hover:text-black transition-colors">HOME</Link>
          <span>/</span>
          <span className="text-neutral-800">JOURNAL</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="max-w-screen-xl mx-auto text-center mb-16 px-4">
        <h1 className="text-[28px] md:text-[32px] tracking-[0.4em] font-light uppercase mb-6 text-neutral-900">
          JOURNAL
        </h1>
        
        {/* Toggleable Search Interface */}
        <div className="flex flex-col items-center">
          <button 
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            className="p-2 text-neutral-600 hover:text-black transition-colors mb-4"
          >
            <IoSearchOutline size={22} className="stroke-[1.5px]" />
          </button>

          {/* Animated Search Bar Area */}
          <div 
            className={`w-full max-w-[800px] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden ${
              isSearchVisible ? 'max-h-20 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
            }`}
          >
            <div className="relative flex items-center px-4">
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="SEARCH FOR ARTICLES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-neutral-300 pb-2 text-[11px] md:text-[12px] tracking-[0.25em] font-light text-neutral-800 placeholder:text-neutral-400 focus:outline-none transition-colors duration-500 focus:border-neutral-500 uppercase"
              />
              <button 
                onClick={() => {
                  setIsSearchVisible(false);
                  setSearchQuery('');
                }}
                className="absolute right-4 pb-2 text-neutral-400 hover:text-black transition-colors"
                title="Close Search"
              >
                <IoCloseOutline size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {articles.map((article) => (
            <Link key={article.id} to={`/journal/${article.id}`} className="group block text-center">
              {/* Image with hover effect */}
              <div className="aspect-[1.5/1] bg-neutral-200 overflow-hidden mb-8">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Text Content */}
              <div className="px-2">
                <h5 className="text-[13px] md:text-[14px] tracking-[0.15em] font-bold uppercase leading-relaxed mb-2 text-neutral-800 group-hover:text-neutral-600 transition-colors">
                  {article.title}
                </h5>
                
                <p className="text-[10px] tracking-[0.2em] font-light text-neutral-400 uppercase mb-5">
                  {article.date}
                </p>
                
                <p className="text-[13px] md:text-[14px] font-light text-neutral-500 leading-relaxed max-w-sm mx-auto">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Journal;
