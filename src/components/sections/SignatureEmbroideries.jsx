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
    <section className="relative w-full h-[500px] md:h-[700px] lg:h-[800px] overflow-hidden group">
      {/* Slides */}
      {data.map((item, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 z-0 overflow-hidden">
            {isVideo(item.image) ? (
              <video
                src={resolveImageUrl(item.image)}
                className="w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-105"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-[2000ms] hover:scale-105"
                style={{
                  backgroundImage: `url('${resolveImageUrl(item.image)}')`,
                }}
              />
            )}
          </div>
          
          {item.title && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-[0.2em] drop-shadow-2xl">
                {item.title}
              </h2>
            </div>
          )}
        </div>
      ))}

      {/* Navigation Dots */}
      {data.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
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
      <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
    </section>
  );
};

export default SignatureEmbroideries;
