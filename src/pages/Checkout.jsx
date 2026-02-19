import { IoBagOutline, IoChevronDown, IoInformationCircleOutline, IoLockClosedOutline, IoSearchOutline } from 'react-icons/io5';
import { api } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../components/common/Toast';

const Checkout = () => {
  const toast = useToast();
  const { cart, cartTotal, cartCount, addToCart } = useCart();
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [recommendations, setRecommendations] = useState([]);
  const [expandedDesc, setExpandedDesc] = useState(null); // Track which ID is expanded
  const [upsellQuantities, setUpsellQuantities] = useState({}); // { recId: quantity }

  useEffect(() => {
    const loadRecommendations = async () => {
        try {
            const data = await api.recommendations.getAll('checkout');
            setRecommendations(data);
            // Initialize quantities
            const q = {};
            data.forEach(r => q[r._id] = 1);
            setUpsellQuantities(q);
        } catch (err) {
            console.error('Failed to load checkout recommendations', err);
        }
    };
    loadRecommendations();
  }, []);

  // UK VAT is 20% of the total price (already included in product prices usually, but let's show it as "including £X in taxes")
  const VAT_RATE = 0.20;
  const taxes = cartTotal * (VAT_RATE / (1 + VAT_RATE)); // If price includes tax
  
  const handleAddUpsell = (rec) => {
    // Ensure all required properties are present for the cart
    const productToBag = {
        ...rec.product,
        selectedSize: rec.product.sizes?.[0] || 'One Size',
        selectedLength: rec.product.lengths?.[0] || 'Standard',
        selectedColor: rec.product.colors?.[0] || 'Original',
        quantity: upsellQuantities[rec._id] || 1
    };
    addToCart(productToBag);
    toast.success(`${rec.product.title} added to bag!`);
  };

  const updateUpsellQty = (id, delta) => {
    setUpsellQuantities(prev => ({
        ...prev,
        [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const toggleDescription = (id) => {
    setExpandedDesc(expandedDesc === id ? null : id);
  };

  const activeUpsells = recommendations.filter(rec => 
    rec.product && !cart.some(item => (item._id || item.id) === (rec.product._id || rec.product.id))
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F4F2EA] flex flex-col items-center justify-center p-8 text-center text-neutral-800">
        <h1 className="text-[22px] tracking-[0.35em] font-light uppercase mb-8">Checkout is Empty</h1>
        <Link to="/collections/all" className="bg-[#1C1C1C] text-white px-12 py-4 text-[11px] tracking-[0.2em] font-medium uppercase hover:bg-black transition-all">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Checkout Header */}
      <div className="bg-[#F4F2EA] max-w-5xl mx-auto border-b border-neutral-300/70 mb-1">
        <div className="max-w-screen-2xl mx-auto px-8 lg:px-16 h-20 flex items-center justify-between">
          <Link to="/">
            <img src="/brand_logo.png" alt="aab" className="h-10 w-auto object-contain" />
          </Link>
          <div className="relative">
            <IoBagOutline size={22} className="text-neutral-700" />
            <span className="absolute -top-1 -right-1.5 text-[9px] font-bold text-neutral-600">({cartCount})</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2">
        {/* Left Column: Forms */}
        <div className="p-8 lg:p-16 lg:max-w-3xl ml-auto w-full">
          <div className="space-y-12">
            
            {/* Express Checkout */}
            <div>
              <p className="text-center text-[11px] tracking-widest text-neutral-500 uppercase mb-4">Express checkout</p>
              <div className="grid grid-cols-3 gap-3">
                <button className="bg-[#5A31F4] h-12 rounded-sm flex items-center justify-center text-white font-bold italic text-lg">shop Pay</button>
                <button className="bg-[#FFC439] h-12 rounded-sm flex items-center justify-center text-[#2C2E2F] font-bold text-lg">PayPal</button>
                <button className="bg-black h-12 rounded-sm flex items-center justify-center text-white text-lg"><span className="font-bold">G</span> Pay</button>
              </div>
              <div className="flex items-center gap-4 my-8">
                <div className="h-px bg-neutral-200 flex-1"></div>
                <span className="text-[11px] text-neutral-400 uppercase tracking-widest">OR</span>
                <div className="h-px bg-neutral-200 flex-1"></div>
              </div>
            </div>

            {/* Contact */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[17px] font-medium">Contact</h2>
                {!user && <Link to="/login" className="text-[12px] underline text-neutral-600 font-medium">Have an account? Log in</Link>}
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email" 
                className="w-full border border-neutral-300 p-3.5 rounded-sm text-[14px] outline-none focus:ring-1 focus:ring-black transition-all"
              />
              <label className="flex items-center gap-3 mt-4 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded-sm border-neutral-300 accent-black" defaultChecked />
                <span className="text-[12px] text-neutral-600">Email me with news and offers</span>
              </label>
            </section>

            {/* Delivery */}
            <section className="space-y-4 pt-4">
              <h2 className="text-[17px] font-medium mb-4">Delivery</h2>
              <div className="relative">
                <select className="w-full border border-neutral-300 p-3.5 rounded-sm bg-white text-[14px] appearance-none outline-none focus:ring-1 focus:ring-black transition-all">
                  <option>United Kingdom</option>
                </select>
                <IoChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First name" className="border border-neutral-300 p-3.5 rounded-sm text-[14px] outline-none focus:ring-1 focus:ring-black transition-all" />
                <input type="text" placeholder="Last name" className="border border-neutral-300 p-3.5 rounded-sm text-[14px] outline-none focus:ring-1 focus:ring-black transition-all" />
              </div>
              <input type="text" placeholder="Company (optional)" className="w-full border border-neutral-300 p-3.5 rounded-sm text-[14px] outline-none focus:ring-1 focus:ring-black transition-all" />
              <div className="relative">
                <input type="text" placeholder="Address" className="w-full border border-neutral-300 p-3.5 rounded-sm text-[14px] outline-none focus:ring-1 focus:ring-black pr-10 transition-all" />
                <IoSearchOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              </div>
              <input type="text" placeholder="Apartment, suite, etc. (optional)" className="w-full border border-neutral-300 p-3.5 rounded-sm text-[14px] outline-none focus:ring-1 focus:ring-black transition-all" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" className="border border-neutral-300 p-3.5 rounded-sm text-[14px] outline-none focus:ring-1 focus:ring-black transition-all" />
                <input type="text" placeholder="Postcode" className="border border-neutral-300 p-3.5 rounded-sm text-[14px] outline-none focus:ring-1 focus:ring-black transition-all" />
              </div>
              <div className="relative">
                <input type="text" placeholder="Phone" className="w-full border border-neutral-300 p-3.5 rounded-sm text-[14px] outline-none focus:ring-1 focus:ring-black pr-10 transition-all" />
                <IoInformationCircleOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              </div>
              <label className="flex items-center gap-3 mt-4 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded-sm border-neutral-300 accent-black" />
                <span className="text-[12px] text-neutral-600">Text me with news and offers</span>
              </label>
            </section>

            {/* Shipping Method */}
            <section className="pt-4">
              <h2 className="text-[17px] font-medium mb-4">Shipping method</h2>
              <div className="bg-[#F8F5F1] p-6 rounded-sm text-[12px] text-neutral-500 text-center border border-neutral-200">
                Enter your shipping address to view available shipping methods.
              </div>
            </section>

            {/* Payment Section */}
            <section className="space-y-4 pt-4">
              <div>
                <h2 className="text-[17px] font-medium">Payment</h2>
                <p className="text-[12px] text-neutral-500">All transactions are secure and encrypted.</p>
              </div>

              <div className="border border-neutral-300 rounded-sm overflow-hidden">
                {/* Credit Card */}
                <div className={`p-4 ${paymentMethod === 'credit-card' ? 'bg-[#F8F5F1]' : 'bg-white'} border-b border-neutral-200 transition-colors`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'credit-card'}
                        onChange={() => setPaymentMethod('credit-card')}
                        className="w-4 h-4 accent-black" 
                      />
                      <span className="text-[13px] font-medium">Credit card</span>
                    </div>
                    <div className="flex gap-1 border border-neutral-200 rounded-sm bg-white p-1">
                      <div className="w-6 h-4 bg-neutral-200 rounded-xs"></div>
                      <div className="w-6 h-4 bg-neutral-200 rounded-xs"></div>
                      <div className="w-6 h-4 bg-neutral-200 rounded-xs"></div>
                      <span className="text-[8px] px-1">+5</span>
                    </div>
                  </label>
                  
                  {paymentMethod === 'credit-card' && (
                    <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="relative">
                        <input type="text" placeholder="Card number" className="w-full border border-neutral-300 p-3.5 rounded-sm text-[14px] bg-white outline-none focus:ring-1 focus:ring-black pr-10" />
                        <IoLockClosedOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="Expiration date (MM / YY)" className="border border-neutral-300 p-3.5 rounded-sm text-[14px] bg-white outline-none focus:ring-1 focus:ring-black" />
                        <div className="relative">
                          <input type="text" placeholder="Security code" className="w-full border border-neutral-300 p-3.5 rounded-sm text-[14px] bg-white outline-none focus:ring-1 focus:ring-black pr-10" />
                          <IoInformationCircleOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                        </div>
                      </div>
                      <input type="text" placeholder="Name on card" className="w-full border border-neutral-300 p-3.5 rounded-sm text-[14px] bg-white outline-none focus:ring-1 focus:ring-black" />
                      <label className="flex items-center gap-3 mt-4 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded-sm border-neutral-300 accent-black" defaultChecked />
                        <span className="text-[12px] text-neutral-600">Use shipping address as billing address</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* PayPal */}
                <div className={`p-4 border-b border-neutral-200 ${paymentMethod === 'paypal' ? 'bg-[#F8F5F1]' : 'bg-white'} transition-colors`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="w-4 h-4 accent-black" 
                      />
                      <span className="text-[13px] font-medium">PayPal</span>
                    </div>
                    <span className="text-[13px] font-bold italic text-[#003087]">PayPal</span>
                  </label>
                </div>

                {/* Clearpay */}
                <div className={`p-4 border-b border-neutral-200 ${paymentMethod === 'clearpay' ? 'bg-[#F8F5F1]' : 'bg-white'} transition-colors`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'clearpay'}
                        onChange={() => setPaymentMethod('clearpay')}
                        className="w-4 h-4 accent-black" 
                      />
                      <span className="text-[13px] font-medium">Clearpay</span>
                    </div>
                    <div className="w-6 h-6 bg-[#B2FCE4] rounded-full flex items-center justify-center">
                       <div className="w-3 h-3 bg-black rounded-[2px] rotate-45"></div>
                    </div>
                  </label>
                </div>

                {/* Klarna */}
                <div className={`p-4 ${paymentMethod === 'klarna' ? 'bg-[#F8F5F1]' : 'bg-white'} transition-colors`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'klarna'}
                        onChange={() => setPaymentMethod('klarna')}
                        className="w-4 h-4 accent-black" 
                      />
                      <span className="text-[13px] font-medium">Klarna - Flexible payments</span>
                    </div>
                    <div className="text-[11px] font-black tracking-tighter bg-[#FFB3C7] px-2 py-0.5 rounded-sm">Klarna.</div>
                  </label>
                </div>
              </div>
            </section>

            {/* Final Section */}
            <div className="pt-8">
              <h2 className="text-[14px] font-medium mb-4 tracking-tight uppercase">Save my information for a faster checkout</h2>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Mobile phone (optional)" 
                  className="w-full border border-neutral-300 p-3.5 pl-14 rounded-sm text-[14px] outline-none focus:ring-1 focus:ring-black transition-all" 
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-[14px] font-medium underline-offset-4">+44</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-6 leading-relaxed">
                By providing your phone number, you agree to create a Shop account subject to Shop's <button className="underline hover:text-black">terms</button> and <button className="underline hover:text-black">Privacy Policy</button>.
              </p>
              <button className="w-full bg-[#1C1C1C] text-white py-5 rounded-md text-[16px] font-bold mt-10 hover:bg-black transition-all shadow-2xl active:scale-[0.99]">
                Pay now
              </button>
            </div>

            <footer className="pt-10 border-t border-neutral-200 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-neutral-400">
              <button className="underline underline-offset-4 hover:text-black transition-colors">Refund policy</button>
              <button className="underline underline-offset-4 hover:text-black transition-colors">Privacy policy</button>
              <button className="underline underline-offset-4 hover:text-black transition-colors">Terms of service</button>
            </footer>
          </div>
        </div>

        {/* Right Column: Summary Overlay */}
        <div className="bg-[#F4F2EA] lg:sticky lg:top-0 lg:h-screen p-8 lg:p-16 border-l border-neutral-200 overflow-y-auto hidden lg:block">
          <div className="lg:max-w-md w-full">
            <div className="space-y-6 mb-10">
              {cart.map((item, idx) => (
                <div key={`${item._id || item.id}-${idx}`} className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={item.coverImage || item.image || item.images?.[0] || 'https://via.placeholder.com/150'} 
                      alt={item.title} 
                      className="w-16 h-20 object-cover border border-neutral-300 rounded-md" 
                    />
                    <span className="absolute -top-2 -right-2 bg-neutral-600/90 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 text-[13px]">
                    <h3 className="font-bold tracking-tight">{item.title}</h3>
                    <p className="text-neutral-500 text-[11px]">
                      {[item.selectedSize, item.selectedLength, item.selectedColor].filter(Boolean).join(' / ')}
                    </p>
                  </div>
                  <p className="text-[13px] font-bold tracking-widest">£{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Checkout Upsells (Sidebar) */}
            {activeUpsells.length > 0 && (
                <div className="mb-10 space-y-4 animate-in fade-in duration-700">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-200 pb-4 mb-4">Recommended for you</h3>
                    {activeUpsells.map((rec) => (
                        <div key={rec._id} className="bg-white border border-neutral-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex gap-4">
                                <div className="w-16 h-20 bg-neutral-100 rounded-lg overflow-hidden shrink-0 border border-neutral-200">
                                    <img 
                                        src={rec.image || rec.product.images?.[0] || rec.product.image || rec.product.coverImage || 'https://via.placeholder.com/150'} 
                                        alt={rec.product.title} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <h4 className="text-[12px] font-bold tracking-tight text-neutral-800 uppercase leading-tight truncate">{rec.product.title}</h4>
                                        <div className="text-right shrink-0">
                                            <p className="text-[10px] text-red-600 line-through font-medium">£{rec.product.price.toFixed(2)}</p>
                                            <p className="text-[12px] font-black text-neutral-900">£{(rec.product.price * (1 - rec.discountPercentage/100)).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    
                                    <p className="text-[11px] text-neutral-500 font-medium mt-1 uppercase tracking-tighter line-clamp-1">{rec.heading}</p>
                                    
                                    <button 
                                        onClick={() => toggleDescription(rec._id)}
                                        className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-1 hover:text-black transition-colors"
                                    >
                                        Details <IoChevronDown size={12} className={`transition-transform duration-300 ${expandedDesc === rec._id ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Description Accordion */}
                                    <div className={`grid transition-all duration-500 ease-in-out ${expandedDesc === rec._id ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] leading-relaxed text-neutral-500 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                                                {rec.description || rec.product.description || 'A hand-crafted protocol designed for the modern lifestyle.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center gap-2">
                                        <div className="flex items-center border border-neutral-200 rounded-lg bg-white h-8 px-1">
                                            <button onClick={() => updateUpsellQty(rec._id, -1)} className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-black transition-colors text-lg font-light">—</button>
                                            <span className="w-6 text-center text-[11px] font-black">{upsellQuantities[rec._id] || 1}</span>
                                            <button onClick={() => updateUpsellQty(rec._id, 1)} className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-black transition-colors text-lg font-light">+</button>
                                        </div>
                                        <button 
                                            onClick={() => handleAddUpsell(rec)}
                                            className="grow bg-[#1C1C1C] text-white h-8 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98] shadow-sm"
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

            <div className="flex gap-3 mb-10">
              <input 
                type="text" 
                placeholder="Discount code or gift card" 
                className="flex-1 border border-neutral-300 p-3.5 rounded-md bg-white text-[13px] outline-none" 
              />
              <button className="bg-neutral-200/50 border border-neutral-300 px-6 rounded-md text-[13px] text-neutral-400 font-bold hover:bg-neutral-200 transition-colors">
                Apply
              </button>
            </div>

            <div className="space-y-4 pt-6 border-t border-neutral-300/70">
              <div className="flex justify-between text-[13px]">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-bold tracking-widest">£{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-neutral-600">Shipping</span>
                <span className="text-[11px] text-neutral-400 uppercase tracking-widest leading-loose">
                  {cartTotal >= 120 ? 'Free' : 'Calculated at next step'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-[17px] font-medium">Total</span>
                <div className="text-right">
                  <span className="text-[11px] text-neutral-400 mr-2">GBP</span>
                  <span className="text-[22px] font-black tracking-widest">£{cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-[11px] text-neutral-400 text-right mt-1">Including £{taxes.toFixed(2)} in taxes</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
