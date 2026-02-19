import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoHeartOutline, IoHeart, IoBagOutline } from 'react-icons/io5';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import QuickAddModal from './QuickAddModal';

const ProductCard = ({ product, isEditorial = false }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const primaryImage = product.coverImage || product.image || product.images?.[0] || '/img/placeholder-product.jpg';
  const secondaryImage = product.hoverImage || product.images?.[1] || null;
  const productLink = `/product/${product.slug || product._id || product.id}`;

  if (isEditorial) {
    return (
      <Link to={productLink} className="relative aspect-[3/4] overflow-hidden group cursor-pointer bg-neutral-200 block">
        <img 
          src={primaryImage} 
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/10 transition-colors duration-500" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
          <h2 className="text-4xl md:text-5xl font-serif italic mb-6 tracking-wide text-center drop-shadow-sm">
            {product.title}
          </h2>
          <span className="text-[12px] font-medium uppercase tracking-[0.25em] border-b border-white pb-1 group-hover:pb-2 transition-all">
            SHOP NOW
          </span>
        </div>
      </Link>
    );
  }

  return (
    <>
      <Link to={productLink} className="flex flex-col gap-6 group cursor-pointer outline-none">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#E5E5E5]">
          {/* Cover Image */}
          <img 
            src={primaryImage} 
            alt={product.title}
            className={`w-full h-full object-cover transition-all duration-700 ${secondaryImage ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'}`}
          />

          {/* Hover Image */}
          {secondaryImage && (
            <img 
              src={secondaryImage} 
              alt={`${product.title} hover`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
            />
          )}
          
          {/* New In Tag - Top Left */}
          {(product.isNew || product.status === 'New') && (
            <div className="absolute top-5 left-5 bg-white rounded-full w-[46px] h-[46px] flex items-center justify-center shadow-sm z-10">
              <span className="text-[9px] font-bold text-center leading-none uppercase tracking-tighter text-[#252423]">
                NEW IN
              </span>
            </div>
          )}

          {/* Wishlist Icon - Top Right */}
          <button 
            className="absolute top-6 right-6 p-1 text-black/80 hover:text-black transition-colors z-10" 
            onClick={(e) => { 
              e.preventDefault(); 
              e.stopPropagation(); 
              toggleWishlist(product);
            }}
          >
            {isInWishlist(product._id || product.id) ? (
              <IoHeart className="w-[22px] h-[22px]" />
            ) : (
              <IoHeartOutline className="w-[22px] h-[22px] stroke-[1px]" />
            )}
          </button>

          {/* Add to Cart Icon - Bottom Left */}
          <button 
            className="absolute bottom-6 left-6 p-1 text-black/80 hover:text-black transition-colors z-10" 
            onClick={(e) => { 
              e.preventDefault(); 
              e.stopPropagation(); 
              setIsQuickAddOpen(true);
            }}
          >
            <IoBagOutline className="w-[22px] h-[22px] stroke-[1px]" />
          </button>

          {/* Carousel Indicators - Bottom Right */}
          <div className="absolute bottom-6 right-6 flex gap-1.5 z-10">
            {[0, 1, 2, 3].map((_, i) => (
              <div key={i} className={`w-[5px] h-[5px] rounded-full ${i === 2 ? 'bg-black/60' : 'bg-black/20'}`} />
            ))}
          </div>

          {/* Thin Line in Middle */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/5 pointer-events-none" />
        </div>

        <div className="text-center flex flex-col gap-2">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#252423]">
            {product.title}
          </h3>
          <p className="text-[12px] text-neutral-500 font-medium tracking-wide">
            £{(+product.price || 0).toFixed(2)}
          </p>
        </div>
      </Link>

      {/* Quick Add Modal - Outside Link to prevent navigation on interactions */}
      <QuickAddModal 
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        product={product}
        onAdd={addToCart}
      />
    </>
  );
};

export default ProductCard;
