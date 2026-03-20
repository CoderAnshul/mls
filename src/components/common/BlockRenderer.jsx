import React from 'react';

const BlockRenderer = ({ blocks }) => {
  if (!blocks || !Array.isArray(blocks)) return null;

  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'header':
            const HeaderTag = `h${block.data.level || 2}`;
            return (
              <div key={idx} className="max-w-[800px] mx-auto px-4 mb-4 text-center mt-6">
                <HeaderTag className={`font-medium text-[#252423] leading-tight ${
                  block.data.level === 1 ? 'text-4xl' : 
                  block.data.level === 3 ? 'text-2xl' : 'text-3xl'
                }`}>
                  {block.data.text}
                </HeaderTag>
              </div>
            );

          case 'paragraph':
            return (
              <div key={idx} className="max-w-[800px] mx-auto px-4 mb-3 text-center">
                <p 
                  className="text-gray-700 leading-relaxed font-light text-lg [&_a]:text-[#A47F58] [&_a]:underline [&_a]:underline-offset-4 [&_b]:font-bold [&_strong]:font-bold [&_u]:underline"
                  dangerouslySetInnerHTML={{ __html: block.data.text }} 
                />
              </div>
            );

          case 'image':
            return (
              <div key={idx} className="w-full max-w-[1000px] mx-auto px-4 mb-6 mt-6">
                <div className="aspect-[16/9] md:aspect-[2/1] relative overflow-hidden">
                  <img 
                    src={block.data.file.url} 
                    alt={block.data.caption || ''} 
                    className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700" 
                  />
                </div>
                {block.data.caption && (
                  <p className="text-center text-[10px] uppercase tracking-widest text-gray-400 mt-4 italic">
                    {block.data.caption}
                  </p>
                )}
              </div>
            );

          case 'list':
            return (
              <div key={idx} className="max-w-[600px] mx-auto px-4 mb-4 text-left py-2">
                <ul className={`${block.data.style === 'ordered' ? 'list-decimal' : 'list-disc'} space-y-3 text-gray-700 ml-6 tracking-wide font-light [&_a]:text-[#A47F58] [&_a]:underline [&_b]:font-bold [&_u]:underline`}>
                  {block.data.items.map((item, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>
              </div>
            );

          case 'checklist':
            return (
              <div key={idx} className="max-w-[600px] mx-auto px-4 mb-4 text-left py-2">
                <div className="space-y-3">
                  {block.data.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`mt-1 h-5 w-5 rounded border flex items-center justify-center shrink-0 ${item.checked ? 'bg-[#A47F58] border-[#A47F58]' : 'border-gray-300 bg-white'}`}>
                        {item.checked && (
                          <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-gray-700 font-light leading-relaxed ${item.checked ? 'line-through text-gray-400' : ''}`} dangerouslySetInnerHTML={{ __html: item.text }} />
                    </div>
                  ))}
                </div>
              </div>
            );

          case 'quote':
            return (
              <div key={idx} className="max-w-[800px] mx-auto px-4 mb-6 text-center py-6">
                <blockquote className="text-2xl md:text-3xl italic text-[#A47F58] leading-relaxed px-8">
                  "{block.data.text}"
                </blockquote>
                {block.data.caption && (
                  <cite className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mt-6 block">— {block.data.caption}</cite>
                )}
              </div>
            );

          default:
            console.warn('Unknown block type:', block.type);
            return null;
        }
      })}
    </div>
  );
};

export default BlockRenderer;
