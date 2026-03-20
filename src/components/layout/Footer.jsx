import { useState } from 'react';
import { footerData } from '../../data/footer';
import { IoChevronDownOutline } from 'react-icons/io5';
import { FaFacebookF, FaInstagram, FaPinterestP, FaYoutube } from 'react-icons/fa';
import { BsEnvelope, BsTelephone, BsWhatsapp } from 'react-icons/bs';

const Footer = () => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = [
    {
      id: 'delivery',
      title: footerData.deliveryReturns.title,
      links: [
        { label: footerData.deliveryReturns.description, textOnly: true },
        ...footerData.deliveryReturns.links.map(l => ({ label: l.title, href: l.href }))
      ]
    },
    {
      id: 'customer',
      title: footerData.customerCare.title,
      links: footerData.customerCare.links.map(l => ({ label: l.title, href: l.href }))
    },
    {
      id: 'touch',
      title: footerData.getInTouch.title,
      isContact: true
    }
  ];

  return (
    <footer className="border-t border-neutral-200">
      
      {/* Mobile Footer Layout (Small screens) */}
      <div className="lg:hidden flex flex-col bg-[#F4F2EA]">
        
        {/* Join Our Community Section (Top) */}
        <div className="bg-[#EAE1D4]/50 py-12 px-6 text-center">
            <h5 className="text-[13px] font-normal uppercase tracking-[0.25em] mb-4 text-neutral-800">
                Join Our Community
            </h5>
            <p className="text-[11px] text-neutral-500 font-light leading-relaxed mb-8 max-w-[300px] mx-auto italic">
                Exclusive offers & sneak peeks are reserved for those on our mailing list, plus enjoy 10% OFF your first order.
            </p>
            
            <form className="flex max-w-[400px] mx-auto">
                <input 
                    type="email" 
                    placeholder="ENTER YOUR EMAIL"
                    className="flex-1 bg-white border border-neutral-300 px-4 py-3.5 text-[10px] tracking-widest focus:outline-none placeholder:text-neutral-400"
                />
                <button 
                    type="submit"
                    className="bg-[#1a1a1a] text-white px-6 py-3.5 text-[10px] font-bold tracking-widest uppercase hover:bg-black transition-colors shrink-0"
                >
                    Sign Up
                </button>
            </form>
        </div>

        {/* Accordion Sections */}
        <div className="flex flex-col">
            {sections.map((section) => (
                <div key={section.id} className="border-b border-neutral-300/60">
                    <button 
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between py-5 px-6"
                    >
                        <span className="text-[11px] font-normal uppercase tracking-[0.2em] text-neutral-800">
                            {section.title}
                        </span>
                        <IoChevronDownOutline 
                            className={`text-neutral-500 transition-transform duration-300 ${openSections[section.id] ? 'rotate-180' : ''}`} 
                        />
                    </button>
                    
                    {openSections[section.id] && (
                        <div className="px-6 pb-6 animate-fade-in">
                            {section.isContact ? (
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <BsTelephone className="text-neutral-900 text-sm mt-0.5" />
                                        <div className="text-[11px]">
                                            <p className="text-neutral-500 font-light mb-0.5 italic">Call us Mon-Fri 10am-3pm</p>
                                            <a href="tel:+442038237768" className="text-neutral-700 font-normal">+44 (0) 203 823 7768</a>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <BsWhatsapp className="text-neutral-900 text-sm mt-0.5" />
                                        <div className="text-[11px]">
                                            <p className="text-neutral-500 font-light mb-0.5 italic">Talk to us on Whatsapp</p>
                                            <a href="https://wa.me/442038237768" className="text-neutral-700 font-normal">+44 (0) 203 823 7768</a>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <BsEnvelope className="text-neutral-900 text-sm mt-0.5" />
                                        <div className="text-[11px]">
                                            <p className="text-neutral-500 font-light mb-0.5 italic">Email us</p>
                                            <a href="mailto:admin@aabcollection.com" className="text-neutral-700 font-normal">admin@aabcollection.com</a>
                                        </div>
                                    </li>
                                </ul>
                            ) : (
                                <ul className="space-y-3">
                                    {section.links.map((link, idx) => (
                                        <li key={idx}>
                                            {link.textOnly ? (
                                                <span className="text-[11px] text-neutral-500 font-light italic">{link.label}</span>
                                            ) : (
                                                <a href={link.href} className="text-[11px] text-neutral-600 font-light hover:text-black transition-colors">
                                                    {link.label}
                                                </a>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>

        {/* Mobile Social Follow (Bottom) */}
        <div className="py-10 px-6">
            <h5 className="text-[11px] font-normal uppercase tracking-[0.2em] text-neutral-800 mb-6">
                Follow Us
            </h5>
            <div className="flex items-center gap-8">
                <a href="#fb" className="text-neutral-900 hover:opacity-70 transition-opacity"><FaFacebookF className="text-base" /></a>
                <a href="#ig" className="text-neutral-900 hover:opacity-70 transition-opacity"><FaInstagram className="text-lg" /></a>
                <a href="#yt" className="text-neutral-900 hover:opacity-70 transition-opacity"><FaYoutube className="text-lg" /></a>
                <a href="#pin" className="text-neutral-900 hover:opacity-70 transition-opacity"><FaPinterestP className="text-base" /></a>
            </div>
        </div>
      </div>

      {/* Desktop Footer Layout (lg screens) */}
      <div className="hidden lg:block bg-[#EAE1D4] py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-y-16 gap-x-12 xl:gap-8">
            
            {/* Column 1: Delivery & Returns */}
            <div className="xl:col-span-1">
              <h5 className="text-[13px] font-normal uppercase tracking-[0.2em] mb-8 text-neutral-800">
                {footerData.deliveryReturns.title}
              </h5>
              <ul className="space-y-4">
                <li><span className="text-sm text-neutral-600 font-light">{footerData.deliveryReturns.description}</span></li>
                {footerData.deliveryReturns.links.map((link, idx) => (
                  <li key={idx}><a href={link.href} className="text-sm text-neutral-600 font-light hover:text-black transition-colors">{link.title}</a></li>
                ))}
              </ul>
            </div>

            {/* Column 2: Customer Care */}
            <div className="xl:col-span-1">
              <h5 className="text-[13px] font-normal uppercase tracking-[0.2em] mb-8 text-neutral-800">
                {footerData.customerCare.title}
              </h5>
              <ul className="space-y-4">
                {footerData.customerCare.links.map((link, idx) => (
                  <li key={idx}><a href={link.href} className="text-sm text-neutral-600 font-light hover:text-black transition-colors">{link.title}</a></li>
                ))}
              </ul>
            </div>

            {/* Column 3: Get in Touch */}
            <div className="xl:col-span-1">
              <h5 className="text-[13px] font-normal uppercase tracking-[0.2em] mb-8 text-neutral-800">
                {footerData.getInTouch.title}
              </h5>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <BsTelephone className="text-neutral-900 text-lg shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-600 font-light mb-1 italic">{footerData.getInTouch.phoneHours}</p>
                    <a href={`tel:${footerData.getInTouch.phone.replace(/[^0-9+]/g, '')}`} className="text-sm text-neutral-700 font-normal hover:underline underline-offset-4">{footerData.getInTouch.phone}</a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <BsWhatsapp className="text-neutral-900 text-lg shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-600 font-light mb-1 italic">Talk to us on Whatsapp</p>
                    <a href={`https://wa.me/${footerData.getInTouch.whatsapp.replace(/[^0-9+]/g, '')}`} className="text-sm text-neutral-700 font-normal hover:underline underline-offset-4">{footerData.getInTouch.whatsapp}</a>
                  </div>
                </li>
                <li className="flex items-start gap-4 overflow-hidden">
                  <BsEnvelope className="text-neutral-900 text-lg shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm text-neutral-600 font-light mb-1 italic">Email us</p>
                    <a href={`mailto:${footerData.getInTouch.email}`} className="text-sm text-neutral-700 font-normal hover:underline underline-offset-4 break-words">{footerData.getInTouch.email}</a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 5: Join Our Community & Follow Us */}
            <div className="xl:col-span-1">
              <h5 className="text-[13px] font-normal uppercase tracking-[0.2em] mb-6 text-neutral-800">
                Join Our Community
              </h5>
              <p className="text-sm text-neutral-600 font-light leading-relaxed mb-8 italic">
                Exclusive offers & sneak peeks are reserved for those on our mailing list, plus enjoy 10% OFF your first order.
              </p>
              
              <form className="flex mb-12">
                <input 
                  type="email" 
                  placeholder="ENTER YOUR EMAIL"
                  className="flex-1 bg-white border-y border-l border-neutral-300 px-4 py-3 text-xs tracking-widest focus:outline-none placeholder:text-neutral-400"
                />
                <button 
                  type="submit"
                  className="bg-[#1a1a1a] text-white px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-black transition-colors shrink-0"
                >
                  Sign Up
                </button>
              </form>

              <h5 className="text-[13px] font-normal uppercase tracking-[0.2em] mb-6 text-neutral-800">
                Follow Us
              </h5>
              <div className="flex items-center gap-8">
                <a href="#fb" className="text-neutral-900 hover:opacity-70 transition-opacity"><FaFacebookF className="text-lg" /></a>
                <a href="#ig" className="text-neutral-900 hover:opacity-70 transition-opacity"><FaInstagram className="text-xl" /></a>
                <a href="#yt" className="text-neutral-900 hover:opacity-70 transition-opacity"><FaYoutube className="text-xl" /></a>
                <a href="#pin" className="text-neutral-900 hover:opacity-70 transition-opacity"><FaPinterestP className="text-lg" /></a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
