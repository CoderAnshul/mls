import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';

const HeroSection = () => {
  const [assets, setAssets] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await api.homeAssets.getAll();
        const assetMap = data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
        setAssets(assetMap);
      } catch (err) {
        console.error('Failed to load hero assets', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  if (loading) return <div className="h-[80vh] md:h-screen bg-neutral-100 flex items-center justify-center uppercase tracking-widest text-[10px] font-bold">Syncing Collection...</div>;

  return (
    <section className="relative h-[80vh] md:h-screen -mt-[110px] overflow-hidden group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={assets.hero_banner || "/images/hero/hero-banner.jpg"}
          alt="Premium Collection"
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
     
      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
         <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter uppercase text-center max-w-5xl leading-[0.9] animate-in fade-in slide-in-from-bottom-10 duration-1000">
           {assets.hero_text}
         </h1>
         {assets.hero_link && (
           <Link 
            to={assets.hero_link}
            className="mt-8 px-8 py-3 bg-white text-black text-[12px] font-black uppercase tracking-[0.2em] hover:bg-neutral-800 hover:text-white transition-all duration-500 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300"
           >
             Shop the collection
           </Link>
         )}
      </div>
      
      {/* Bottom URL */}
      <div className="absolute bottom-4 left-4 text-white text-[10px] opacity-40 uppercase tracking-widest font-black">
        Matrix Identity: {assets.hero_link || '/collections/new_arrivals'}
      </div>
    </section>
  );
};

export default HeroSection;
