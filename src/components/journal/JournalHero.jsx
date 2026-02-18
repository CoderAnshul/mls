import React from 'react';

const JournalHero = ({ data }) => {
  if (!data) return null;
  
  const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
  });

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 pt-16 pb-12 mb-20 text-center">
        {/* Title Group */}
        <div className="mb-12 space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-[42px] leading-tight tracking-wide font-medium text-[#252423] uppercase max-w-3xl mx-auto">
                {data.title}
            </h1>
            <p className="text-sm tracking-widest text-gray-500 uppercase mt-4">
                {formattedDate}
            </p>
        </div>

        {/* Hero Image */}
        <div className="w-full aspect-[16/9] md:aspect-[2/1] relative overflow-hidden">
             <img 
                src={data.heroImage} 
                alt={data.title} 
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
            />
        </div>
        
        {/* Caption/Intro Text */}
         <div className="max-w-3xl mx-auto mt-12 text-center space-y-6">
            {data.excerpt && (
                <p className="text-[#A47F58] font-medium text-lg italic">
                    {data.excerpt}
                </p>
            )}
            {data.introText && (
                <p className="text-gray-600 leading-relaxed">
                    {data.introText}
                </p>
            )}
        </div>

    </section>
  );
};

export default JournalHero;
