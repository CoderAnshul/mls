import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import QuickAddModal from '../components/common/QuickAddModal';

const WishlistCard = ({ product, onRemove, onQuickAdd }) => {
  const primaryImage = product.coverImage || product.image || product.images?.[0] || null;
  const productLink = `/product/${product.slug || product._id || product.id}`;

  return (
    <div className="flex flex-col group">
      {/* Image Container */}
      <div className="relative w-full overflow-hidden bg-[#E8E6DE] aspect-[3/4.5] mb-6">
        <Link to={productLink} className="block w-full h-full">
          {primaryImage && (
            <img
              src={primaryImage}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
        </Link>
        
        {/* NEW IN Badge */}
        {(product.isNew || product.status === 'New') && (
          <div className="absolute top-4 left-4 bg-white rounded-full w-[44px] h-[44px] flex items-center justify-center shadow-sm">
            <span className="text-[8px] font-bold text-center leading-none uppercase tracking-tighter text-[#252423]">NEW IN</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col items-center flex-1 px-2 mb-6">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#252423] text-center mb-1 leading-tight">
          {product.title}
        </h3>
        <p className="text-[12px] text-[#252423] font-normal tracking-wide">
          {product.price ? `£${(+product.price).toFixed(2)}` : ''}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 w-full mt-auto">
        <button 
          onClick={() => onRemove(product)}
          className="flex-1 bg-[#EBE7DF] text-[#252423] py-4 text-[10px] tracking-[0.25em] font-bold uppercase hover:bg-[#E0DBCF] transition-colors"
        >
          REMOVE
        </button>
        <button 
          onClick={() => onQuickAdd(product)}
          className="flex-1 bg-[#252423] text-white py-4 text-[10px] tracking-[0.25em] font-bold uppercase hover:bg-black transition-colors"
        >
          ADD TO BAG
        </button>
      </div>
    </div>
  );
};

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  
  const handleQuickAdd = (product) => {
    setSelectedProduct(product);
    setIsQuickAddOpen(true);
  };

  const hasItems = wishlist.length > 0;

  return (
    <div className="bg-[#F4F2EA] min-h-screen py-16 px-4 md:px-12">
      <div className="max-w-screen-2xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="mb-12">
          <ol className="flex items-center space-x-2 text-[10px] tracking-[0.2em] font-medium uppercase">
            <li>
              <Link to="/" className="text-neutral-400 hover:text-black transition-colors">HOME</Link>
            </li>
            <li className="text-neutral-400">/</li>
            <li className="text-black">WISHLIST</li>
          </ol>
        </nav>

        {/* Wishlist Header */}
        <div className="flex flex-col items-center">
          <h1 className="text-[28px] tracking-[0.25em] font-light uppercase text-[#252423] mb-4">Wishlist</h1>
        </div>
          
        {!hasItems ? (
          <div className="text-center max-w-2xl mx-auto py-20">
            <p className="text-[13px] tracking-widest text-neutral-600 mb-10 font-light leading-relaxed">
              Your wishlist is empty.
            </p>
            <Link 
              to="/collections" 
              className="inline-block border border-black px-12 py-5 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {wishlist.map((product) => (
              <WishlistCard 
                key={product._id || product.id} 
                product={product} 
                onRemove={toggleWishlist}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Add Modal */}
      {selectedProduct && (
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          product={selectedProduct}
          onAdd={addToCart}
        />
      )}
    </div>
  );
};

export default Wishlist;
