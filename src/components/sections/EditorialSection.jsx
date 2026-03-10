import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { resolveImageUrl } from '../../utils/imageUrl';

const EditorialSection = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestJournals = async () => {
      try {
        const data = await api.journals.getAll();
        // Show only latest 4 published journals
        const latest = (data || [])
          .filter(j => j.isPublished)
          .slice(0, 4);
        setJournals(latest);
      } catch (err) {
        console.error('Failed to load editorial journals', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestJournals();
  }, []);

  if (loading || journals.length === 0) return null;

  return (
    <section className="bg-transparent py-16 md:py-20 lg:py-24 animate-in fade-in duration-1000 border-t border-neutral-100/50">
      <div className="w-full">
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-4 md:gap-8 snap-x snap-mandatory scrollbar-hide px-4 md:px-8 lg:px-12">
          {journals.map((item, index) => (
            <Link
              key={item._id}
              to={`/journal/${item.slug}`}
              className="group flex flex-col items-center text-center flex-none w-[75%] sm:w-[45%] lg:w-full snap-center"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[4/5] overflow-hidden mb-6 bg-neutral-100 shadow-sm transition-shadow group-hover:shadow-2xl">
                <img
                  src={resolveImageUrl(item.heroImage)}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />

                {/* Date overlay */}
                <div className="absolute top-4 left-4">
                  <span className="text-[9px] tracking-[0.2em] font-light text-white uppercase bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Text Content */}
              <h3
                className="text-[12px] md:text-sm font-black tracking-[0.3em] uppercase text-neutral-900 mb-4 group-hover:text-[#A47F58] transition-colors leading-relaxed px-2"
                dangerouslySetInnerHTML={{ __html: item.title }}
              />
              <div className="text-[11px] md:text-[13px] text-neutral-500 leading-relaxed max-w-[240px] font-medium opacity-80 group-hover:opacity-100 transition-opacity line-clamp-2">
                <span dangerouslySetInnerHTML={{
                  __html: item.excerpt || (item.content?.blocks?.find(b => b.type === 'paragraph')?.data?.text?.substring(0, 100) + '...') || ''
                }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EditorialSection;
