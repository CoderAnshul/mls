import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  IoChevronDown, IoBagOutline, IoHeartOutline, IoHeart, IoShareOutline,
  IoMailOutline
} from 'react-icons/io5';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { api } from '../utils/api';
import ProductSliderSection from '../components/sections/ProductSliderSection';
import HowWeDoIt from '../components/sections/HowWeDoIt';
import { useToast } from '../components/common/Toast';

const ProductDetails = () => {
  const toast = useToast();
  const { id } = useParams();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedLength, setSelectedLength] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeAccordion, setActiveAccordion] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const data = await api.products.getOne(id);
        setProduct(data);
        // We don't auto-select size/length to force user interaction as requested
        if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
// ... (rest of effect)
        // Save to recently viewed
        try {
          const history = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
          const filtered = history.filter(p => p._id !== data._id);
          localStorage.setItem('recentlyViewed', JSON.stringify([data, ...filtered].slice(0, 10)));
        } catch (e) {}
        // Fetch same-category products as fallback for Wear With
        if (data.category) {
          try {
            const related = await api.products.getAll({ category: data.category, limit: 8 });
            const items = Array.isArray(related) ? related : related.products || [];
            setRelatedProducts(items.filter(p => p._id !== data._id).slice(0, 8));
          } catch (e) {}
        }
      } catch (err) {
        console.error('Failed to fetch product', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const toggleAccordion = (key) => {
    setActiveAccordion(activeAccordion === key ? null : key);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F2EA]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Loading</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F2EA] gap-6">
        <h1 className="text-2xl font-light tracking-widest text-neutral-400">PRODUCT NOT FOUND</h1>
        <Link to="/collections/all" className="text-[12px] font-black uppercase tracking-widest border-b border-black pb-1">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const allImages = [product.coverImage, product.hoverImage, ...(product.gallery || [])].filter(Boolean);
  if (allImages.length === 0 && product.images?.length > 0) {
    allImages.push(...product.images);
  }

  return (
    <main className="flex-1 bg-[#F4F2EA] min-h-screen w-full">
      <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row px-2 sm:px-4 lg:px-8">
        
        {/* Gallery Section */}
        <div className="flex-1 w-full relative">
          {(product.isNew || product.status === 'New') && (
            <div className="absolute top-6 left-6 bg-white rounded-full w-[44px] h-[44px] flex items-center justify-center shadow-lg z-10 lg:w-[56px] lg:h-[56px] lg:top-10 lg:left-10">
              <span className="text-[8px] font-bold text-center leading-tight uppercase tracking-tighter text-[#252423] lg:text-[10px]">
                NEW IN
              </span>
            </div>
          )}
          
          {/* Mobile Slider / Desktop Grid */}
          <div className="flex lg:grid lg:grid-cols-2 lg:gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-2 sm:-mx-4 lg:mx-0">
            {allImages.length > 0 ? (
              allImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`
                    flex-none w-screen lg:w-full snap-center  /* Mobile: Full viewport width */
                    aspect-[3/4] bg-neutral-200 overflow-hidden group 
                    lg:flex-1 lg:snap-align-none /* Desktop overrides */
                    ${idx === 0 ? 'lg:col-span-2' : ''}
                  `}
                >
                  <img 
                    src={img} 
                    alt={`${product.title} view ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] lg:group-hover:scale-110"
                    draggable={false}
                  />
                </div>
              ))
            ) : (
              <div className="aspect-[3/4] w-full bg-neutral-200 flex items-center justify-center lg:col-span-2">
                <span className="text-neutral-400 font-black uppercase tracking-widest text-sm">No Images Available</span>
              </div>
            )}
          </div>
        </div>

        {/* Info Section - Sticky */}
        <div className="w-full lg:w-[450px] xl:w-[550px] p-2 lg:px-16 lg:sticky lg:top-[50px] h-fit">
          <div className="flex flex-col gap-2">
            
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              <Link to="/" className="hover:text-black transition-colors">Home</Link>
              <span>/</span>
              <Link to={`/collections/${product.category?.toLowerCase()}`} className="hover:text-black transition-colors">{product.category}</Link>
              <span>/</span>
              <span className="text-black truncate max-w-[120px]">{product.title}</span>
            </nav>

            {/* Header Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-light text-[#252423] tracking-[0.08em] mb-4 uppercase leading-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[20px] font-medium text-[#252423]">£{product.price?.toFixed(2)}</span>
                {product.discount > 0 && (
                  <span className="text-[11px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded uppercase tracking-widest">
                    {product.discount}% Off
                  </span>
                )}
              </div>
              <p className="text-[14px] leading-relaxed text-neutral-600 font-normal">
                {product.description}
              </p>
            </div>

            {/* Selection Options */}
            <div className="flex flex-col gap-4 border-t border-black/10 pt-3">
              
              {/* Color */}
              {product.colors?.length > 0 && (
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-[0.15em] mb-4 text-[#252423]">
                    AVAILABLE COLOURS
                  </h5>
                  <div className="flex gap-3">
                    {product.colors.map((c, i) => (
                      <div 
                        key={i} 
                        onClick={() => setSelectedColor(c)}
                        className={`w-8 h-8 rounded-full border-2 shadow-md cursor-pointer transition-all duration-300 transform hover:scale-110 
                          ${selectedColor === c ? 'border-black scale-110 ring-2 ring-black/5 ring-offset-2' : 'border-white'}
                        `} 
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#252423]">
                      SELECT SIZE
                    </h5>
                    <button className="text-[10px] font-bold uppercase tracking-[0.15em] underline underline-offset-4 text-neutral-500 hover:text-black">
                      SIZE GUIDE
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const isOutOfStock = ['XXS', 'XS', 'XL', 'XXL'].includes(size); // For design demo
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`relative h-12 min-w-[4rem] px-4 flex items-center justify-center text-[12px] font-black tracking-widest transition-all duration-300 border 
                            ${selectedSize === size 
                              ? 'border-black bg-black text-white shadow-xl shadow-black/10' 
                              : isOutOfStock 
                                ? 'border-black/10 bg-white/30 text-neutral-400 cursor-default' 
                                : 'border-black/10 bg-white/50 hover:border-black text-neutral-700'
                            }`}
                        >
                          <span className="relative z-10 flex items-center gap-1.5">
                            {isOutOfStock && <IoMailOutline className="w-3.5 h-3.5" />}
                            {size}
                          </span>
                          {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-full h-[1px] bg-neutral-300 -rotate-[25deg]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Lengths - Only shows when size is selected */}
              {selectedSize && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                  <h5 className="text-[11px] font-bold uppercase tracking-[0.15em] mb-4 text-[#252423]">
                    SELECT LENGTH (INCHES)
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {['52', '54', '56', '58', '62'].map((len) => {
                      const isOutOfStock = len === '52'; // For design demo
                      return (
                        <button
                          key={len}
                          onClick={() => setSelectedLength(len)}
                          className={`relative h-12 min-w-[4rem] px-4 flex items-center justify-center text-[12px] font-black tracking-widest transition-all duration-300 border 
                            ${selectedLength === len 
                              ? 'border-black bg-black text-white shadow-xl shadow-black/10' 
                              : isOutOfStock 
                                ? 'border-black/10 bg-white/30 text-neutral-400 cursor-default' 
                                : 'border-black/10 bg-white/50 hover:border-black text-neutral-700'
                            }`}
                        >
                          <span className="relative z-10 flex items-center gap-1.5">
                            {isOutOfStock && <IoMailOutline className="w-3.5 h-3.5" />}
                            {len}
                          </span>
                          {isOutOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-full h-[1px] bg-neutral-300 -rotate-[25deg]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock Urgency */}
              {selectedSize && selectedLength && (
                <p className="text-[12px] text-neutral-600 italic tracking-wide animate-in fade-in duration-700">
                  Hurry last 2 remaining
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    if (!selectedSize || !selectedLength) {
                      toast.error('Please select size and length');
                      return;
                    }
                    addToCart(product, selectedSize, selectedLength, selectedColor);
                    toast.success('Protocol added to bag');
                  }}
                  disabled={!selectedSize || !selectedLength}
                  className={`group relative w-full py-5 text-[12px] font-bold uppercase tracking-[0.25em] transition-all active:scale-[0.98] 
                    ${(!selectedSize || !selectedLength) 
                      ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' 
                      : 'bg-[#252423] text-white hover:bg-black shadow-lg shadow-black/10'
                    }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <IoBagOutline className="w-4 h-4" />
                    ADD TO BAG
                  </span>
                </button>
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="w-full bg-white/50 border border-black/10 flex items-center justify-center gap-3 py-5 text-[12px] font-bold uppercase tracking-[0.25em] hover:bg-white transition-all group"
                >
                  {isInWishlist(product._id || product.id) ? (
                    <>
                      <IoHeart className="w-5 h-5 text-black" />
                      REMOVE FROM WISHLIST
                    </>
                  ) : (
                    <>
                      <IoHeartOutline className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      ADD TO WISHLIST
                    </>
                  )}
                </button>
              </div>

              {/* Accordions */}
              <div className="border-t border-black/10 mt-2 divide-y divide-black/10">
                
                {/* Fabric & Composition */}
                {product.fabricDetails && (
                  <div className="py-5">
                    <div 
                      className="flex items-center justify-between cursor-pointer" 
                      onClick={() => toggleAccordion('fabric')}
                    >
                      <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#252423]">
                        FABRIC & COMPOSITION
                      </h4>
                      <IoChevronDown 
                        className={`w-4 h-4 text-neutral-400 transition-transform duration-500 ${activeAccordion === 'fabric' ? 'rotate-180' : ''}`} 
                      />
                    </div>
                    <div className={`grid transition-[grid-template-rows] duration-500 ${activeAccordion === 'fabric' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden">
                        <div className="pt-5 pb-3 text-[13px] text-neutral-600 leading-relaxed">
                          {product.fabricDetails}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="py-5">
                  <div 
                    className="flex items-center justify-between cursor-pointer" 
                    onClick={() => toggleAccordion('description')}
                  >
                    <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#252423]">
                      DESCRIPTION & DETAILS
                    </h4>
                    <IoChevronDown 
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-500 ${activeAccordion === 'description' ? 'rotate-180' : ''}`} 
                    />
                  </div>
                  <div className={`grid transition-[grid-template-rows] duration-500 ${activeAccordion === 'description' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <div className="pt-5 pb-3 text-[13px] text-neutral-600 leading-relaxed">
                        {product.description}
                        {product.fitInfo && (
                          <p className="mt-3 pt-3 border-t border-black/5 font-bold italic text-neutral-500">
                            Fit: {product.fitInfo}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Care Instructions */}
                <div className="py-5">
                  <div 
                    className="flex items-center justify-between cursor-pointer" 
                    onClick={() => toggleAccordion('care')}
                  >
                    <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#252423]">
                      MATERIALS & CARE ADVICE
                    </h4>
                    <IoChevronDown 
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-500 ${activeAccordion === 'care' ? 'rotate-180' : ''}`} 
                    />
                  </div>
                  <div className={`grid transition-[grid-template-rows] duration-500 ${activeAccordion === 'care' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <div className="pt-5 pb-3 text-[13px] text-neutral-600 leading-relaxed">
                        {product.careInstructions || "To maintain the quality of your luxury item, dry clean only is recommended unless specified otherwise on the garment label."}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery */}
                <div className="py-5">
                  <div 
                    className="flex items-center justify-between cursor-pointer" 
                    onClick={() => toggleAccordion('delivery')}
                  >
                    <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#252423]">
                      DELIVERY & RETURNS
                    </h4>
                    <IoChevronDown 
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-500 ${activeAccordion === 'delivery' ? 'rotate-180' : ''}`} 
                    />
                  </div>
                  <div className={`grid transition-[grid-template-rows] duration-500 ${activeAccordion === 'delivery' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <div className="pt-5 pb-3 text-[13px] text-neutral-600 leading-relaxed">
                        Free standard delivery on all orders over £120. Express delivery available at checkout. Easy paperless returns within 28 days.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Highlights */}
              <div className="flex flex-col gap-6 py-8 border-t border-black/10">
                <div className="flex items-center gap-5 group cursor-pointer">
                  <div className="w-9 h-9 border border-black/10 rounded-full flex items-center justify-center text-neutral-400 group-hover:text-black group-hover:border-black transition-all shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 17H17V5H2V17ZM17 17H22L19 12H17V17Z"/><circle cx="5" cy="20" r="2"/><circle cx="14" cy="20" r="2"/></svg>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-neutral-500 group-hover:text-black transition-colors">FREE DELIVERY ON ORDERS OVER £120</span>
                </div>
                <div className="flex items-center gap-5 group cursor-pointer">
                  <div className="w-9 h-9 border border-black/10 rounded-full flex items-center justify-center text-neutral-400 group-hover:text-black group-hover:border-black transition-all shrink-0">
                    <IoMailOutline size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-neutral-500 group-hover:text-black transition-colors">CONTACT OUR CUSTOMER CARE TEAM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wear With + Recently Viewed Tabbed Slider */}
      <ProductSliderSection 
        wearWith={product.wearWith} 
        relatedProducts={relatedProducts}
        currentProductId={product._id} 
      />
      
      {/* Brand Pillars Section */}
      <HowWeDoIt />
    </main>
  );
};

export default ProductDetails;
