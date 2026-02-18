import { useState } from 'react';
import ProductCard from '../common/ProductCard';

const RecentlyViewedSection = ({ currentProductId }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    } catch {
      return [];
    }
  });

  const filtered = items.filter(p => p._id !== currentProductId);
  if (!filtered.length) return null;

  const clearHistory = () => {
    localStorage.removeItem('recentlyViewed');
    setItems([]);
  };

  return (
    <section className="mt-24 mb-20 px-4 sm:px-8 bg-white/30 py-20">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-neutral-500 border-l-2 border-black pl-4">
            Recently Browsed
          </h2>
          <button
            onClick={clearHistory}
            className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-rose-500 transition-colors"
          >
            Clear History
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-8 snap-x" style={{ scrollbarWidth: 'none' }}>
          {filtered.map((p) => (
            <div key={p._id} className="min-w-[200px] md:min-w-[260px] snap-start shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewedSection;
