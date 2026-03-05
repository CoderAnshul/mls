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
      <div className="bg-[#F6F3EB] min-h-screen flex flex-col items-center justify-center space-y-8 px-4 font-['Outfit']">
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
    <div className="bg-[#F6F3EB] min-h-screen py-10 px-4 md:px-8 lg:px-24 font-['Outfit']">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Main Content (Left) */}
          <div className="lg:col-span-8">
            
            {/* Managed Offers Section */}
            {/* {managedOffers.length > 0 && managedOffers.filter(rec => !cart.some(item => (item._id || item.id) === (rec.product?._id || rec.product?.id))).map((offer) => (
               <div key={offer._id} className="pb-16 border-b border-neutral-800/10 last:border-0 last:pb-0 mb-16">
                  <div className="flex flex-col md:flex-row gap-12">
                    <div className="w-full md:w-[260px] aspect-[2/3] bg-neutral-200 shrink-0">
                        <img 
                          src={offer.image || offer.product?.images?.[0] || offer.product?.image} 
                          alt={offer.product?.title} 
                          className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 flex flex-col pt-2">
                        <div className="flex justify-between items-start mb-6">
                          <h3 className="text-[14px] font-medium tracking-[0.15em] uppercase text-[#1C1C1C] leading-tight">{offer.product?.title}</h3>
                          <div className="text-right">
                             <p className="text-[12px] text-neutral-400 line-through">£{offer.product?.price.toFixed(2)}</p>
                             <p className="text-[14px] font-medium text-neutral-900">£{(offer.product?.price * (1 - offer.discountPercentage/100)).toFixed(2)}</p>
                          </div>
                        </div>

                        <p className="text-[12px] tracking-widest font-medium text-neutral-500 uppercase mb-4">{offer.heading}</p>
                        
                        <div className="mb-8">
                            <p className="text-[13px] leading-relaxed text-neutral-600 font-light italic">
                                {offer.description || offer.product?.description}
                            </p>
                        </div>

                        <div className="mt-auto flex items-center gap-6">
                            <div className="relative inline-block">
                                <select 
                                  value={upsellQuantities[offer._id] || 1}
                                  onChange={(e) => updateUpsellQty(offer._id, parseInt(e.target.value) - (upsellQuantities[offer._id] || 1))}
                                  className="appearance-none bg-transparent border border-neutral-400 py-3 pl-4 pr-12 text-[13px] font-medium outline-none cursor-pointer min-w-[90px]"
                                >
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                  ))}
                                </select>
                                <IoChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-neutral-800" />
                            </div>
                            <button 
                              onClick={() => handleAddManagedOffer(offer)}
                              className="bg-[#1C1C1C] text-white px-12 py-3 text-[11px] tracking-[0.2em] font-medium uppercase hover:bg-black transition-all"
                            >
                              Add to Bag
                            </button>
                        </div>
                    </div>
                  </div>
               </div>
            ))} */}

            {cart.map((item, index) => (
              <div key={`${item._id || item.id}-${index}`} className="flex flex-col md:flex-row gap-8 pb-16 relative">
                {/* Product Image */}
                <Link to={`/product/${item.slug || item._id || item.id}`} className="w-full md:w-[180px] h-[240px] aspect-[2/3] bg-neutral-200 relative group overflow-hidden shrink-0">
                {/* <Link to={`/product/${item.slug || item._id || item.id}`} className="w-full md:w-[260px] aspect-[2/3] bg-neutral-200 relative group overflow-hidden shrink-0"> */}
                  <img 
                    src={item.coverImage || item.image || item.images?.[0]} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <IoHeartOutline size={20} className="text-black cursor-pointer" />
                  </div>
                </Link>

                {/* Product Details */}
                <div className="flex-1 flex flex-col pt-2 md:pt-0">
                  <div className="flex justify-between items-start mb-4">
                    <h5 className="text-[14px] tracking-[0.15em] font-medium uppercase text-[#1C1C1C]">{item.title}</h5>
                    <p className="text-[12px] tracking-[0.1em] font-light">£{item.price.toFixed(2)}</p>
                  </div>

                  <div className="space-y-1">
                    {item.selectedSize && (
                      <p className="text-[13px] tracking-widest text-[#1C1C1C] uppercase font-medium">SIZE: {item.selectedSize}</p>
                    )}
                    {item.selectedLength && (
                      <p className="text-[13px] tracking-widest text-[#1C1C1C] uppercase font-medium">LENGTH (INCHES): {item.selectedLength}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative inline-block">
                      <select 
                        value={item.quantity}
                        onChange={(e) => {
                          const newQty = parseInt(e.target.value);
                          updateQuantity(item._id || item.id, item.selectedSize, item.selectedLength, item.selectedColor, newQty);
                        }}
                        className="appearance-none bg-transparent border border-neutral-400 py-3 pl-4 pr-12 text-[13px] font-medium outline-none cursor-pointer min-w-[90px]"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                      <IoChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-neutral-800" />
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item._id || item.id, item.selectedSize, item.selectedLength, item.selectedColor)}
                      className="text-neutral-800 hover:text-red-600 transition-colors"
                    >
                      <IoTrashOutline size={22} className="stroke-1" />
                    </button>
                  </div>

                  {/* Recommendations Section */}
                  {recommendations[item.category]?.length > 0 && (
                    <div className="mt-auto">
                      <h5 className="text-[11px] tracking-[0.25em] font-medium uppercase text-neutral-500">ADD MATCHING PRODUCT</h5>
                      <div className="space-y-0">
                        {recommendations[item.category].map((product) => (
                          <div key={product._id || product.id} className="flex items-center justify-between py-3 border-b border-neutral-800/80">
                            <div className="flex items-center gap-6">
                              <div className="w-[55px] aspect-square bg-neutral-200 overflow-hidden shrink-0">
                                <img 
                                  src={product.coverImage || product.image || product.images?.[0]} 
                                  alt={product.title} 
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <h5 className="text-[12px] tracking-[0.15em] font-medium uppercase text-neutral-800">{product.title}</h5>
                                <p className="text-[11px] tracking-widest font-light text-neutral-600">£{product.price.toFixed(2)}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleAddMatching(product)}
                              className="bg-[#1C1C1C] text-white px-6 py-2 text-[11px] tracking-[0.2em] font-medium uppercase hover:bg-black transition-colors"
                            >
                              ADD
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
            <div className="sticky top-24 space-y-5">
              <h5 className="text-[14px] tracking-[0.2em] font-semibold uppercase text-neutral-800">ORDER SUMMARY</h5>
              
              <div className="space-y-1">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between items-start text-[13px] tracking-wider uppercase font-medium">
                    <span className="text-neutral-700 max-w-[250px] leading-relaxed">{item.title}</span>
                    <span className="shrink-0">£{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="pt-8 flex justify-between items-center text-[15px] tracking-wider font-bold">
                  <span className="uppercase">SUBTOTAL</span>
                  <span>£{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Free Shipping Progress */}
              <div className="bg-[#EAE1D4] border border-neutral-800/10 py-3 text-center">
                <p className="text-[12px] tracking-[0.15em] font-bold uppercase text-neutral-800/70">
                  FREE SHIPPING <span className="font-light">ON THIS ORDER</span>
                </p>
              </div>

              <Link 
                to="/checkout"
                className="block w-full text-center bg-[#1C1C1C] text-white py-3 text-[13px] tracking-[0.25em] font-medium uppercase hover:bg-black transition-all"
              >
                PROCEED TO CHECKOUT
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
