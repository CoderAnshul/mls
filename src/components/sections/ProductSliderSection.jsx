import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoHeartOutline, IoHeart, IoBagOutline } from 'react-icons/io5';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import QuickAddModal from '../common/QuickAddModal';
import { resolveImageUrl } from '../../utils/imageUrl';

// ─── Mini Product Card ────────────────────────────────────────────────────────
export const SliderCard = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const primaryImage = product.coverImage || product.image || product.images?.[0] || null;
  const productLink = `/product/${product.slug || product._id || product.id}`;
  const colors = product.colors || [];
  const visibleColors = colors.slice(0, 5);
  const extraColors = colors.length > 5 ? colors.length - 5 : 0;
  
  const isFavourite = isInWishlist(product._id || product.id);

  return (
    <div className="flex flex-col shrink-0 w-[240px] sm:w-[280px]">
      {/* Image — always fixed aspect ratio, never collapses */}
      <div className="relative w-full block group" style={{ aspectRatio: '3/4' }}>
        <Link to={productLink} className="absolute inset-0 bg-[#E8E6DE] overflow-hidden">
          {primaryImage ? (
            <img
              src={resolveImageUrl(primaryImage)}
              alt={product.title || 'Product'}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              draggable={false}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : null}
        </Link>

        {/* Icons Overlays */}
        <div className="absolute inset-0 p-4 pointer-events-none z-10">
          <div className="relative w-full h-full">
            {/* NEW IN badge */}
            {(product.isNew || product.status === 'New') && (
              <div className="absolute top-0 left-0 bg-white rounded-full w-[44px] h-[44px] flex items-center justify-center shadow-sm">
                <span className="text-[8px] font-bold text-center leading-none uppercase tracking-tighter text-[#252423]">NEW IN</span>
              </div>
            )}

            {/* Wishlist */}
            <button
              className="absolute top-0 right-0 pointer-events-auto text-[#252423]/70 hover:text-[#252423] transition-colors"
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                toggleWishlist(product);
              }}
            >
              {isFavourite ? (
                <IoHeart className="w-5 h-5 text-black" />
              ) : (
                <IoHeartOutline className="w-5 h-5 stroke-[1.2px]" />
              )}
            </button>

            {/* Bag Icon (Bottom Left) */}
            <button
              className="absolute bottom-0 left-0 pointer-events-auto text-[#252423] hover:scale-110 transition-transform"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickAddOpen(true);
              }}
            >
              <IoBagOutline className="w-5 h-5 stroke-[1.2px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Info — fixed min-height, flex column with space-between so ADD TO BAG always at bottom */}
      <div className="pt-4 flex flex-col justify-between" style={{ minHeight: '120px' }}>
        <div className="flex flex-col gap-1.5 px-2">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#252423] text-center leading-tight truncate w-full">
            {product.title || ''}
          </h3>
          <p className="text-[12px] text-[#252423] font-normal text-center tracking-wide">
            {product.price ? `£${(+product.price).toFixed(2)}` : '\u00a0'}
          </p>
          {colors.length > 0 && (
            <div className="flex items-center justify-center gap-1.5 mt-1">
              {visibleColors.map((c, i) => (
                <div
                  key={i}
                  className="w-[14px] h-[14px] rounded-full border border-black/10 cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                />
              ))}
              {extraColors > 0 && (
                <span className="text-[10px] font-bold text-[#252423]/60 ml-0.5">+</span>
              )}
            </div>
          )}
        </div>

        {/* ADD TO BAG always pinned at the bottom */}
        <button 
          onClick={() => setIsQuickAddOpen(true)}
          className="mt-3 w-full bg-[#252423] text-white text-[10px] font-bold uppercase tracking-[0.2em] py-3.5 hover:bg-black transition-colors"
        >
          ADD TO BAG
        </button>
      </div>

      <QuickAddModal 
        product={product}
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAdd={addToCart}
      />
    </div>
  );
};


// ─── Draggable Slider ─────────────────────────────────────────────────────────
const DraggableSlider = ({ items }) => {
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
    sliderRef.current.style.cursor = 'grabbing';
    sliderRef.current.style.userSelect = 'none';
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    sliderRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.2;
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
      sliderRef.current.style.userSelect = '';
    }
  };
  const onTouchStart = (e) => {
    startX.current = e.touches[0].pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };
  const onTouchMove = (e) => {
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    sliderRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.2;
  };

  return (
    <div
      ref={sliderRef}
      className="flex gap-5 overflow-x-auto pb-2 select-none px-6 sm:px-10"
      style={{ scrollbarWidth: 'none', cursor: 'grab' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
    >
      {items.map((p) => (
        <SliderCard key={p._id || p.id} product={p} />
      ))}
    </div>
  );
};

// ─── Main Tabbed Section ──────────────────────────────────────────────────────
const ProductSliderSection = ({ wearWith = [], relatedProducts = [], currentProductId }) => {
  const [activeTab, setActiveTab] = useState('wearWith');
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Read recently viewed AFTER a short delay so the current page has time to save itself
  useEffect(() => {
    const load = () => {
      try {
        const history = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        setRecentlyViewed(history.filter(p => p._id !== currentProductId));
      } catch (e) {}
    };
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [currentProductId]);

  // Use wearWith if set, otherwise fall back to same-category products
  const wearWithItems = wearWith?.length > 0 ? wearWith : relatedProducts;
  const hasRecent = recentlyViewed.length > 0;
  const activeItems = activeTab === 'wearWith' ? wearWithItems : recentlyViewed;

  return (
    <section className="mt-12 border-t border-black/10 pt-6 pb-6 bg-[#F4F2EA]">
      {/* Tab Header */}
      <div className="flex items-center justify-center gap-10 mb-12">
        <button
          onClick={() => setActiveTab('wearWith')}
          className={`text-[13px] font-bold uppercase tracking-[0.18em] pb-2 transition-all ${
            activeTab === 'wearWith'
              ? 'text-[#252423] border-b-2 border-[#252423]'
              : 'text-neutral-400 border-b-2 border-transparent hover:text-[#252423]'
          }`}
        >
          Wear With
        </button>

        {/* Only show Recently Viewed tab if user has history */}
        {hasRecent && (
          <button
            onClick={() => setActiveTab('recentlyViewed')}
            className={`text-[13px] font-bold uppercase tracking-[0.18em] pb-2 transition-all ${
              activeTab === 'recentlyViewed'
                ? 'text-[#252423] border-b-2 border-[#252423]'
                : 'text-neutral-400 border-b-2 border-transparent hover:text-[#252423]'
            }`}
          >
            Recently Viewed
          </button>
        )}
      </div>

      {/* Slider content */}
      {activeItems.length > 0 ? (
        <DraggableSlider items={activeItems} />
      ) : (
        // Wear With tab with no products — show a friendly message
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 py-10">
          No recommendations added yet
        </p>
      )}

      {/* Clear history — only on recently viewed tab */}
      {activeTab === 'recentlyViewed' && hasRecent && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              localStorage.removeItem('recentlyViewed');
              setRecentlyViewed([]);
              setActiveTab('wearWith');
            }}
            className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-rose-500 transition-colors border-b border-neutral-300 pb-0.5"
          >
            Clear History
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductSliderSection;
