import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IoChevronBack, IoChevronForward, IoChevronDown } from 'react-icons/io5';
import ProductCard from '../components/common/ProductCard';
import { fetchProducts } from '../utils/api';

const Collections = () => {
  const { category } = useParams();
  const [activeSubCategory, setActiveSubCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid4'); // grid4 or grid2
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const filters = {};
      if (category && category !== 'clothing') {
        filters.category = category;
      }
      if (activeSubCategory !== 'ALL') {
        filters.category = activeSubCategory;
      }
      
      const data = await fetchProducts(filters);
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, [category, activeSubCategory]);

  const formattedCategory = category
    ? category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'CLOTHING';

  const subCategories = [
    'ALL', 'ABAYAS', 'EMBROIDERIES', 'PRAYER OUTFITS', 'MAXI DRESSES', 
    'KIMONOS', 'KAFTANS', 'SECOND SKIN', 'SLIP DRESSES', 'CO-ORD SETS', 
    'COATS & COVER UPS', 'MIDIS & TOPS', 'SHIRT DRESSES', 'TROUSERS & SKIRTS',
    'GIRLS ABAYAS', 'MODEST SWIMWEAR', 'MODEST ACTIVEWEAR', 'MODEST WORKWEAR'
  ];

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 400;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <main className="flex-1 bg-[#F4F2EA]">
      {/* Category Header */}
      <div className="pt-16 pb-8 px-4 text-center">
        <h2 className="text-[14px] font-bold uppercase tracking-[0.3em] text-[#252423]">
          VIEW ALL {formattedCategory.toUpperCase()}
        </h2>
      </div>

      {/* Sub-category Slider */}
      <div className="relative border-b border-black/5 pb-10">
        <div className="max-w-screen-2xl mx-auto px-8 lg:px-12 flex items-center justify-between gap-4">
          <button 
            onClick={() => handleScroll('left')}
            className="p-2 text-neutral-400 hover:text-black transition-colors z-10 shrink-0"
          >
            <IoChevronBack className="w-5 h-5 font-light" />
          </button>
          
          <div 
            ref={sliderRef}
            className="flex-1 overflow-x-auto scrollbar-hide flex items-center gap-10 no-scrollbar touch-pan-x"
          >
            {subCategories.map((sub, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveSubCategory(sub)}
                className={`text-[12px] font-bold uppercase tracking-[0.18em] whitespace-nowrap transition-all duration-300 ${
                  activeSubCategory === sub ? 'text-black border-b-[1.5px] border-black pb-1' : 'text-neutral-400 hover:text-black'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <button 
            onClick={() => handleScroll('right')}
            className="p-2 text-neutral-400 hover:text-black transition-colors z-10 shrink-0"
          >
            <IoChevronForward className="w-5 h-5 font-light" />
          </button>
        </div>
      </div>

      {/* Utility Bar */}
      <div className="max-w-screen-2xl mx-auto px-8 lg:px-12 py-10 flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <button className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] group">
            SORT BY
            <IoChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
          </button>
        </div>

        <div className="flex items-center gap-10">
          <button className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] group">
            FILTERS
            <IoChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
          </button>

          <div className="flex items-center gap-6 border-l border-black/10 pl-10 h-6">
            <button 
              onClick={() => setViewMode('grid4')}
              className={`transition-colors flex flex-col gap-0.5 ${viewMode === 'grid4' ? 'text-black' : 'text-neutral-300'}`}
            >
              <div className="flex gap-0.5">
                <div className="w-1.5 h-1.5 bg-current" /><div className="w-1.5 h-1.5 bg-current" /><div className="w-1.5 h-1.5 bg-current" />
              </div>
              <div className="flex gap-0.5">
                <div className="w-1.5 h-1.5 bg-current" /><div className="w-1.5 h-1.5 bg-current" /><div className="w-1.5 h-1.5 bg-current" />
              </div>
              <div className="flex gap-0.5">
                <div className="w-1.5 h-1.5 bg-current" /><div className="w-1.5 h-1.5 bg-current" /><div className="w-1.5 h-1.5 bg-current" />
              </div>
            </button>
            <button 
              onClick={() => setViewMode('grid2')}
              className={`p-1.5 transition-colors grid grid-cols-2 gap-0.5 ${viewMode === 'grid2' ? 'text-black' : 'text-neutral-300'}`}
            >
              <div className="w-3.5 h-3.5 bg-current" /><div className="w-3.5 h-3.5 bg-current" />
              <div className="w-3.5 h-3.5 bg-current" /><div className="w-3.5 h-3.5 bg-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-12 pb-24">
        <div className={`grid gap-x-4 md:gap-x-5 gap-y-12 md:gap-y-16 transition-all duration-500 ${
          viewMode === 'grid4' 
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
            : 'grid-cols-1 md:grid-cols-2'
        }`}>
          {loading ? (
            <div className="col-span-full py-20 text-center uppercase tracking-widest text-neutral-400">Loading products...</div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard 
                key={product._id || product.id} 
                product={{
                  ...product,
                  id: product._id || product.id,
                  image: product.image || (product.images && product.images[0])
                }} 
                isEditorial={product.isEditorial} 
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center uppercase tracking-widest text-neutral-400">No products found in this category.</div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Collections;
