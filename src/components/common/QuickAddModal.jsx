import React, { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

const QuickAddModal = ({ product, isOpen, onClose, onAdd }) => {
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [selectedLength, setSelectedLength] = useState(null);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);

  // Use product options if available, fallback to defaults
  const sizes = product?.sizes?.length > 0 ? product.sizes : ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const lengths = ['52', '54', '56', '58', '62'];
  const colors = product?.colors || [];
  const outOfStockSizes = ['XXS']; // For the strike-through effect in screenshot

  // Reset state when product changes
  React.useEffect(() => {
    setSelectedSize(product?.sizes?.[0] || null);
    setSelectedLength(null);
    setSelectedColor(product?.colors?.[0] || null);
  }, [product]);

  // Lock scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  const handleAdd = () => {
    if (selectedSize && (selectedLength || !lengths.length)) {
      onAdd(product, selectedSize, selectedLength, selectedColor);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        />

        {/* Modal content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-[580px] bg-[#E8E6DE] p-10 sm:p-14 border border-black/10 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-neutral-500 hover:text-black transition-colors"
          >
            <IoCloseOutline size={28} />
          </button>

          <div className="flex flex-col items-center">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.25em] text-[#252423] mb-12">
              Select Your Options
            </h2>

            {/* Colors */}
            {colors.length > 0 && (
              <div className="w-full mb-10">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-[#252423] mb-4">Select Colour</span>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-full border-2 transition-all duration-300 transform hover:scale-110
                        ${selectedColor === color ? 'border-black scale-110 ring-2 ring-black/5 ring-offset-2' : 'border-white'}
                      `}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div className="w-full mb-10">
              <div className="flex justify-between items-baseline mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#252423]">Select Size</span>
                <button className="text-[9px] font-bold uppercase tracking-widest text-[#252423] border-b border-black/20 pb-0.5 hover:border-black transition-all">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {sizes.map((size) => {
                  const isOutOfStock = outOfStockSizes.includes(size);
                  return (
                    <button
                      key={size}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedSize(size)}
                      className={`relative w-[48px] h-[36px] flex items-center justify-center text-[11px] font-bold tracking-widest border transition-all
                        ${isOutOfStock ? 'opacity-40 cursor-not-allowed bg-neutral-100/50' : 'cursor-pointer hover:border-black'}
                        ${selectedSize === size ? 'bg-[#252423] text-white border-[#252423]' : 'bg-transparent border-black/10 text-[#252423]'}
                      `}
                    >
                      {size}
                      {isOutOfStock && (
                        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-neutral-400 -rotate-[35deg]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lengths (State 2) */}
            {selectedSize && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mb-10"
              >
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#252423]">Select Length (Inches)</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {lengths.map((len) => (
                    <button
                      key={len}
                      onClick={() => setSelectedLength(len)}
                      className={`w-[48px] h-[36px] flex items-center justify-center text-[11px] font-bold tracking-widest border transition-all cursor-pointer hover:border-black
                        ${selectedLength === len ? 'bg-[#252423] text-white border-[#252423]' : 'bg-transparent border-black/10 text-[#252423]'}
                      `}
                    >
                      {len}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Inventory Note (State 3) */}
            {selectedSize && selectedLength && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[11px] font-medium tracking-widest text-orange-700 mb-8 italic"
              >
                Hurry last 3 remaining
              </motion.p>
            )}

            {/* Add to Bag Button */}
            <button
              onClick={handleAdd}
              disabled={!selectedSize || !selectedLength}
              className={`w-full py-4 text-[11px] font-bold uppercase tracking-[0.3em] transition-all
                ${(selectedSize && selectedLength) 
                  ? 'bg-[#252423] text-white hover:bg-black' 
                  : 'bg-transparent border border-black/10 text-[#252423]/40 cursor-not-allowed'}
              `}
            >
              Add To Bag
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickAddModal;
