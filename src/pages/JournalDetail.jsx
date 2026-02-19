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
  const [otherJournals, setOtherJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJournal = async () => {
      try {
        setLoading(true);
        const data = await api.journals.getOne(slug);
        setJournal(data);
        if (data?.title) {
          document.title = `${data.title.replace(/<[^>]*>/g, '')} | Aab Journal`;
        }

        // Fetch other journals for "Continue Reading"
        const allJournals = await api.journals.getAll();
        setOtherJournals(allJournals.filter(j => j.slug !== slug).slice(0, 3));
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
    // ... switch cases ...
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
          <div key={idx} className="max-w-[800px] mx-auto px-4 mb-4 text-center">
            <p className="text-gray-700 leading-relaxed font-light text-lg [&_a]:text-[#A47F58] [&_a]:underline [&_a]:underline-offset-4 [&_b]:font-bold [&_strong]:font-bold [&_u]:underline"
              dangerouslySetInnerHTML={{ __html: block.data.text }} />
          </div>
        );
      case 'image':
        return (
          <div key={idx} className="w-full max-w-[1000px] mx-auto px-4 mb-12 mt-12">
            <div className="aspect-[16/9] md:aspect-[2/1] relative overflow-hidden">
              <img src={block.data.file.url} alt={block.data.caption || ''} className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700" />
            </div>
            {block.data.caption && (
              <p className="text-center text-[10px] uppercase tracking-widest text-gray-400 mt-4 italic">{block.data.caption}</p>
            )}
          </div>
        );
      case 'list':
        return (
          <div key={idx} className="max-w-[600px] mx-auto px-4 mb-8 text-left py-4">
            <ul className={`${block.data.style === 'ordered' ? 'list-decimal' : 'list-disc'} space-y-3 text-gray-700 ml-6 tracking-wide font-light [&_a]:text-[#A47F58] [&_a]:underline [&_b]:font-bold [&_u]:underline`}>
              {block.data.items.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          </div>
        );
      case 'quote':
        return (
          <div key={idx} className="max-w-[800px] mx-auto px-4 mb-16 text-center py-8">
            <blockquote className="text-2xl md:text-3xl italic text-[#A47F58] font-serif leading-relaxed px-8">
              "{block.data.text}"
            </blockquote>
            {block.data.caption && (
              <cite className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-6 block">— {block.data.caption}</cite>
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
        <p className="uppercase tracking-[0.2em] text-neutral-400 text-xs text-center">
          <span className="block mb-2">Unfolding the story...</span>
          <span className="animate-pulse">●</span>
        </p>
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

      {/* Continue Reading Section */}
      {/* {otherJournals.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-4 py-20 border-t border-neutral-200/50">
          <h4 className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 mb-12 text-center font-light">Continue Reading</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {otherJournals.map(entry => (
              <Link key={entry._id} to={`/journal/${entry.slug}`} className="group block text-center">
                <div className="aspect-[3/4] overflow-hidden mb-6 bg-neutral-200">
                  <img src={entry.heroImage} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" alt={entry.title} />
                </div>
                <h5 className="text-[12px] tracking-widest uppercase font-bold text-neutral-800 group-hover:text-[#A47F58] transition-colors line-clamp-2 px-4" dangerouslySetInnerHTML={{ __html: entry.title }} />
              </Link>
            ))}
          </div>
        </section>
      )} */}

      <JournalFooterImage />

      <div className="w-full max-w-[1200px] mx-auto px-4 py-16 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-neutral-400 border-t border-neutral-200/50 mt-12 font-light">
        <div className="flex-1 text-left">
          {journal.prev ? (
            <Link to={`/journal/${journal.prev.slug}`} className="hover:text-black transition-colors group">
              <span className="block text-neutral-300 mb-1 italic">← Previous</span>
              <span className="hidden md:inline-block group-hover:text-black line-clamp-1 max-w-[200px]" dangerouslySetInnerHTML={{ __html: journal.prev.title }} />
            </Link>
          ) : (
            <span className="opacity-0">No Prev</span>
          )}
        </div>

        <div className="flex-none px-4">
          <Link to="/journal" className="hover:text-black transition-colors font-bold">Journal</Link>
        </div>

        <div className="flex-1 text-right">
          {journal.next ? (
            <Link to={`/journal/${journal.next.slug}`} className="hover:text-black transition-colors group">
              <span className="block text-neutral-300 mb-1 italic text-[10px]">Next →</span>
              <span className="hidden md:inline-block group-hover:text-black line-clamp-1 max-w-[200px]" dangerouslySetInnerHTML={{ __html: journal.next.title }} />
            </Link>
          ) : (
            <span className="opacity-0">No Next</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalDetail;
