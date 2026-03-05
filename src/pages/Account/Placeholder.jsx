import React from 'react';
import { Link } from 'react-router-dom';

const Placeholder = ({ title }) => (
  <div className="bg-[#F4F2EA] min-h-screen pt-12 pb-24 px-4">
    <div className="max-w-[1200px] mx-auto mb-16">
      <nav className="text-[10px] tracking-[0.2em] uppercase text-[#252423]/60 font-bold">
        <Link to="/" className="hover:text-black transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span>Account</span>
      </nav>
    </div>
    <h1 className="text-center text-[24px] md:text-[28px] tracking-[0.3em] font-medium uppercase text-[#252423] mb-12">
      {title}
    </h1>
    <div className="max-w-[800px] mx-auto text-center border border-black/10 p-12">
      <p className="text-[12px] tracking-[0.1em] text-[#252423]/60 uppercase font-bold">
        This section is coming soon.
      </p>
    </div>
  </div>
);

export default Placeholder;
