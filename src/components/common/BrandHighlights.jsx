import React, { useState, useEffect } from 'react';
import { Truck, MessageCircle, RotateCcw } from 'lucide-react';
import { api } from '../../utils/api';

const BrandHighlights = () => {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const data = await api.homeAssets.getAll();
        const highlights = data.find(a => a.key === 'service_highlights')?.value || [];
        setFeatures(highlights);
      } catch (err) {
        console.error('Failed to fetch highlights', err);
      }
    };
    fetchHighlights();
  }, []);

  const getFeatureIcon = (title) => {
    if (!title) return null;
    const upTitle = title.toUpperCase();
    if (upTitle.includes('DELIVERY')) return <Truck size={24} strokeWidth={1.5} />;
    if (upTitle.includes('SUPPORT') || upTitle.includes('WHATSAPP')) return <MessageCircle size={24} strokeWidth={1.5} />;
    if (upTitle.includes('RETURNS')) return <RotateCcw size={24} strokeWidth={1.5} />;
    return <Truck size={24} strokeWidth={1.5} />;
  };

  if (features.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 border-t border-neutral-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {features.map((feature, idx) => (
          <div key={idx} className="flex flex-col items-center group">
            <div className="mb-6 text-neutral-800 group-hover:scale-110 transition-transform duration-500">
              {getFeatureIcon(feature.title)}
            </div>
            <h4 className="text-[12px] font-black tracking-[0.2em] mb-3 text-neutral-900 uppercase">
              {feature.title}
            </h4>
            <p className="text-[11px] text-neutral-500 uppercase tracking-widest leading-relaxed max-w-[200px]">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandHighlights;
