import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoChevronBack, IoHeartOutline, IoTrashOutline, IoChevronDown } from 'react-icons/io5';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../utils/api';
import QuickAddModal from '../components/common/QuickAddModal';
import { useToast } from '../components/common/Toast';

const Cart = () => {
  const toast = useToast();
  const { cart, removeFromCart, updateQuantity, cartTotal, addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [recommendations, setRecommendations] = useState({}); // { category: products[] }
  const [selectedMatchProduct, setSelectedMatchProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [managedOffers, setManagedOffers] = useState([]);
  const [expandedOfferDesc, setExpandedOfferDesc] = useState(null);
  const [upsellQuantities, setUpsellQuantities] = useState({}); // { offerId: quantity }

  useEffect(() => {
    const loadManagedOffers = async () => {
        try {
            const data = await api.recommendations.getAll('cart');
            setManagedOffers(data);
            // Initialize quantities
            const q = {};
            data.forEach(r => q[r._id] = 1);
            setUpsellQuantities(q);
        } catch (err) {
            console.error('Failed to load managed cart offers', err);
        }
    };
    loadManagedOffers();
  }, []);

  const toggleOfferDescription = (id) => {
    setExpandedOfferDesc(expandedOfferDesc === id ? null : id);
  };

  const updateUpsellQty = (id, delta) => {
    setUpsellQuantities(prev => ({
        ...prev,
        [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const handleAddManagedOffer = (offer) => {
    const productToBag = {
        ...offer.product,
        selectedSize: offer.product.sizes?.[0] || 'One Size',
        selectedLength: offer.product.lengths?.[0] || 'Standard',
        selectedColor: offer.product.colors?.[0] || 'Original',
        quantity: upsellQuantities[offer._id] || 1
    };
    addToCart(productToBag);
    toast.success(`${offer.product.title} added to bag!`);
  };

  useEffect(() => {
    const fetchAllMatches = async () => {
      if (cart.length > 0) {
        try {
          // Get unique categories including sub-categories if applicable
          const uniqueCategories = [...new Set(cart.map(item => item.category).filter(Boolean))];
          const cartIds = new Set(cart.map(item => item._id || item.id));
          const newRecommendations = {};
          const globallyUsedIds = new Set();

          // Fetch matches for each unique category sequentially for strict deduplication
          for (const cat of uniqueCategories) {
            try {
              const data = await api.products.getAll({ category: cat });
              // Filter out items already in cart AND items already used/recommended for previous categories
              const filtered = data.filter(p => 
                !cartIds.has(p._id || p.id) && 
                !globallyUsedIds.has(p._id || p.id)
              ).slice(0, 3);

              if (filtered.length > 0) {
                newRecommendations[cat] = filtered;
                filtered.forEach(p => globallyUsedIds.add(p._id || p.id));
              }
            } catch (err) {
              console.error(`Failed to fetch matches for ${cat}:`, err);
            }
          }

          setRecommendations(newRecommendations);
        } catch (error) {
          console.error('Failed to fetch recommendations:', error);
        }
      }
    };
    fetchAllMatches();
  }, [cart]);

  const handleAddMatching = (product) => {
    setSelectedMatchProduct(product);
    setIsModalOpen(true);
  };

  if (cart.length === 0) {
    return (
      <div className="bg-[#F4F2EA] min-h-screen flex flex-col items-center justify-center space-y-8 px-4">
        <h1 className="text-[22px] tracking-[0.35em] font-light uppercase">Your Bag is Empty</h1>
        <Link 
          to="/collections/all" 
          className="bg-[#1C1C1C] text-white px-12 py-4 text-[11px] tracking-[0.2em] font-medium uppercase hover:bg-black transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F2EA] min-h-screen py-10 px-4 md:px-8 lg:px-12">
      <div className="max-w-screen-2xl mx-auto">
        {/* Back Button */}
        <Link to="/" className="flex items-center gap-2 text-[11px] tracking-[0.2em] font-light uppercase hover:opacity-70 transition-opacity mb-8">
          <IoChevronBack size={14} />
          Back
        </Link>

        {/* Title */}
        <h1 className="text-center text-[22px] tracking-[0.35em] font-light uppercase mb-10 lg:mb-16">Shopping Bag</h1>

        <div className="grid lg:grid-cols-12 gap-5 lg:gap-10">
          {/* Main Content (Left) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Managed Offers Section */}
            {managedOffers.length > 0 && managedOffers.filter(rec => !cart.some(item => (item._id || item.id) === (rec.product?._id || rec.product?.id))).map((offer) => (
               <div key={offer._id} className="border border-neutral-300/40 p-6 rounded-[1.25rem] bg-neutral-50/10 shadow-sm transition-all duration-500 mb-8 last:mb-12">
                  <div className="flex flex-col md:flex-row gap-6 ">
                    <div className="w-24 h-32 bg-neutral-200 rounded-xl overflow-hidden shrink-0 border border-neutral-200 shadow-sm self-center md:self-start">
                        <img 
                          src={offer.image || offer.product?.images?.[0] || offer.product?.image} 
                          alt={offer.product?.title} 
                          className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <p className="text-[13px] tracking-tight font-medium mb-4 text-neutral-800">{offer.heading}</p>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div className="min-w-0">
                            <h3 className="text-[14px] font-medium tracking-tight text-neutral-800 leading-tight truncate">{offer.product?.title}</h3>
                            <button 
                              onClick={() => toggleOfferDescription(offer._id)}
                              className="text-[12px] text-neutral-400 font-medium mt-1 flex items-center justify-center md:justify-start gap-1.5 hover:text-black transition-colors"
                            >
                              Description <IoChevronDown size={14} className={`transition-transform duration-300 ${expandedOfferDesc === offer._id ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                          <div className="text-center md:text-right">
                             <p className="text-[12px] text-red-700/60 line-through font-medium">£{offer.product?.price.toFixed(2)}</p>
                             <p className="text-[14px] font-black text-neutral-900">£{(offer.product?.price * (1 - offer.discountPercentage/100)).toFixed(2)}</p>
                          </div>
                        </div>

                        {/* Smooth Description Accordion */}
                        <div className={`grid transition-all duration-500 ease-in-out ${expandedOfferDesc === offer._id ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0 h-0 overflow-hidden'}`}>
                          <div className="overflow-hidden">
                              <p className="text-[12px] leading-relaxed text-neutral-600/80 border-t border-neutral-200/50 pt-4 font-normal">
                                  {offer.description || offer.product?.description || 'Discover the exceptional quality of this protocol, designed to elevate your daily ritual.'}
                              </p>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold ml-1">Quantity</span>
                                <div className="flex items-center border border-neutral-300/70 rounded-xl bg-white h-12 px-2">
                                    <button onClick={() => updateUpsellQty(offer._id, -1)} className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-black transition-colors text-xl font-light">—</button>
                                    <span className="w-10 text-center text-[13px] font-black">{upsellQuantities[offer._id] || 1}</span>
                                    <button onClick={() => updateUpsellQty(offer._id, 1)} className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-black transition-colors text-xl font-light">+</button>
                                </div>
                            </div>
                            <button 
                              onClick={() => handleAddManagedOffer(offer)}
                              className="flex-1 bg-neutral-100/50 border border-neutral-300/70 h-12 sm:mt-5 rounded-xl text-[12px] tracking-widest uppercase font-black text-neutral-800 hover:bg-neutral-100 transition-all active:scale-[0.98] shadow-sm"
                            >
                              Add to Bag
                            </button>
                        </div>
                    </div>
                  </div>
               </div>
            ))}

            {cart.map((item, index) => (
              <div key={`${item._id || item.id}-${index}`} className="flex flex-col md:flex-row gap-8 pb-12 border-b border-neutral-300/50 relative last:border-0 last:pb-0">
                {/* Product Image */}
                <Link to={`/product/${item.slug || item._id || item.id}`} className="w-full md:w-[260px] aspect-[3/4] h-[330px] bg-neutral-200 relative group overflow-hidden">
                  <img 
                    src={item.coverImage || item.image || item.images?.[0]} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(item);
                    }}
                    className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors z-10"
                  >
                    {isInWishlist(item._id || item.id) ? (
                      <IoTrashOutline size={16} className="text-rose-500" />
                    ) : (
                      <IoHeartOutline size={16} />
                    )}
                  </button>
                </Link>

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-5">
                    <h2 className="text-[13px] tracking-[0.15em] font-bold uppercase text-neutral-800">{item.title}</h2>
                    <p className="text-[13px] tracking-widest font-bold">£{(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <div className="space-y-1.5 mb-5">
                    {item.selectedSize && (
                      <p className="text-[11px] tracking-widest text-neutral-500 uppercase font-light">Size: {item.selectedSize}</p>
                    )}
                    {item.selectedLength && (
                      <p className="text-[11px] tracking-widest text-neutral-500 uppercase font-light">Length (Inches): {item.selectedLength}</p>
                    )}
                    {item.selectedColor && (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] tracking-widest text-neutral-500 uppercase font-light">Color:</span>
                        <div className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: item.selectedColor }} />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="relative inline-block">
                      <select 
                        value={item.quantity}
                        onChange={(e) => {
                          const newQty = parseInt(e.target.value);
                          updateQuantity(item._id || item.id, item.selectedSize, item.selectedLength, item.selectedColor, newQty);
                        }}
                        className="appearance-none bg-transparent border border-neutral-300 py-2 pl-3 pr-8 text-[11px] tracking-widest outline-none cursor-pointer min-w-[70px]"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                      <IoChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-neutral-400" />
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item._id || item.id, item.selectedSize, item.selectedLength, item.selectedColor)}
                      className="text-neutral-400 hover:text-black transition-colors"
                    >
                      <IoTrashOutline size={18} />
                    </button>
                  </div>

                  {/* Recommendations Section */}
                  {recommendations[item.category]?.length > 0 && (
                    <div className="mt-5">
                      <h5 className="!text-[14px] tracking-[0.2em] font-medium uppercase text-neutral-400 mb-2">Add Matching Product</h5>
                      <div className="space-y-5">
                        {recommendations[item.category].map((product) => (
                          <div key={product._id || product.id} className="flex items-center justify-between py-1.5 border-t border-neutral-800/70 first:border-t-0 mb-0">
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-18 bg-neutral-200 overflow-hidden">
                                <img 
                                  src={product.coverImage || product.image || product.images?.[0]} 
                                  alt={product.title} 
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                              <div>
                                <h4 className="text-[10px] tracking-[0.1em] font-bold uppercase mb-0.5 text-neutral-700">{product.title}</h4>
                                <p className="text-[10px] tracking-widest font-light text-neutral-500">£{product.price.toFixed(2)}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleAddMatching(product)}
                              className="bg-[#1C1C1C] text-white px-6 py-2 text-[9px] tracking-[0.2em] font-medium uppercase hover:bg-black transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary Sidebar (Right) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              <h2 className="text-[13px] tracking-[0.15em] font-bold uppercase mb-3 border-b border-neutral-300/50 pb-2">Order Summary</h2>
              
              <div className="space-y-4 pb-8 border-b border-neutral-300/50">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-[11px] tracking-widest">
                    <span className="text-neutral-500 uppercase font-light italic truncate max-w-[200px]">{item.title}</span>
                    <span className="font-bold">£{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-[12px] tracking-widest pt-3 border-t border-neutral-200/50">
                  <span className="font-bold uppercase text-[11px]">Subtotal</span>
                  <span className="font-bold">£{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Free Shipping Progress */}
              {cartTotal < 120 ? (
                <div className="bg-[#EAE1D4]/40 border border-neutral-300/30 p-5 text-center">
                  <p className="text-[10px] tracking-[0.1em] font-light uppercase leading-relaxed text-neutral-600">
                    Spend <span className="font-bold text-neutral-800">£{(120 - cartTotal).toFixed(2)} more</span> for free shipping
                  </p>
                </div>
              ) : (
                <div className="bg-green-50/50 border border-green-200/50 p-5 text-center">
                   <p className="text-[10px] tracking-[0.1em] font-bold uppercase leading-relaxed text-green-700">
                    You qualify for free shipping!
                  </p>
                </div>
              )}

              <Link 
                to="/checkout"
                className="block w-full text-center bg-[#1C1C1C] text-white py-5 text-[11px] tracking-[0.25em] font-medium uppercase hover:bg-black transition-all shadow-xl active:scale-[0.98]"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Add Modal for matching products */}
        <QuickAddModal 
          product={selectedMatchProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={addToCart}
        />
      </div>
    </div>
  );
};

export default Cart;
