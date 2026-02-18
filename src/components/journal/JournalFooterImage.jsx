import React from 'react';

const JournalFooterImage = () => {
  return (
    <section className="w-full mb-0">
         <div className="w-full h-[60vh] md:h-[80vh] relative overflow-hidden">
             <img 
                src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=2940&auto=format&fit=crop" 
                alt="Ramadan Mood" 
                className="w-full h-full object-cover object-bottom"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-[#F4F2EA] via-transparent to-transparent opacity-20"></div>
        </div>
    </section>
  );
};

export default JournalFooterImage;
