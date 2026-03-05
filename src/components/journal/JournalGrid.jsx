import React from 'react';

const JournalGrid = ({ items }) => {
    const defaultItems = [
        {
            type: 'image',
            src: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=2940&auto=format&fit=crop', // Dates/Food
            alt: 'Dates for Iftar',
            aspect: 'aspect-[3/4]',
        },
        {
            type: 'text',
            title: 'Ramadan 2024',
            subtitle: 'Faith. Family. Fashion.',
            content: 'Embrace the spirit of the season with elegance and grace.',
            theme: 'light', // white bg with text
        },
         {
            type: 'image',
            src: 'https://images.unsplash.com/photo-1549216262-5883707c2937?q=80&w=2822&auto=format&fit=crop', // Woman in Abaya
            alt: 'Elegant Abaya',
            aspect: 'aspect-[3/4]',
        },
        {
             type: 'image',
            src: 'https://images.unsplash.com/photo-1585257588339-e932ec79f323?q=80&w=2787&auto=format&fit=crop', // Prayer/Quiet moment
             alt: 'Quiet Reflection',
             aspect: 'aspect-[1/1]',
        },
         {
             type: 'image',
            src: 'https://images.unsplash.com/photo-1574015974293-817f0ebebb74?q=80&w=2773&auto=format&fit=crop', // Women gathering
             alt: 'Gathering',
             aspect: 'aspect-[3/4]',
        },
        {
             type: 'image',
            src: 'https://images.unsplash.com/photo-1576766345919-63303fa16999?q=80&w=2787&auto=format&fit=crop', // Details/Hands
             alt: 'Intricate Details',
             aspect: 'aspect-[3/4]',
        },
         {
             type: 'image',
            src: 'https://images.unsplash.com/photo-1627393166847-64016aeb3288?q=80&w=2835&auto=format&fit=crop', // Portrait
             alt: 'Portrait',
             aspect: 'aspect-[4/5]',
        },
        {
             type: 'image',
            src: 'https://images.unsplash.com/photo-1596704017345-b565d75fe216?q=80&w=2940&auto=format&fit=crop', // Still life
             alt: 'Still Life',
             aspect: 'aspect-[3/4]',
        },
         {
             type: 'image',
            src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2940&auto=format&fit=crop', // Fashion
             alt: 'Fashion',
             aspect: 'aspect-[3/4]',
        },
    ];

    const gridItems = items || defaultItems;

  return (
    <section className="w-full max-w-[1000px] mx-auto px-4 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gridItems.map((item, index) => (
            <div key={index} className={`w-full overflow-hidden ${item.type === 'image' ? 'group' : ''}`}>
                 {item.type === 'image' ? (
                     <div className={`relative w-full ${item.aspect} overflow-hidden`}>
                        <img 
                            src={item.src} 
                            alt={item.alt}
                            className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                        />
                     </div>
                 ) : (
                     <div className="relative w-full aspect-[3/4] bg-white flex flex-col justify-center items-center p-8 text-center border border-gray-100">
                        <div className="mb-4">
                            {/* Decorative Icon or Logo Placeholer */}
                           <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 text-[#252423] mx-auto opacity-80" stroke="currentColor" strokeWidth="1">
                             <path d="M12 2L15 9L22 9L16 14L18 21L12 17L6 21L8 14L2 9L9 9L12 2Z" />
                           </svg>
                        </div>
                        <h3 className="text-2xl  text-[#252423] mb-2">{item.title}</h3>
                        <p className="text-sm uppercase tracking-widest text-gray-500 mb-6">{item.subtitle}</p>
                         <p className=" italic text-gray-600">
                             {item.content}
                         </p>
                         <div className="font-cursive text-2xl mt-4">
                             aab
                         </div>
                     </div>
                 )}
            </div>
        ))}
      </div>
      <div className="text-center mt-8">
           <p className="text-xs tracking-widest uppercase text-gray-500">
               Every stitch a reflection. Every hue a memory.
           </p>
      </div>
    </section>
  );
};

export default JournalGrid;
