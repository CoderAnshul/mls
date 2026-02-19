import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5';
import { api } from '../utils/api';

const Journal = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        setLoading(true);
        const data = await api.journals.getAll();
        setJournals(data || []);
      } catch (err) {
        console.error('Error fetching journals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJournals();
  }, []);

  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchVisible]);

  const filteredArticles = journals.filter(article =>
    article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).toUpperCase();
  };

  return (
    <div className="bg-[#F4F2EA] min-h-screen pt-8 pb-20 px-4 md:px-8 lg:px-12 transition-all duration-500">
      {/* Breadcrumbs */}
      <div className="max-w-screen-2xl mx-auto mb-12">
        <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] font-light uppercase text-neutral-500">
          <Link to="/" className="hover:text-black transition-colors">HOME</Link>
          <span>/</span>
          <span className="text-neutral-800">JOURNAL</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="max-w-screen-xl mx-auto text-center mb-16 px-4">
        <h1 className="text-[28px] md:text-[32px] tracking-[0.4em] font-light uppercase mb-6 text-neutral-900">
          JOURNAL
        </h1>

        {/* Toggleable Search Interface */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            className="p-2 text-neutral-600 hover:text-black transition-colors mb-4"
          >
            <IoSearchOutline size={22} className="stroke-[1.5px]" />
          </button>

          {/* Animated Search Bar Area */}
          <div
            className={`w-full max-w-[800px] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden ${isSearchVisible ? 'max-h-20 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
              }`}
          >
            <div className="relative flex items-center px-4">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="SEARCH FOR ARTICLES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-neutral-300 pb-2 text-[11px] md:text-[12px] tracking-[0.25em] font-light text-neutral-800 placeholder:text-neutral-400 focus:outline-none transition-colors duration-500 focus:border-neutral-500 uppercase"
              />
              <button
                onClick={() => {
                  setIsSearchVisible(false);
                  setSearchQuery('');
                }}
                className="absolute right-4 pb-2 text-neutral-400 hover:text-black transition-colors"
                title="Close Search"
              >
                <IoCloseOutline size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-screen-2xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <p className="uppercase tracking-[0.2em] text-neutral-400 text-xs">Fetching latest stories...</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredArticles.map((article) => (
              <Link key={article._id} to={`/journal/${article.slug}`} className="group block text-center">
                {/* Image with hover effect */}
                <div className="aspect-[1.5/1] bg-neutral-200 overflow-hidden mb-8">
                  <img
                    src={article.heroImage}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Text Content */}
                <div className="px-4">
                  <h5 className="text-[13px] md:text-[14px] tracking-[0.15em] font-bold uppercase leading-relaxed mb-3 text-neutral-800 group-hover:text-neutral-600 transition-colors px-2">
                    {article.title}
                  </h5>

                  <p className="text-[10px] tracking-[0.2em] font-light text-neutral-400 uppercase mb-6">
                    {formatDate(article.date)}
                  </p>

                  <div className="text-[13px] md:text-[15px] font-light text-neutral-500 leading-relaxed max-w-sm mx-auto tracking-wide">
                    {article.excerpt || (article.content?.blocks?.find(b => b.type === 'paragraph')?.data?.text?.replace(/<[^>]*>/g, '').substring(0, 160) + '...') || ''}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="uppercase tracking-[0.2em] text-neutral-400 text-xs">No articles found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
