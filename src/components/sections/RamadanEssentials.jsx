import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { resolveImageUrl } from '../../utils/imageUrl';

const RamadanEssentials = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await api.homeAssets.getAll();
        const items = data.find(a => a.key === 'ramadan_essentials')?.value || [];
        setCategories(items);
      } catch (err) {
        console.error('Failed to load ramadan assets', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  if (loading || categories.length === 0) return null;

  return (
    <section className="bg-[#f8f5f0] py-16 px-4 md:px-8 lg:px-12 animate-in fade-in duration-1000">
      <div className="max-w-screen-2xl mx-auto">
        {/* Section Title */}
        <h2 className="text-center text-[10px] md:text-sm font-black tracking-[0.4em] uppercase text-neutral-800 mb-12 opacity-60">
          SHOP RAMADAN ESSENTIALS
        </h2>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {categories.map((category, idx) => (
            <a 
              key={idx} 
              href={category.link} 
              className="group flex flex-col items-center"
            >
              {/* Image Wrapper */}
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-100 shadow-sm transition-all group-hover:shadow-2xl">
                <img 
                  src={resolveImageUrl(category.image)} 
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              
              {/* Caption */}
              <span className="mt-6 text-[10px] md:text-xs font-black tracking-[0.3em] uppercase text-neutral-500 transition-all group-hover:text-black group-hover:tracking-[0.4em]">
                {category.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RamadanEssentials;
