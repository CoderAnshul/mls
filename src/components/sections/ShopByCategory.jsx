import React, { useState, useEffect } from 'react';
import CategoryCard from '../ui/CategoryCard';
import { api } from '../../utils/api';

const ShopByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await api.categories.getAll();
        // Filter out inactive categories or handle as needed
        setCategories(data.filter(c => c.isActive).slice(0, 4));
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <section className="py-0" >
    {/* <section className="py-20" > */}
      <div className="w-full mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-2xl md:text-3xl text-center uppercase tracking-[0.3em] font-black text-neutral-900">
            SHOP BY CATEGORY
          </h2>
          <div className="w-12 h-1 bg-neutral-900 mt-4" />
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {loading ? (
             Array(4).fill(0).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-neutral-100 animate-pulse rounded-2xl" />
             ))
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <CategoryCard
                key={category._id}
                title={category.name}
                image={category.image || "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?q=80&w=800"} // Default image if none
                href={`/collections/${category.slug}`}
              />
            ))
          ) : (
             <p className="col-span-full text-center uppercase tracking-[0.2em] text-neutral-400 font-bold py-10">No categories indexed</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
