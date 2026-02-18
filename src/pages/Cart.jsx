import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoChevronBack, IoHeartOutline, IoTrashOutline, IoChevronDown } from 'react-icons/io5';

const Cart = () => {
  const [quantity, setQuantity] = useState(1);

  const matchingProducts = [
    {
      id: 1,
      name: "ICE JERSEY HIJAB",
      price: "12.00",
      image: "https://aabcollection.com/cdn/shop/files/Aab_Massai_Maxi_Dress_Multicolour_1.jpg?v=1708428543&width=300" // Placeholder
    },
    {
      id: 2,
      name: "SIDE CROSS HIJAB CAP",
      price: "9.00",
      image: "https://aabcollection.com/cdn/shop/files/Aab_Massai_Maxi_Dress_Multicolour_1.jpg?v=1708428543&width=300" // Placeholder
    }
  ];

  return (
    <div className="bg-[#F4F2EA] min-h-screen py-10 px-4 md:px-8 lg:px-12">
      <div className="max-w-screen-2xl mx-auto">
        {/* Back Button */}
        <Link to="/" className="flex items-center gap-2 text-[11px] tracking-[0.2em] font-light uppercase hover:opacity-70 transition-opacity mb-8">
          <IoChevronBack size={14} />
          Back
        </Link>

        {/* Title */}
        <h1 className="text-center text-[22px] tracking-[0.35em] font-light uppercase mb-16">Shopping Bag</h1>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* Main Content (Left) */}
          <div className="lg:col-span-8">
            <div className="flex flex-col md:flex-row gap-8 pb-12 border-b border-neutral-300/50 relative">
              {/* Product Image */}
              <div className="w-full md:w-[260px] aspect-[3/4] h-[330px] bg-neutral-200 relative group overflow-hidden">
                <img 
                  src="https://aabcollection.com/cdn/shop/files/Aab_Massai_Maxi_Dress_Multicolour_1.jpg?v=1708428543&width=600" 
                  alt="Massai Maxi" 
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                  <IoHeartOutline size={16} />
                </button>
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-5">
                  <h2 className="text-[13px] tracking-[0.15em] font-bold uppercase text-neutral-800">Massai Maxi</h2>
                  <p className="text-[13px] tracking-widest font-bold">£53.40</p>
                </div>

                <div className="space-y-1.5 mb-10">
                  <p className="text-[11px] tracking-widest text-neutral-500 uppercase font-light">Size: S</p>
                  <p className="text-[11px] tracking-widest text-neutral-500 uppercase font-light">Length (Inches): 56</p>
                </div>

                <div className="flex items-center gap-8">
                  <div className="relative inline-block">
                    <select 
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="appearance-none bg-transparent border border-neutral-300 py-2 pl-3 pr-8 text-[11px] tracking-widest outline-none cursor-pointer min-w-[70px]"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                    </select>
                    <IoChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-neutral-400" />
                  </div>
                  
                  <button className="text-neutral-400 hover:text-black transition-colors">
                    <IoTrashOutline size={18} />
                  </button>
                </div>

                {/* Recommendations Section */}
                <div className="mt-14">
                  <h3 className="text-[10px] tracking-[0.2em] font-medium uppercase text-neutral-400 mb-6">Add Matching Product</h3>
                  <div className="space-y-5">
                    {matchingProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between py-3.5 border-t border-neutral-300/30 first:border-t-0">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-18 bg-neutral-200 overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="text-[10px] tracking-[0.1em] font-bold uppercase mb-0.5 text-neutral-700">{product.name}</h4>
                            <p className="text-[10px] tracking-widest font-light text-neutral-500">£{product.price}</p>
                          </div>
                        </div>
                        <button className="bg-[#1C1C1C] text-white px-6 py-2 text-[9px] tracking-[0.2em] font-medium uppercase hover:bg-black transition-colors">
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Sidebar (Right) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              <h2 className="text-[13px] tracking-[0.15em] font-bold uppercase mb-8 border-b border-neutral-300/50 pb-4">Order Summary</h2>
              
              <div className="space-y-4 pb-8 border-b border-neutral-300/50">
                <div className="flex justify-between items-center text-[11px] tracking-widest">
                  <span className="text-neutral-500 uppercase font-light italic">Massai Maxi</span>
                  <span className="font-bold">£53.40</span>
                </div>
                <div className="flex justify-between items-center text-[12px] tracking-widest pt-3 border-t border-neutral-200/50">
                  <span className="font-bold uppercase text-[11px]">Subtotal</span>
                  <span className="font-bold">£53.40</span>
                </div>
              </div>

              {/* Free Shipping Progress */}
              <div className="bg-[#EAE1D4]/40 border border-neutral-300/30 p-5 text-center">
                <p className="text-[10px] tracking-[0.1em] font-light uppercase leading-relaxed text-neutral-600">
                  Spend <span className="font-bold text-neutral-800">£66.60 more</span> for free shipping
                </p>
              </div>

              <Link 
                to="/checkout"
                className="block w-full text-center bg-[#1C1C1C] text-white py-4.5 text-[11px] tracking-[0.25em] font-medium uppercase hover:bg-black transition-all shadow-xl active:scale-[0.98]"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
