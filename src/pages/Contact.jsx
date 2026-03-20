import TrendingSection from '../components/common/TrendingSection';
import BrandHighlights from '../components/common/BrandHighlights';
import BlockRenderer from '../components/common/BlockRenderer';
import { api } from '../utils/api';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Paperclip } from 'lucide-react';

const Contact = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const data = await api.pages.getOne('contact-us');
        setPageData(data);
      } catch (err) {
        console.error('Failed to fetch contact page', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  const metadata = pageData?.metadata || {};
  const subjects = metadata.subjects ? metadata.subjects.split(',').map(s => s.trim()) : ['General Inquiry', 'Order Support', 'Returns', 'Wholesale'];

  return (
    <div className="flex-grow bg-[#FDFCF9] pt-24 pb-20 px-4 md:px-8">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto mb-16 px-4">
        <nav className="flex text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black">Contact Us</span>
        </nav>
      </div>

      <div className="max-w-4xl mx-auto text-center mb-20 px-4">
        <h1 className="text-3xl md:text-4xl font-serif mb-12 uppercase tracking-[0.3em] text-neutral-800">Contact Us</h1>
        
        <div className="space-y-6 text-[13px] md:text-[14px] text-neutral-600 leading-relaxed max-w-2xl mx-auto">
          {pageData?.content ? (
            typeof pageData.content === 'object' && pageData.content.blocks ? (
              <BlockRenderer blocks={pageData.content.blocks} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
            )
          ) : (
            <>
              <p>For any queries or feedback please complete the form below.</p>
              <p>{metadata.response_note || 'We aim to respond to emails within 24 hours but at busy times this can take longer.'}</p>
              <p>If you require more urgent assistance or wish to place an order or speak to our customer care team directly you can call us on:</p>
            </>
          )}
          
          <div className="space-y-4 pt-6">
            <p>
              <span className="font-bold text-black uppercase tracking-widest">UK:</span>{' '}
              <a href={`tel:${(metadata.phone_uk || '+44702038237768').replace(/\s/g, '')}`} className="underline underline-offset-4 decoration-neutral-300 hover:decoration-black transition-colors">
                {metadata.phone_uk || '+447 (0) 0203 823 7768'}
              </a>
              <br />
              <span className="text-[12px] text-neutral-400 italic">{metadata.hours_note || '(Monday - Friday, 10am - 3pm)'}</span>
            </p>
            
            <p>
              <span className="font-bold text-black uppercase tracking-widest">WhatsApp:</span>{' '}
              <a href={`https://wa.me/${(metadata.phone_whatsapp || '4402038237768').replace(/[^0-9]/g, '')}`} className="underline underline-offset-4 decoration-neutral-300 hover:decoration-black transition-colors">
                {metadata.phone_whatsapp || '+44 (0) 203 823 7768'}
              </a>
            </p>

            <p>
              <span className="font-bold text-black uppercase tracking-widest">International:</span>{' '}
              <a href={`tel:${(metadata.phone_int || '+44702038237768').replace(/\s/g, '')}`} className="underline underline-offset-4 decoration-neutral-300 hover:decoration-black transition-colors">
                {metadata.phone_int || '+447 (0) 0203 823 7768'}
              </a>
            </p>

            <p className="pt-4">
              Alternatively you can email us directly:{' '}
              <a href={`mailto:${metadata.email || 'admin@aabcollection.com'}`} className="underline underline-offset-4 decoration-neutral-300 hover:decoration-black transition-colors">
                {metadata.email || 'admin@aabcollection.com'}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-3xl mx-auto px-4 mb-32">
        <div className="bg-white border border-neutral-100 shadow-sm rounded-sm overflow-hidden">
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-serif mb-10 text-neutral-900 tracking-tight">Contact us</h2>
            <hr className="mb-10 border-neutral-100" />
            
            <form className="space-y-8">
              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-neutral-800">
                  Full name <span className="text-red-400">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-neutral-200 px-4 py-3 text-[14px] outline-none focus:border-neutral-400 transition-colors bg-white rounded-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-neutral-800">
                  Email <span className="text-red-400">*</span>
                </label>
                <input 
                  type="email" 
                  placeholder="your@email.com"
                  required
                  className="w-full border border-neutral-200 px-4 py-3 text-[14px] outline-none focus:border-neutral-400 transition-colors bg-white rounded-sm placeholder:text-neutral-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-neutral-800">
                  Subject <span className="text-red-400">*</span>
                </label>
                <select 
                  required
                  className="w-full border border-neutral-200 px-4 py-3 text-[14px] outline-none focus:border-neutral-400 transition-colors bg-white rounded-sm appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23d4d4d4'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 1rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.2em',
                  }}
                >
                  <option value="" disabled selected>Select a subject</option>
                  {subjects.map((s, i) => (
                    <option key={i} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-neutral-800">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea 
                  rows={6} 
                  required
                  className="w-full border border-neutral-200 px-4 py-3 text-[14px] outline-none focus:border-neutral-400 transition-colors bg-white rounded-sm resize-none"
                />
              </div>

              <div className="pt-4 border-t border-dashed border-neutral-200">
                <button 
                  type="button"
                  className="flex items-center justify-center gap-3 w-full py-6 border border-dashed border-neutral-300 hover:bg-neutral-50 transition-colors text-[13px] font-bold text-neutral-500 rounded-sm"
                >
                  <Paperclip size={18} />
                  Attach Files
                </button>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-black text-white text-[12px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all rounded-sm shadow-sm active:scale-[0.98]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      <BrandHighlights />
      <TrendingSection />
    </div>
  );
};

export default Contact;
