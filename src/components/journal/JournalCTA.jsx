import React from 'react';

const JournalCTA = () => {
  return (
    <section className="w-full max-w-[600px] mx-auto px-4 mb-20 text-center">
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 flex items-center justify-center">
           {/* Placeholder for the mirror image - using a similar vibe */}
             <img 
                src="https://images.unsplash.com/photo-1616091216791-a5360b5fc78a?q=80&w=2795&auto=format&fit=crop" 
                alt="Mirror Reflection" 
                className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/5">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-full h-64 w-64 flex flex-col items-center justify-center border border-[#A47F58]/30 shadow-lg">
                    <p className="font-serif italic text-[#252423] text-lg mb-2">Press For</p>
                    <h2 className="text-2xl font-serif text-[#252423] uppercase tracking-widest mb-2 border-b border-[#252423] pb-1">
                        Ramadan
                    </h2>
                     <p className="font-cursive text-xl mt-2 text-[#252423]">aab</p>
                </div>
            </div>
        </div>
        
         <div className="mt-8">
            <a href="/collections/ramadan" className="inline-block px-12 py-3 bg-[#252423] text-white uppercase tracking-widest text-sm hover:bg-[#A47F58] transition-colors duration-300">
                View Collection
            </a>
        </div>
    </section>
  );
};

export default JournalCTA;
