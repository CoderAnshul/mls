import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import JournalHero from '../components/journal/JournalHero';
import JournalGrid from '../components/journal/JournalGrid';
import JournalCTA from '../components/journal/JournalCTA';
import JournalFooterImage from '../components/journal/JournalFooterImage';

const JournalDetail = () => {
  const { slug } = useParams();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJournal = async () => {
      try {
        setLoading(true);
        const data = await api.journals.getOne(slug);
        setJournal(data);
      } catch (err) {
        console.error('Error loading journal:', err);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };
    loadJournal();
  }, [slug]);

  const renderBlock = (block, idx) => {
    switch (block.type) {
      case 'header':
        return (
          <div key={idx} className="max-w-[800px] mx-auto px-4 mb-8 text-center mt-12">
            <h2 className={`font-medium text-[#252423] leading-tight ${block.data.level === 1 ? 'text-4xl' :
              block.data.level === 3 ? 'text-2xl' : 'text-3xl'
              }`}>
              {block.data.text}
            </h2>
          </div>
        );
      case 'paragraph':
        return (
          <div key={idx} className="max-w-[800px] mx-auto px-4 mb-8 text-center">
            <p className="text-gray-700 leading-relaxed font-light text-lg"
              dangerouslySetInnerHTML={{ __html: block.data.text }} />
          </div>
        );
      case 'image':
        return (
          <div key={idx} className="w-full max-w-[1000px] mx-auto px-4 mb-12">
            <div className="aspect-[16/9] relative overflow-hidden">
              <img src={block.data.file.url} alt={block.data.caption || ''} className="w-full h-full object-cover" />
            </div>
            {block.data.caption && (
              <p className="text-center text-xs text-gray-400 mt-2 italic">{block.data.caption}</p>
            )}
          </div>
        );
      case 'list':
        return (
          <div key={idx} className="max-w-[600px] mx-auto px-4 mb-8 text-left">
            <ul className={`${block.data.style === 'ordered' ? 'list-decimal' : 'list-disc'} space-y-2 text-gray-700 ml-6`}>
              {block.data.items.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          </div>
        );
      case 'quote':
        return (
          <div key={idx} className="max-w-[800px] mx-auto px-4 mb-12 text-center">
            <blockquote className="text-2xl italic text-[#A47F58] font-serif border-l-4 border-[#A47F58]/20 pl-4 py-4 decoration-none">
              "{block.data.text}"
            </blockquote>
            {block.data.caption && (
              <cite className="text-xs uppercase tracking-widest text-gray-400 mt-2 block">— {block.data.caption}</cite>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F4F2EA] min-h-screen pt-[120px] flex items-center justify-center">
        <p className="uppercase tracking-[0.2em] text-neutral-400 text-xs">Unfolding the story...</p>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="bg-[#F4F2EA] min-h-screen pt-[120px] flex flex-col items-center justify-center space-y-6">
        <p className="uppercase tracking-[0.2em] text-neutral-400">Journal not found</p>
        <Link to="/journal" className="text-xs uppercase tracking-widest border-b border-black pb-1">Back to Journal</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F2EA] min-h-screen pt-[120px]">
      <JournalHero data={journal} />

      <div className="py-8">
        {journal.content?.blocks ? (
          journal.content.blocks.map((block, idx) => renderBlock(block, idx))
        ) : (
          <div className="text-center py-20 text-gray-400 uppercase tracking-widest text-[10px]">
            No content found
          </div>
        )}
      </div>

      <JournalCTA ctaText={journal.ctaText || "View Collection"} ctaLink={journal.ctaLink || "/collections/all"} />
      <JournalFooterImage />

      <div className="w-full max-w-[1200px] mx-auto px-4 py-16 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-neutral-400 border-t border-neutral-200/50 mt-12 font-light">
        <Link to="/journal" className="hover:text-black transition-colors">← Previous Post</Link>
        <Link to="/journal" className="hover:text-black transition-colors">Back to Journal</Link>
        <Link to="/journal" className="hover:text-black transition-colors">Next Post →</Link>
      </div>
    </div>
  );
};

export default JournalDetail;
