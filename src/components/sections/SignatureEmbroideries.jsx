import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { resolveImageUrl } from '../../utils/imageUrl';

const SignatureEmbroideries = () => {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assets = await api.homeAssets.getAll();
        const embroideries = assets.find(a => a.key === 'signature_embroideries');
        if (embroideries && embroideries.value) {
          setData(embroideries.value);
        }
      } catch (err) {
        console.error('Failed to fetch signature embroideries:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [data]);

  const isVideo = (url) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov|quicktime)$|video/i);
  };

  if (loading) return null;
  if (data.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden group">
      {/* Slides Container - Using grid to allow height to be determined by the content */}
      <div className="grid grid-cols-1 grid-rows-1">
        {data.map((item, index) => (
          <div
            key={index}
            className={`col-start-1 row-start-1 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="relative w-full overflow-hidden">
              {isVideo(item.image) ? (
                <video
                  src={resolveImageUrl(item.image)}
                  className="w-full h-auto object-cover transition-transform duration-[2000ms] hover:scale-105"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={resolveImageUrl(item.image)}
                  alt={item.title || "Signature Embroidery"}
                  className="w-full h-auto object-cover transition-transform duration-[2000ms] hover:scale-105"
                />
              )}
            </div>
            
            {item.title && (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-[0.2em] drop-shadow-2xl">
                  {item.title}
                </h2>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      {data.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {data.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-500 rounded-full w-2 h-2 ${
                index === currentIndex 
                  ? 'bg-neutral-800 scale-125' 
                  : 'bg-white hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Visual Overlay */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none z-10"></div>
    </section>
  );
};

export default SignatureEmbroideries;
