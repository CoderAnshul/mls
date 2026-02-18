import React from 'react';

const SignatureEmbroideries = () => {
  return (
    <section className="relative w-full h-[500px] md:h-[700px] lg:h-[800px] overflow-hidden">
      {/* Background Image Container */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2000&auto=format&fit=crop')`, // High quality fashion detail placeholder
        }}
      />
      
      {/* Visual Overlay if needed for a premium look, but keeping it simple as requested */}
      <div className="absolute inset-0 bg-black/5"></div>
    </section>
  );
};

export default SignatureEmbroideries;
