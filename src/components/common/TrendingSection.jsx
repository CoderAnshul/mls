import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { resolveImageUrl } from '../../utils/imageUrl';

const TrendingSection = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await api.products.getAll();
        setTrendingProducts(res.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 border-t border-neutral-100">
      <h2 className="text-center text-[13px] font-black tracking-[0.4em] uppercase text-neutral-800 mb-16">
        SEE WHAT'S TRENDING
      </h2>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-neutral-200 border-t-neutral-800 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
          {trendingProducts.map((product) => (
            <Link to={`/product/${product.slug}`} key={product._id} className="group">
              <div className="relative aspect-[3/4] bg-neutral-100 mb-6 overflow-hidden">
                <img 
                  src={resolveImageUrl(product.coverImage || product.images?.[0])} 
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                {product.isNew && (
                  <div className="absolute top-4 left-4 bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-sm">
                    <span className="text-[8px] font-black uppercase tracking-tighter">New In</span>
                  </div>
                )}
              </div>
              <div className="text-center space-y-2 px-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-800 line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-[11px] text-neutral-500 font-medium">
                  £{product.price?.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingSection;
