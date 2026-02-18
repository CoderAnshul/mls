import React from 'react';

const JournalContent = () => {
  return (
    <section className="w-full max-w-[800px] mx-auto px-4 mb-20 text-center">
        <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-medium text-[#252423]">
                "In every prayer, a whisper of hope. In every gathering, a bond strengthened."
            </h2>
            <div className="w-full aspect-[4/3] md:aspect-[16/9] relative overflow-hidden mb-8">
                 <img 
                    src="https://images.unsplash.com/photo-1532330384815-5165d21ba772?q=80&w=2803&auto=format&fit=crop" 
                    alt="Women Sharing moments" 
                    className="w-full h-full object-cover"
                />
            </div>
            
             <div className="max-w-2xl mx-auto space-y-6 text-left md:text-center">
                <p className="text-gray-700 leading-relaxed font-light">
                   As the sun sets and the call to prayer echoes, we find ourselves surrounded by the warmth of family and the comfort of faith. It is in these moments that we truly understand the power of connection – the silent understanding between friends, the laughter shared over a meal, and the peace found in unity.
                </p>
                 <p className="text-[#A47F58] font-medium italic text-lg text-center">
                     Get an extra 10% Off on Collection. Use code: RAMADAN10
                 </p>
            </div>
             <div className="pt-8">
                 <a href="/collections/all" className="inline-block border-b border-[#252423] pb-1 uppercase tracking-widest text-sm hover:text-[#A47F58] hover:border-[#A47F58] transition-colors">
                     Shop Now
                 </a>
            </div>
        </div>
    </section>
  );
};

export default JournalContent;
