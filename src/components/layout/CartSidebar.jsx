import { IoCloseSharp, IoTrashOutline } from 'react-icons/io5';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, cartTotal } = useCart();
  const hasItems = cart.length > 0;



  return (
    <div 
      className={`fixed inset-0 z-[99] transition-opacity duration-300 ${
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
