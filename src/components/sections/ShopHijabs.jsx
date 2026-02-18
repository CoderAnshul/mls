import React, { useState, useEffect } from 'react';
import CategoryCard from '../ui/CategoryCard';
import { api } from '../../utils/api';

const ShopHijabs = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await api.homeAssets.getAll();
        const hijabAsset = data.find(a => a.key === 'shop_hijabs');
        if (hijabAsset) {
          setItems(hijabAsset.value);
        }
      } catch (err) {
        console.error('Failed to load hijab assets', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section className="py-20" >
      <div className="w-full mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-2xl md:text-3xl text-center uppercase tracking-[0.3em] font-black text-neutral-900">
            Shop Hijabs
          </h2>
          <div className="w-12 h-1 bg-neutral-900 mt-4" />
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-neutral-100 animate-pulse rounded-2xl" />
            ))
          ) : (
            items.map((hijab, idx) => (
              <CategoryCard
                key={idx}
                title={hijab.title}
                image={hijab.image}
                href={hijab.link || hijab.href}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopHijabs;
