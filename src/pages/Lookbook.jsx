import React, { useRef, useEffect, useState, useCallback } from 'react';
import { api } from '../utils/api';

const Lookbook = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [heading, setHeading]             = useState('');
  const [description, setDescription]     = useState('');
  const [loading, setLoading]             = useState(true);

  const scrollContainerRef = useRef(null);
  const targetScrollRef    = useRef(0);
  const currentScrollRef   = useRef(0);
  const rafRef             = useRef(null);

  // Drag state
  const isDragging   = useRef(false);
  const dragStartX   = useRef(0);
  const dragStartScroll = useRef(0);

  // ── Fetch data ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchLookbooks = async () => {
      try {
        const data = await api.lookbooks.getAll();
        const activeLookbooks = (data || []).filter(lb => lb.isActive);

        if (activeLookbooks.length > 0) {
          const first = activeLookbooks[0];
          setHeading(first.heading || first.title || '');
          setDescription(first.description || '');
          const allImages = activeLookbooks.flatMap(lb => lb.images);
          setGalleryImages(allImages);
        }
      } catch (err) {
        console.error('Failed to load lookbooks', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLookbooks();
  }, []);

  // ── Smooth scroll RAF loop ────────────────────────────────────────────
  const startRAF = useCallback(() => {
    const loop = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const max = container.scrollWidth - container.clientWidth;
      targetScrollRef.current = Math.max(0, Math.min(targetScrollRef.current, max));

      const diff = targetScrollRef.current - currentScrollRef.current;
      if (Math.abs(diff) > 0.5) {
        currentScrollRef.current += diff * 0.08;
        container.scrollLeft = currentScrollRef.current;
      } else {
        currentScrollRef.current = targetScrollRef.current;
        container.scrollLeft = currentScrollRef.current;
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  // ── Attach wheel + drag once images are loaded ────────────────────────
  useEffect(() => {
    if (galleryImages.length === 0) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    // Sync refs with current scroll position (important after mount)
    currentScrollRef.current = container.scrollLeft;
    targetScrollRef.current  = container.scrollLeft;

    // Wheel: convert vertical scroll to horizontal
    const onWheel = (e) => {
      e.preventDefault();
      targetScrollRef.current += e.deltaY * 0.6 + e.deltaX * 0.6;
    };

    // Mouse drag
    const onMouseDown = (e) => {
      isDragging.current    = true;
      dragStartX.current    = e.clientX;
      dragStartScroll.current = currentScrollRef.current;
      container.style.cursor = 'grabbing';
    };
    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const delta = dragStartX.current - e.clientX;
      targetScrollRef.current = dragStartScroll.current + delta;
    };
    const stopDrag = () => {
      isDragging.current     = false;
      container.style.cursor = 'grab';
    };

    // Touch drag
    let touchStartX = 0;
    let touchStartScroll = 0;
    const onTouchStart = (e) => {
      touchStartX      = e.touches[0].clientX;
      touchStartScroll = currentScrollRef.current;
    };
    const onTouchMove = (e) => {
      const delta = touchStartX - e.touches[0].clientX;
      targetScrollRef.current = touchStartScroll + delta;
    };

    container.addEventListener('wheel',      onWheel,     { passive: false });
    container.addEventListener('mousedown',   onMouseDown);
    window.addEventListener('mousemove',      onMouseMove);
    window.addEventListener('mouseup',        stopDrag);
    container.addEventListener('touchstart',  onTouchStart, { passive: true });
    container.addEventListener('touchmove',   onTouchMove,  { passive: true });

    startRAF();

    return () => {
      container.removeEventListener('wheel',      onWheel);
      container.removeEventListener('mousedown',   onMouseDown);
      window.removeEventListener('mousemove',      onMouseMove);
      window.removeEventListener('mouseup',        stopDrag);
      container.removeEventListener('touchstart',  onTouchStart);
      container.removeEventListener('touchmove',   onTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [galleryImages, startRAF]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center uppercase tracking-widest text-neutral-400 font-light text-xs">
        Curating the Canvas...
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen flex flex-col overflow-hidden">

      {/* ── Static Newsletter Header ──────────────────────── */}
      <div className="pt-20 pb-10 text-center px-4">
        <h1 className="text-[14px] tracking-[0.3em] font-light uppercase mb-2 text-neutral-800">
          Welcome Ramadan with Aab
        </h1>
        <p className="text-[11px] tracking-[0.2em] font-light uppercase text-neutral-500 mb-1">
          Join our inner circle and be the first
        </p>
        <p className="text-[11px] tracking-[0.2em] font-light uppercase text-neutral-500 mb-10">
          to receive exclusive offers and updates.
        </p>

        <form
          className="max-w-[800px] mx-auto flex items-center gap-0 shadow-sm border border-neutral-200"
          onSubmit={(e) => e.preventDefault()}
        >
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

      {/* ── Horizontal Gallery ─────────────────────────────── */}
      {galleryImages.length > 0 ? (
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-x-scroll select-none mb-12 cursor-grab"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`.lookbook-hide-scroll::-webkit-scrollbar { display: none; }`}</style>
          <div className="flex items-stretch h-[70vh] min-h-[500px]">
            {galleryImages.map((src, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[85vw] md:w-[55vw] lg:w-[40vw] h-full overflow-hidden"
              >
                <img
                  src={src}
                  alt={`Lookbook ${index + 1}`}
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-neutral-400 uppercase tracking-widest text-xs">
          No images published yet.
        </div>
      )}
    </div>
  );
};

export default Lookbook;
