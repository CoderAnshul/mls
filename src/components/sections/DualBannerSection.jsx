import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { resolveImageUrl } from '../../utils/imageUrl';

const DualBannerSection = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await api.homeAssets.getAll();
        const b = data.find(a => a.key === 'dual_banners')?.value || [];
        setBanners(b);
      } catch (err) {
        console.error('Failed to load dual banners', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  if (loading || banners.length === 0) return null;

  return (
    <section className="w-full flex flex-col p-0 m-0 overflow-hidden animate-in fade-in duration-1000">
      {banners.map((banner, idx) => (
        <a 
          key={idx} 
          href={banner.link} 
          className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] group overflow-hidden border-b border-neutral-100"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: `url(${resolveImageUrl(banner.image)})` }}
          />
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
             <span className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">Discover Collection</span>
          </div>
        </a>
      ))}
    </section>
  );
};

export default DualBannerSection;
