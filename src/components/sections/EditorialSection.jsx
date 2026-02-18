import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';

const EditorialSection = () => {
  const [featureCards, setFeatureCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await api.homeAssets.getAll();
        const cards = data.find(a => a.key === 'feature_cards')?.value || [];
        setFeatureCards(cards);
      } catch (err) {
        console.error('Failed to load editorial assets', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  if (loading) return null;

  return (
    <section className="bg-transparent py-16 md:py-20 lg:py-24 animate-in fade-in duration-1000">
      <div className="w-full">
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-4 md:gap-8 snap-x snap-mandatory scrollbar-hide px-4 md:px-8 lg:px-12">
          {featureCards.map((item, index) => (
            <a 
              key={index} 
              href={item.link} 
              className="group flex flex-col items-center text-center flex-none w-[75%] sm:w-[45%] lg:w-full snap-center"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[4/5] overflow-hidden mb-6 bg-neutral-50 shadow-sm transition-shadow group-hover:shadow-xl">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              
              {/* Text Content */}
              <h3 className="text-[12px] md:text-sm font-black tracking-[0.3em] uppercase text-neutral-900 mb-4 group-hover:text-neutral-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-[11px] md:text-[13px] text-neutral-500 leading-relaxed max-w-[240px] font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                {item.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EditorialSection;
