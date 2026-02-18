import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoChevronDown, IoSearchOutline, IoInformationCircleOutline, IoLockClosedOutline, IoBagOutline } from 'react-icons/io5';

const Checkout = () => {
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  const upsellProducts = [
    {
      id: 1,
      name: "Silani Oud Bakhoor",
      originalPrice: "35.00",
      discountPrice: "26.25",
      image: "https://aabcollection.com/cdn/shop/files/Aab_Massai_Maxi_Dress_Multicolour_1.jpg?v=1708428543&width=100"
    },
    {
      id: 2,
      name: "Criss Cross Hijab Undercap",
      originalPrice: "9.00",
      discountPrice: "6.75",
      image: "https://aabcollection.com/cdn/shop/files/Aab_Massai_Maxi_Dress_Multicolour_1.jpg?v=1708428543&width=100"
    }
  ];

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
            <span className="absolute -top-1 -right-1.5 text-[9px] font-bold text-neutral-600">(1)</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2">
      {/* <div className="max-w-screen-2xl mx-auto grid lg:grid-cols-2"> */}
        
        {/* Left Column: Forms */}
        <div className="p-8 lg:p-16 lg:max-w-3xl ml-auto w-full">
          <div className="space-y-12">
            
            {/* Upsell Sections */}
            <div className="space-y-6 pt-4">
              {upsellProducts.map((product) => (
                <div key={product.id} className="border border-neutral-200 p-6 rounded-sm bg-neutral-50/30">
                  <p className="text-[11px] tracking-widest font-bold mb-4">Add this product to your order and get 25% OFF</p>
                  <div className="flex gap-4">
                    <img src={product.image} alt={product.name} className="w-16 h-20 object-cover border border-neutral-200" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-[13px] font-bold tracking-tight">{product.name}</h4>
                          <button className="text-[11px] text-neutral-500 flex items-center gap-1 mt-1 uppercase tracking-widest">
                            Description <IoChevronDown size={10} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-red-600 line-through">£{product.originalPrice}</p>
                          <p className="text-[13px] font-bold">£{product.discountPrice}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-3">
                        <div className="flex items-center border border-neutral-300 rounded-sm">
                          <button className="px-3 py-1 text-neutral-400">—</button>
                          <span className="px-2 text-[12px]">1</span>
                          <button className="px-3 py-1 text-neutral-400">+</button>
                        </div>
                        <button className="flex-1 bg-neutral-100 border border-neutral-300 py-2.5 text-[11px] tracking-widest uppercase font-bold hover:bg-neutral-200 transition-colors">
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
                <Link to="/login" className="text-[12px] underline text-neutral-600 font-medium">Have an account? Log in</Link>
              </div>
              <input 
                type="email" 
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
            <div className="flex items-center gap-4 mb-10">
              <div className="relative">
                <img 
                  src="https://aabcollection.com/cdn/shop/files/Aab_Massai_Maxi_Dress_Multicolour_1.jpg?v=1708428543&width=150" 
                  alt="Product" 
                  className="w-16 h-20 object-cover border border-neutral-300 rounded-md" 
                />
                <span className="absolute -top-2 -right-2 bg-neutral-600/90 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
              </div>
              <div className="flex-1 text-[13px]">
                <h3 className="font-bold tracking-tight">Massai Maxi</h3>
                <p className="text-neutral-500 text-[11px]">S / 56</p>
              </div>
              <p className="text-[13px] font-bold tracking-widest">£53.40</p>
            </div>

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
                <span className="font-bold tracking-widest">£53.40</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-neutral-600">Shipping</span>
                <span className="text-[11px] text-neutral-400 uppercase tracking-widest leading-loose">Enter shipping address</span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-[17px] font-medium">Total</span>
                <div className="text-right">
                  <span className="text-[11px] text-neutral-400 mr-2">GBP</span>
                  <span className="text-[22px] font-black tracking-widest">£53.40</span>
                </div>
              </div>
              <p className="text-[11px] text-neutral-400 text-right mt-1">Including £8.90 in taxes</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
