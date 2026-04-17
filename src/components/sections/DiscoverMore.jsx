import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { resolveImageUrl } from '../../utils/imageUrl';

const DiscoverMore = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await api.homeAssets.getAll();
        const items = data.find(a => a.key === 'discover_more')?.value || [];
        setBanners(items);
      } catch (err) {
        console.error('Failed to load discover more banners', err);
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
          className="relative w-full group overflow-hidden border-b border-neutral-100 last:border-0"
        >
          <img 
            src={resolveImageUrl(banner.image)}
            alt={banner.title || "Discover More"}
            className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </a>
      ))}
    </section>
  );
};

export default DiscoverMore;
