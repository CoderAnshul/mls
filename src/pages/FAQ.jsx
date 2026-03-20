import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandHighlights from '../components/common/BrandHighlights';
import TrendingSection from '../components/common/TrendingSection';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/faqs`);
        const data = await res.json();
        setFaqs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const categories = [...new Set(faqs.map(f => f.category || 'General'))];

  return (
    <div className="flex-grow bg-[#FDFCF9] pt-24 pb-20 px-4 md:px-8">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto mb-16 px-4">
        <nav className="flex text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black">Frequently Asked Questions</span>
        </nav>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-serif mb-6 text-center uppercase tracking-[0.3em] text-neutral-800 font-normal">Frequently Asked Questions</h1>
        <p className="text-neutral-400 text-center mb-16 text-[12px] uppercase tracking-[0.3em] font-black">Find answers to current protocols and services</p>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : faqs.length > 0 ? (
          <div className="space-y-12">
            {categories.map(cat => (
              <div key={cat} className="space-y-6">
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-neutral-300 border-b border-neutral-100 pb-4 ml-2">{cat}</h2>
                <div className="space-y-1">
                  {faqs.filter(f => (f.category || 'General') === cat).map(faq => (
                    <div 
                      key={faq._id} 
                      className={`group transition-all duration-500 ${activeId === faq._id ? 'bg-white shadow-sm border border-neutral-100 -mx-4 px-4 rounded-xl' : 'border-b border-neutral-100 last:border-0'}`}
                    >
                      <button 
                        onClick={() => setActiveId(activeId === faq._id ? null : faq._id)}
                        className="w-full flex items-center justify-between py-6 text-left"
                      >
                        <span className={`text-[15px] font-bold tracking-tight transition-colors duration-300 ${activeId === faq._id ? 'text-black' : 'text-neutral-600 group-hover:text-black'}`}>{faq.question}</span>
                        <div className={`p-2 rounded-full transition-all duration-500 ${activeId === faq._id ? 'bg-black text-white rotate-180 shadow-md' : 'bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200'}`}>
                          <ChevronDown size={14} />
                        </div>
                      </button>
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeId === faq._id ? 'max-h-[500px] opacity-100 pb-8' : 'max-h-0 opacity-0'}`}>
                        <div className="text-[14px] text-neutral-500 leading-relaxed max-w-2xl pl-1">
                           {faq.answer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
             <p className="text-neutral-400 uppercase tracking-widest font-black text-[11px]">No FAQs currently registered in our system</p>
          </div>
        )}

        <div className="mt-20 p-10 bg-black text-white rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left mb-32">
           <div>
              <h3 className="text-xl font-serif mb-2 uppercase tracking-widest">Still have questions?</h3>
              <p className="text-neutral-400 text-[12px] uppercase tracking-widest font-bold">Our support protocol is available for direct inquiries</p>
           </div>
           <Link to="/contact-us" className="px-10 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] hover:bg-neutral-200 transition-colors rounded-full">Contact Support</Link>
        </div>
      </div>

      <BrandHighlights />
      <TrendingSection />
    </div>
  );
};

export default FAQ;
