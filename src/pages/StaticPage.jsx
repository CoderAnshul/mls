import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BrandHighlights from '../components/common/BrandHighlights';
import TrendingSection from '../components/common/TrendingSection';
import BlockRenderer from '../components/common/BlockRenderer';

const StaticPage = ({ slug, title }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/pages/${slug}`);
        const data = await res.json();
        if (data && data.content) {
          setContent(data.content);
        } else {
          setContent('<p>Content coming soon...</p>');
        }
      } catch (err) {
        console.error(err);
        setContent('<p>Failed to load content.</p>');
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  return (
    <div className="flex-grow bg-[#FDFCF9] pt-24 pb-20 px-4 md:px-8">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto mb-16 px-4">
        <nav className="flex text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black">{title}</span>
        </nav>
      </div>

      <div className="max-w-4xl mx-auto px-4 mb-32">
        <h1 className="text-3xl md:text-4xl font-serif mb-12 text-center uppercase tracking-[0.3em] text-neutral-800 font-normal">{title}</h1>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="prose prose-neutral max-w-none">
            {content && typeof content === 'object' && content.blocks ? (
              <BlockRenderer blocks={content.blocks} />
            ) : (
              <div
                className="text-neutral-600 leading-relaxed font-light text-lg text-center"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>
        )}
      </div>

      <BrandHighlights />
      <TrendingSection />
    </div>
  );
};

export default StaticPage;
