import { IoCloseSharp, IoTrashOutline, IoChevronDown } from 'react-icons/io5';
import { useCart } from '../../context/CartContext';
import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { useToast } from '../common/Toast';
import { Link } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose }) => {
  const toast = useToast();
  const { cart, removeFromCart, cartTotal, addToCart } = useCart();
  const [managedOffers, setManagedOffers] = useState([]);
  const [expandedOfferDesc, setExpandedOfferDesc] = useState(null);
  const [upsellQuantities, setUpsellQuantities] = useState({});
  const hasItems = cart.length > 0;

  useEffect(() => {
    const loadManagedOffers = async () => {
        try {
            const data = await api.recommendations.getAll('cart');
            setManagedOffers(data);
            const q = {};
            data.forEach(r => q[r._id] = 1);
            setUpsellQuantities(q);
        } catch (err) {
            console.error('Failed to load sidebar cart offers', err);
        }
    };
    if (isOpen) loadManagedOffers();
  }, [isOpen]);

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

  return (
    <div 
      className={`fixed inset-0 z-[200] transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        className={`absolute top-0 right-0 w-full max-w-[400px] h-full bg-[#F4F2EA] shadow-2xl transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-[14px] tracking-[0.2em] font-light uppercase">Shopping Bag</h2>
            <button 
              onClick={onClose}
              className="p-1 -mr-1 hover:opacity-70 transition-opacity"
            >
              <IoCloseSharp className="w-6 h-6 stroke-[1px]" />
            </button>
          </div>
          
          {!hasItems ? (
            <div className="flex-1 flex flex-col items-center">
              <p className="text-[12px] tracking-widest text-neutral-600 mb-10 font-light mt-10">Your bag is currently empty</p>
              
              <div className="w-full mb-8">
                <div className="border border-neutral-300 py-3 px-4 text-center">
                  <p className="text-[10px] tracking-[0.1em] font-light uppercase">
                    Spend <span className="font-bold">£120.00</span> for free shipping
                  </p>
                </div>
              </div>

              {/* Show Recommendations here too when empty */}
              {managedOffers.length > 0 && (
                <div className="w-full mb-10 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-px bg-neutral-200 flex-1"></div>
                    <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-black">Specially Selected</span>
                    <div className="h-px bg-neutral-200 flex-1"></div>
                  </div>
                  {managedOffers.map((offer) => (
                    <div key={`empty-${offer._id}`} className="bg-white border border-neutral-200 p-4 rounded-xl shadow-sm">
                        <div className="flex gap-3">
                            <div className="w-12 h-16 bg-neutral-100 rounded-lg overflow-hidden shrink-0 border border-neutral-100">
                                <img src={offer.image || offer.product?.images?.[0] || offer.product?.image} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[10px] font-bold tracking-tight text-neutral-800 uppercase truncate">{offer.product?.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-black text-neutral-900">£{(offer.product?.price * (1 - offer.discountPercentage/100)).toFixed(2)}</span>
                                </div>
                                <button 
                                    onClick={() => handleAddManagedOffer(offer)}
                                    className="mt-2 w-full bg-[#1C1C1C] text-white h-7 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-black transition-all"
                                >
                                    Quick Add
                                </button>
                            </div>
                        </div>
                    </div>
                  ))}
                </div>
              )}

              <button 
                onClick={onClose}
                className="w-full bg-[#1C1C1C] text-white py-4 text-[11px] tracking-[0.3em] font-light uppercase hover:bg-black transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              {/* Product Items */}
              <div className="flex-1">
                {cart.map((item, idx) => (
                  <div key={`${item._id}-${item.selectedSize}-${item.selectedLength}-${idx}`} className="flex gap-6 mb-10 pb-10 border-b border-neutral-200/50 last:border-0 last:pb-0">
                    <div className="w-24 h-32 bg-neutral-200 overflow-hidden shrink-0">
                      <img 
                        src={item.coverImage || item.image || (item.images && item.images[0]) || 'https://via.placeholder.com/300x400'} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <Link to={`/product/${item.slug || item._id}`} onClick={onClose} className="text-[11px] tracking-[0.15em] font-bold uppercase hover:opacity-70 transition-opacity">
                          {item.title}
                        </Link>
                      </div>
                      <div className="text-[10px] tracking-widest text-neutral-500 space-y-1 mb-4 flex flex-col">
                        <span className="uppercase">Size: {item.selectedSize || 'N/A'}</span>
                        {item.selectedLength && <span className="uppercase">Length: {item.selectedLength}</span>}
                        {item.selectedColor && (
                          <div className="flex items-center gap-2">
                             <span className="uppercase">Color:</span>
                             <div className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: item.selectedColor }} />
                          </div>
                        )}
                        <span className="uppercase font-medium text-black">Qty: {item.quantity}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <p className="text-[11px] font-bold tracking-widest">£{(+item.price || 0).toFixed(2)}</p>
                        
                        <button 
                          onClick={() => removeFromCart(item._id, item.selectedSize, item.selectedLength, item.selectedColor)}
                          className="text-neutral-500 hover:text-black transition-colors"
                        >
                          <IoTrashOutline size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Managed Cart Recommendations */}
              {managedOffers.length > 0 && managedOffers.filter(rec => !cart.some(item => (item._id || item.id) === (rec.product?._id || rec.product?.id))).length > 0 && (
                <div className="mt-8 mb-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px bg-neutral-200 flex-1"></div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-black">Special Offers</span>
                    <div className="h-px bg-neutral-200 flex-1"></div>
                  </div>
                  {managedOffers.filter(rec => !cart.some(item => (item._id || item.id) === (rec.product?._id || rec.product?.id))).map((offer) => (
                    <div key={offer._id} className="bg-white border border-neutral-200 p-4 rounded-xl shadow-sm">
                        <div className="flex gap-4">
                            <div className="w-14 h-18 bg-neutral-100 rounded-lg overflow-hidden shrink-0 border border-neutral-100">
                                <img 
                                    src={offer.image || offer.product?.images?.[0] || offer.product?.image} 
                                    alt={offer.product?.title} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className="text-[11px] font-bold tracking-tight text-neutral-800 uppercase leading-tight truncate">{offer.product?.title}</h4>
                                    <div className="text-right shrink-0">
                                        <p className="text-[9px] text-red-600 line-through font-medium">£{offer.product?.price?.toFixed(2)}</p>
                                        <p className="text-[11px] font-black text-neutral-900">£{(offer.product?.price * (1 - offer.discountPercentage/100)).toFixed(2)}</p>
                                    </div>
                                </div>
                                <p className="text-[10px] text-neutral-500 font-medium mt-1 uppercase tracking-tighter line-clamp-1">{offer.heading}</p>
                                
                                <button 
                                  onClick={() => setExpandedOfferDesc(expandedOfferDesc === offer._id ? null : offer._id)}
                                  className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-1 hover:text-black transition-colors"
                                >
                                  Details <IoChevronDown size={10} className={`transition-transform duration-300 ${expandedOfferDesc === offer._id ? 'rotate-180' : ''}`} />
                                </button>

                                <div className={`grid transition-all duration-500 ease-in-out ${expandedOfferDesc === offer._id ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <p className="text-[9px] leading-relaxed text-neutral-500 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                                            {offer.description || offer.product.description || 'A hand-crafted protocol designed for the modern lifestyle.'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mt-3 flex items-center gap-2">
                                    <div className="flex items-center border border-neutral-200 rounded-lg bg-white h-7 px-1">
                                        <button onClick={() => updateUpsellQty(offer._id, -1)} className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-black transition-colors text-lg font-light">—</button>
                                        <span className="w-5 text-center text-[10px] font-black">{upsellQuantities[offer._id] || 1}</span>
                                        <button onClick={() => updateUpsellQty(offer._id, 1)} className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-black transition-colors text-lg font-light">+</button>
                                    </div>
                                    <button 
                                        onClick={() => handleAddManagedOffer(offer)}
                                        className="grow bg-[#1C1C1C] text-white h-7 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-sm"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer Section */}
              <div className="mt-auto pt-6 space-y-6">
                <div className="flex justify-between items-center px-1">
                   <span className="text-[12px] font-bold uppercase tracking-[0.15em]">Subtotal</span>
                   <span className="text-[14px] font-bold">£{cartTotal.toFixed(2)}</span>
                </div>

                <div className="border border-neutral-300 py-3 px-4 text-center">
                  <p className="text-[10px] tracking-[0.15em] font-light uppercase">
                    {cartTotal >= 120 ? (
                      <span className="text-green-600 font-bold tracking-[0.2em]">You qualify for free shipping!</span>
                    ) : (
                      <>Spend <span className="font-bold">£{(120 - cartTotal).toFixed(2)} more</span> for free shipping</>
                    )}
                  </p>
                </div>

                <Link 
                  to="/cart"
                  onClick={onClose}
                  className="block w-full bg-[#1C1C1C] text-white py-4 text-[11px] tracking-[0.3em] font-light uppercase text-center hover:bg-black transition-colors shadow-xl"
                >
                  View Your Bag
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
