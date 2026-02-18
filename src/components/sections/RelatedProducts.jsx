import React, { useState } from 'react';
import { IoHeartOutline } from 'react-icons/io5';

const RelatedProducts = () => {
  const [activeTab, setActiveTab] = useState('wear-with');

  const wearWithProducts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800',
      title: 'CRISS CROSS HIJAB UNDERCAP',
      price: 9.00
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800',
      title: 'MATTE GREY HIJAB MAGNET',
      price: 8.00
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=800',
      title: 'BLACK PREMIUM JERSEY HIJAB',
      price: 15.00
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?q=80&w=800',
      title: 'SILK MIX HIJAB',
      price: 22.00
    }
  ];

  const recentlyViewedProducts = [
    {
      id: 101,
      image: 'https://images.unsplash.com/photo-1581413816003-88ec0c5a3964?q=80&w=1200',
      title: 'JOURI ABAYA',
      price: 165.00
    }
  ];

  const currentProducts = activeTab === 'wear-with' ? wearWithProducts : recentlyViewedProducts;

  return (
    <section className="py-20 px-4 md:px-8 lg:px-12 bg-[#F4F2EA] border-t border-black/5">
      <div className="max-w-screen-2xl mx-auto">
        {/* Tabs Heading */}
        <div className="flex justify-center gap-12 mb-16 border-b border-black/5 relative">
          <button 
            onClick={() => setActiveTab('wear-with')}
            className={`pb-4 text-[13px] font-bold uppercase tracking-[0.2em] transition-all relative ${
              activeTab === 'wear-with' ? 'text-[#252423]' : 'text-neutral-400'
            }`}
          >
            WEAR WITH
            {activeTab === 'wear-with' && (
              <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#252423]" />
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab('recently-viewed')}
            className={`pb-4 text-[13px] font-bold uppercase tracking-[0.2em] transition-all relative ${
              activeTab === 'recently-viewed' ? 'text-[#252423]' : 'text-neutral-400'
            }`}
          >
            RECENTLY VIEWED
            {activeTab === 'recently-viewed' && (
              <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#252423]" />
            )}
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {currentProducts.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              {/* Image Container */}
              <div className="aspect-[3/4] bg-neutral-100 relative mb-5 overflow-hidden">
                <button className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                  <IoHeartOutline className="w-4 h-4 text-black" />
                </button>
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Text Info */}
              <div className="text-center flex flex-col gap-1.5">
                <h3 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-[#252423] leading-tight px-2">
                  {product.title}
                </h3>
                <p className="text-[11px] md:text-[12px] font-normal text-neutral-500">
                  £{product.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
