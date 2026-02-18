import React, { useRef, useEffect, useState } from 'react';

const Lookbook = () => {
  const scrollContainerRef = useRef(null);
  const targetScrollLeft = useRef(0);
  const currentScrollLeft = useRef(0);
  const requestRef = useRef();

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const smoothScroll = () => {
      // Linear interpolation for smooth damping
      // Using a factor of 0.05 for extreme smoothness
      const lerp = (start, end, factor) => start + (end - start) * factor;
      
      currentScrollLeft.current = lerp(currentScrollLeft.current, targetScrollLeft.current, 0.05);
      container.scrollLeft = currentScrollLeft.current;

      requestRef.current = requestAnimationFrame(smoothScroll);
    };

    const handleWheel = (e) => {
      e.preventDefault();
      // "20% and smoother" - taking 20% of the delta for slower, more controlled feel
      const scrollSpeed = 0.2;
      targetScrollLeft.current += e.deltaY * scrollSpeed;

      // Bound the target
      const maxScroll = container.scrollWidth - container.clientWidth;
      targetScrollLeft.current = Math.max(0, Math.min(targetScrollLeft.current, maxScroll));
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    requestRef.current = requestAnimationFrame(smoothScroll);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const galleryImages = [
    "https://aabcollection.com/cdn/shop/files/AAB_RAMADAN24_BANNER_2.jpg?v=1706698655&width=1600",
    "https://aabcollection.com/cdn/shop/files/Aab_Ramadan_Card.jpg?v=1706698655&width=800",
    "https://aabcollection.com/cdn/shop/files/Aab_Ramadan_Note.jpg?v=1706698655&width=800",
    "https://aabcollection.com/cdn/shop/files/Aab_Ramadan_Model_1.jpg?v=1706698655&width=1200",
    "https://aabcollection.com/cdn/shop/files/Aab_Ramadan_Detail_1.jpg?v=1706698655&width=800",
    "https://aabcollection.com/cdn/shop/files/AAB_AW24_EDITORIAL_1.jpg?v=1731670984&width=1200",
    "https://aabcollection.com/cdn/shop/files/AAB_AW24_EDITORIAL_2.jpg?v=1731670984&width=1200",
    "https://aabcollection.com/cdn/shop/files/AAB_AW24_EDITORIAL_3.jpg?v=1731670984&width=1200",
    "https://aabcollection.com/cdn/shop/files/AAB_AW24_EDITORIAL_4.jpg?v=1731670984&width=1200",
    "https://aabcollection.com/cdn/shop/files/AAB_AW24_EDITORIAL_5.jpg?v=1731670984&width=1200",
    "https://aabcollection.com/cdn/shop/files/AAB_AW24_EDITORIAL_6.jpg?v=1731670984&width=1200",
    "https://aabcollection.com/cdn/shop/files/AAB_AW24_EDITORIAL_7.jpg?v=1731670984&width=1200",
    "https://aabcollection.com/cdn/shop/files/AAB_AW24_EDITORIAL_8.jpg?v=1731670984&width=1200",
    "https://aabcollection.com/cdn/shop/files/AAB_AW24_EDITORIAL_9.jpg?v=1731670984&width=1200",
    "https://aabcollection.com/cdn/shop/files/AAB_AW24_EDITORIAL_10.jpg?v=1731670984&width=1200",
    "https://aabcollection.com/cdn/shop/files/AAB_AW24_EDITORIAL_11.jpg?v=1731670984&width=1200",
    "https://aabcollection.com/cdn/shop/files/AAB_AW24_EDITORIAL_12.jpg?v=1731670984&width=1200",
    "https://aabcollection.com/cdn/shop/files/AAB_AW24_EDITORIAL_13.jpg?v=1731670984&width=1200",
    "https://aabcollection.com/cdn/shop/files/AAB_AW24_EDITORIAL_14.jpg?v=1731670984&width=1200",
    "https://aabcollection.com/cdn/shop/files/AAB_AW24_EDITORIAL_15.jpg?v=1731670984&width=1200",
    "https://aabcollection.com/cdn/shop/files/AAB_AW24_EDITORIAL_16.jpg?v=1731670984&width=1200",
    "https://aabcollection.com/cdn/shop/files/AAB_AW24_EDITORIAL_17.jpg?v=1731670984&width=1200",
  ];

  return (
    <div className="bg-[#FAF9F6] min-h-screen flex flex-col overflow-hidden">
      {/* Newsletter Header */}
      <div className="pt-20 pb-16 text-center px-4">
        <h2 className="text-[14px] tracking-[0.3em] font-light uppercase mb-2 text-neutral-800">
          Welcome Ramadan with Aab
        </h2>
        <p className="text-[11px] tracking-[0.2em] font-light uppercase text-neutral-500 mb-1">
          Join our inner circle and be the first
        </p>
        <p className="text-[11px] tracking-[0.2em] font-light uppercase text-neutral-500 mb-12">
          to receive exclusive offers and updates.
        </p>

        <form className="max-w-[800px] mx-auto flex items-center gap-0 shadow-sm border border-neutral-200">
          <input 
            type="email" 
            placeholder="ENTER YOUR EMAIL"
            className="flex-1 bg-white px-6 py-4 text-[10px] tracking-[0.25em] font-light focus:outline-none placeholder:text-neutral-400"
            required
          />
          <button 
            type="submit"
            className="px-10 py-4 bg-black text-white text-[10px] tracking-[0.25em] font-bold uppercase hover:bg-neutral-800 transition-colors shrink-0"
          >
            SIGN-UP
          </button>
        </form>
      </div>

      {/* Horizontal Gallery */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-x-hidden select-none mb-12 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-stretch h-[70vh] min-h-[500px]">
          {galleryImages.map((src, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] h-full overflow-hidden"
            >
              <img 
                src={src} 
                alt={`Lookbook ${index + 1}`}
                className="w-full h-full object-cover pointer-events-none transition-transform duration-1000"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lookbook;
