import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchJournal } from '../utils/api';
import JournalHero from '../components/journal/JournalHero';
import JournalGrid from '../components/journal/JournalGrid';
import JournalContent from '../components/journal/JournalContent';
import JournalCTA from '../components/journal/JournalCTA';
import JournalFooterImage from '../components/journal/JournalFooterImage';

const JournalDetail = () => {
  const { slug } = useParams();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJournal = async () => {
      setLoading(true);
      const data = await fetchJournal(slug);
      setJournal(data);
      setLoading(false);
      window.scrollTo(0, 0);
    };
    loadJournal();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#F4F2EA] min-h-screen pt-[120px] flex items-center justify-center">
        <p className="uppercase tracking-[0.2em] text-neutral-400">Loading Journal...</p>
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
        {/* For now keeping static parts or mapping content blocks */}
        {journal.content?.blocks ? (
            journal.content.blocks.map((block, idx) => {
                if (block.type === 'grid') return <JournalGrid key={idx} items={block.items} />;
                if (block.type === 'text') return <JournalContent key={idx} text={block.content} image={block.image} />;
                return null;
            })
        ) : (
            <>
                <JournalGrid />
                <JournalContent />
            </>
        )}
        <JournalCTA ctaText={journal.ctaText} ctaLink={journal.ctaLink} />
        <JournalFooterImage />
        
        {/* Navigation / Next Post (Optional, not in design but good for UX) */}
        <div className="w-full max-w-[1200px] mx-auto px-4 py-12 flex justify-between items-center text-xs uppercase tracking-widest text-gray-400 border-t border-gray-200 mt-12">
            <span className="cursor-pointer hover:text-[#252423] transition-colors">← Previous Post</span>
            <span className="cursor-pointer hover:text-[#252423] transition-colors">Back to Journal</span>
             <span className="cursor-pointer hover:text-[#252423] transition-colors">Next Post →</span>
        </div>
    </div>
  );
};

export default JournalDetail;
