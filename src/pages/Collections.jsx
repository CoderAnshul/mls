import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IoChevronBack, IoChevronForward, IoChevronDown } from 'react-icons/io5';
import ProductCard from '../components/common/ProductCard';
import { fetchProducts } from '../utils/api';
import { navigationData } from '../data/navigation';

const PRODUCT_TYPE_OPTIONS = [
  'ABAYA', 'ACTIVEWEAR', 'CAPE', 'CO-ORD', 'COATS & COVER-UPS',
  'FACE MASK', 'GIRLS ABAYA', 'HIJAB', 'HIJAB ACCESSORY', 'HIJAB CAP',
  'HOODY', 'KAFTAN', 'KIDS THOBE', 'KIMONO', 'LEGGINGS',
  'MAXI DRESS', 'MIDIS & TOPS', 'PRAYER OUTFIT', 'SCARVES',
  'SHIRT DRESS', 'SKIRT', 'SLIP DRESS', 'SWIMWEAR', 'THOBE', 'TROUSERS',
];

const SORT_OPTIONS = ['BESTSELLERS', 'NEW ARRIVALS', 'PRICE - LOW TO HIGH', 'PRICE - HIGH TO LOW'];

// ─── Checkbox component ───────────────────────────────────────────────────────
const FilterCheckbox = ({ label, checked, onChange }) => (
  <label 
    onClick={onChange}
    className="flex items-center gap-2 cursor-pointer group select-none"
  >
    <div
      className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-colors ${
        checked ? 'bg-[#252423] border-[#252423]' : 'border-black/30 bg-transparent'
      }`}
    >
      {checked && (
        <svg className="w-2 h-2 text-white" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
    <span className="text-[14px] tracking-[0.15em] uppercase font-normal text-[#252423]/80 group-hover:text-[#252423] transition-colors">
      {label}
    </span>
  </label>
);

// ─── Mobile accordion section ─────────────────────────────────────────────────
const MobileSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-black/10">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-[11px] tracking-[0.2em] uppercase font-bold text-[#252423]"
      >
        {title}
        <IoChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="pb-4 space-y-3">{children}</div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Collections page ────────────────────────────────────────────────────
const Collections = () => {
  const { category } = useParams();
  const [activeSubCategory, setActiveSubCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid4');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const limit = 10;
  const sliderRef = useRef(null);

  // Filter state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('NEW ARRIVALS');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColours, setSelectedColours] = useState([]);
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');

  // Dynamic filter options discovered from products
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColours, setAvailableColours] = useState([]);

  // Determine dynamic subCategories from navigation data
  const subCategories = React.useMemo(() => {
    const currentCategoryData = navigationData.mainMenu.find(item => 
      item.href === `/collections/${category}` || (item.href === '/collections/clothing' && !category)
    );

    let subs = currentCategoryData?.megaMenu?.columns?.reduce((acc, col) => {
      return [...acc, ...col.links.map(link => link.title)];
    }, []) || [];

    if (subs.length > 0 && !subs.some(s => s.toUpperCase() === 'VIEW ALL')) {
      subs = ['VIEW ALL', ...subs];
    }
    return subs;
  }, [category]);

  // Update active subcategory only when category changes or subCategories list changes
  useEffect(() => {
    if (subCategories.length > 0) {
      const viewAll = subCategories.find(s => s.toUpperCase() === 'VIEW ALL');
      if (viewAll) {
        setActiveSubCategory(viewAll);
      } else {
        setActiveSubCategory(subCategories[0]);
      }
    } else {
      setActiveSubCategory('ALL');
    }
    setCurrentPage(1);
  }, [category, subCategories]);

  // Detect overflow for centering and arrows
  useEffect(() => {
    const checkOverflow = () => {
      if (sliderRef.current) {
        setIsOverflowing(sliderRef.current.scrollWidth > sliderRef.current.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [subCategories]);

  // Discover dynamic filters for the current category
  useEffect(() => {
    const discoverFilters = async () => {
      const filters = { limit: 1000 }; // Fetch a large batch to get available options
      if (category && category !== 'clothing') filters.category = category;
      
      const data = await fetchProducts(filters);
      const allProducts = data.products || data;
      
      if (Array.isArray(allProducts)) {
        const sizes = new Set();
        const colors = new Set();
        
        allProducts.forEach(p => {
          if (p.sizes) p.sizes.forEach(s => sizes.add(s));
          if (p.colors) p.colors.forEach(c => colors.add(c));
          // Also check variants for colors if they exist
          if (p.variants) p.variants.forEach(v => {
            if (v.colorName) colors.add(v.colorName);
          });
        });
        
        setAvailableSizes(Array.from(sizes).sort());
        setAvailableColours(Array.from(colors).sort());
      }
    };
    discoverFilters();
  }, [category]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const filters = {
        page: currentPage,
        limit: limit,
        sort: selectedSort,
        types: selectedTypes.join(','),
        sizes: selectedSizes.join(','),
        colors: selectedColours.join(','),
        minPrice: priceFrom,
        maxPrice: priceTo
      };
      if (category && category !== 'clothing') filters.category = category;
      
      if (activeSubCategory !== 'ALL' && activeSubCategory !== 'VIEW ALL') {
        filters.category = activeSubCategory.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
      }
      
      const data = await fetchProducts(filters);
      // Client-side sort to guarantee "Newest First" even if backend hasn't updated/deployed yet
      const sortProducts = (list) => {
        if (!Array.isArray(list)) return list;
        return [...list].sort((a, b) => (b._id || b.id || "").localeCompare(a._id || a.id || ""));
      };

      if (data.products) {
        setProducts(sortProducts(data.products));
        setTotalPages(data.pages);
      } else {
        setProducts(sortProducts(data));
        setTotalPages(1);
      }
      setLoading(false);
    };
    load();
  }, [category, activeSubCategory, currentPage, selectedSort, selectedTypes, selectedSizes, selectedColours, priceFrom, priceTo]);


  const formattedCategory = category
    ? category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'CLOTHING';


  const handleScroll = (dir) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' });
    }
  };

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);

  const resetFilters = () => {
    setSelectedSort('NEW ARRIVALS');
    setSelectedTypes([]);
    setSelectedSizes([]);
    setSelectedColours([]);
    setPriceFrom('');
    setPriceTo('');
  };

  const hasActiveFilters = selectedSort || selectedTypes.length ||
    selectedSizes.length || selectedColours.length || priceFrom || priceTo;

  return (
    <main className="flex-1 bg-[#F4F2EA]">
      {/* Category Header */}
      <div className="pt-8 lg:pt-12 pb-8 px-4 text-center">
        <h2 className="text-[14px] font-bold uppercase tracking-[0.3em] text-[#252423]">
          VIEW ALL {formattedCategory.toUpperCase()}
        </h2>
      </div>

      {/* Sub-category Slider */}
      <div className="relative pb-2 md:pb-3 lg:pb-4 border-b border-black/5">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
          {isOverflowing && (
            <button 
              onClick={() => handleScroll('left')} 
              className="hidden lg:block p-2 pl-0 text-neutral-400 hover:text-black transition-colors z-10 shrink-0"
            >
              <IoChevronBack className="w-5 h-5" />
            </button>
          )}
          
          <div 
            ref={sliderRef} 
            className={`flex-1 overflow-x-auto scrollbar-hide flex items-center gap-3 sm:gap-5 md:gap-7 lg:gap-10 no-scrollbar touch-pan-x transition-all duration-300 ${
              !isOverflowing ? 'justify-center' : ''
            }`}
          >
            {subCategories.map((sub, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSubCategory(sub)}
                className={`text-[12px] font-bold uppercase tracking-[0.18em] whitespace-nowrap transition-all duration-300 pb-1 border-b-[1.5px] ${
                  activeSubCategory === sub ? 'text-black border-black' : 'text-neutral-400 border-transparent hover:text-black'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {isOverflowing && (
            <button 
              onClick={() => handleScroll('right')} 
              className="hidden lg:block p-2 pr-0 text-neutral-400 hover:text-black transition-colors z-10 shrink-0"
            >
              <IoChevronForward className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* ───────────── UTILITY BAR ───────────── */}
      <div className="">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 lg:px-12 py-5 flex items-center justify-between">
          {/* SORT BY */}
          <div>
            <button
              onClick={() => { setSortOpen(o => !o); setFiltersOpen(false); }}
              className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.1em] text-[#252423]"
            >
              SORT BY
              {sortOpen
                ? <span className="text-[14px] font-light leading-none ml-1">—</span>
                : <IoChevronDown className="w-3.5 h-3.5 ml-0.5" />}
            </button>
          </div>

          {/* Right group */}
          <div className="flex items-center gap-8">
            {/* FILTERS button */}
            <button
              onClick={() => { setFiltersOpen(o => !o); setSortOpen(false); }}
              className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.1em] text-[#252423]"
            >
              FILTERS
              {filtersOpen
                ? <span className="text-[14px] font-light leading-none ml-1">—</span>
                : <IoChevronDown className="w-3.5 h-3.5 ml-0.5" />}
              {hasActiveFilters && !filtersOpen && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B7355] inline-block ml-0.5" />
              )}
            </button>

            {/* Grid view toggles */}
            <div className="hidden md:flex items-center gap-5 border-l border-black/10 pl-7 h-5">
              <button
                onClick={() => setViewMode('grid4')}
                className={`transition-colors flex flex-col gap-0.5 ${viewMode === 'grid4' ? 'text-black' : 'text-neutral-300'}`}
              >
                <div className="flex gap-0.5">
                  <div className="w-1.5 h-1.5 bg-current" /><div className="w-1.5 h-1.5 bg-current" /><div className="w-1.5 h-1.5 bg-current" />
                </div>
                <div className="flex gap-0.5">
                  <div className="w-1.5 h-1.5 bg-current" /><div className="w-1.5 h-1.5 bg-current" /><div className="w-1.5 h-1.5 bg-current" />
                </div>
                <div className="flex gap-0.5">
                  <div className="w-1.5 h-1.5 bg-current" /><div className="w-1.5 h-1.5 bg-current" /><div className="w-1.5 h-1.5 bg-current" />
                </div>
              </button>
              <button
                onClick={() => setViewMode('grid2')}
                className={`p-1.5 transition-colors grid grid-cols-2 gap-0.5 ${viewMode === 'grid2' ? 'text-black' : 'text-neutral-300'}`}
              >
                <div className="w-3.5 h-3.5 bg-current" /><div className="w-3.5 h-3.5 bg-current" />
                <div className="w-3.5 h-3.5 bg-current" /><div className="w-3.5 h-3.5 bg-current" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SORT PANEL (desktop: horizontal row, mobile: stacked) — pushes content down ─── */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
        sortOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 lg:px-12 py-5">
          {/* Desktop: horizontal row */}
          <div className="hidden md:flex items-center gap-12">
            {SORT_OPTIONS.map(opt => (
              <FilterCheckbox
                key={opt} label={opt}
                checked={selectedSort === opt}
                onChange={() => setSelectedSort(selectedSort === opt ? null : opt)}
              />
            ))}
          </div>
          {/* Mobile: stacked */}
          <div className="md:hidden flex flex-col gap-4">
            {SORT_OPTIONS.map(opt => (
              <FilterCheckbox
                key={opt} label={opt}
                checked={selectedSort === opt}
                onChange={() => setSelectedSort(selectedSort === opt ? null : opt)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ───────────── DESKTOP FILTER PANEL ───────────── */}
      <div className={`hidden md:block overflow-hidden transition-all duration-500 ease-in-out ${
        filtersOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 lg:px-12 py-10">
          <div className="grid grid-cols-5 gap-8">
            {/* PRODUCT TYPE */}
            <div>
              <p className="text-[9px] tracking-[0.25em] uppercase font-bold text-[#252423] mb-5">Product Type</p>
              <div className="space-y-3">
                {PRODUCT_TYPE_OPTIONS.map(opt => (
                  <FilterCheckbox
                    key={opt} label={opt}
                    checked={selectedTypes.includes(opt)}
                    onChange={() => toggle(selectedTypes, setSelectedTypes, opt)}
                  />
                ))}
              </div>
            </div>

            {/* SIZE */}
            <div>
              <p className="text-[9px] tracking-[0.25em] uppercase font-bold text-[#252423] mb-5">Size</p>
              <div className="space-y-3">
                {availableSizes.length > 0 ? (
                  availableSizes.map(opt => (
                    <FilterCheckbox
                      key={opt} label={opt}
                      checked={selectedSizes.includes(opt)}
                      onChange={() => toggle(selectedSizes, setSelectedSizes, opt)}
                    />
                  ))
                ) : (
                  <p className="text-[10px] text-neutral-400 italic">No sizes available</p>
                )}
              </div>
            </div>

            {/* COLOUR */}
            <div>
              <p className="text-[9px] tracking-[0.25em] uppercase font-bold text-[#252423] mb-5">Colour</p>
              <div className="space-y-3">
                {availableColours.length > 0 ? (
                  availableColours.map(opt => (
                    <FilterCheckbox
                      key={opt} label={opt}
                      checked={selectedColours.includes(opt)}
                      onChange={() => toggle(selectedColours, setSelectedColours, opt)}
                    />
                  ))
                ) : (
                  <p className="text-[10px] text-neutral-400 italic">No colours available</p>
                )}
              </div>
            </div>

            {/* PRICE */}
            <div>
              <p className="text-[9px] tracking-[0.25em] uppercase font-bold text-[#252423] mb-5">Price</p>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="number" placeholder="£ FROM"
                  value={priceFrom}
                  onChange={e => setPriceFrom(e.target.value)}
                  className="w-full border border-black/20 bg-transparent px-3 py-2 text-[10px] tracking-[0.1em] uppercase outline-none focus:border-black/40 placeholder-black/30"
                />
                <span className="text-black/30 text-sm font-light">-</span>
                <input
                  type="number" placeholder="£ TO"
                  value={priceTo}
                  onChange={e => setPriceTo(e.target.value)}
                  className="w-full border border-black/20 bg-transparent px-3 py-2 text-[10px] tracking-[0.1em] uppercase outline-none focus:border-black/40 placeholder-black/30"
                />
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="mt-6 text-[9px] tracking-[0.2em] uppercase font-bold text-[#252423]/50 hover:text-[#252423] transition-colors border-b border-current pb-0.5"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ───────────── MOBILE FILTER PANEL ───────────── */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
        filtersOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-[#F4F2EA] px-8 pt-2 pb-6 border-b border-black/10">
          <MobileSection title="Product Type">
            {PRODUCT_TYPE_OPTIONS.map(opt => (
              <FilterCheckbox key={opt} label={opt} checked={selectedTypes.includes(opt)} onChange={() => toggle(selectedTypes, setSelectedTypes, opt)} />
            ))}
          </MobileSection>
          <MobileSection title="Size">
            {availableSizes.length > 0 ? (
              availableSizes.map(opt => (
                <FilterCheckbox key={opt} label={opt} checked={selectedSizes.includes(opt)} onChange={() => toggle(selectedSizes, setSelectedSizes, opt)} />
              ))
            ) : (
              <p className="text-[10px] text-neutral-400 italic py-2">No sizes available</p>
            )}
          </MobileSection>
          <MobileSection title="Colour">
            {availableColours.length > 0 ? (
              availableColours.map(opt => (
                <FilterCheckbox key={opt} label={opt} checked={selectedColours.includes(opt)} onChange={() => toggle(selectedColours, setSelectedColours, opt)} />
              ))
            ) : (
              <p className="text-[10px] text-neutral-400 italic py-2">No colours available</p>
            )}
          </MobileSection>
          <MobileSection title="Price">
            <div className="flex items-center gap-2">
              <input type="number" placeholder="£ FROM" value={priceFrom} onChange={e => setPriceFrom(e.target.value)}
                className="w-full border border-black/20 bg-transparent px-3 py-2 text-[10px] tracking-[0.1em] uppercase outline-none focus:border-black/40 placeholder-black/30"
              />
              <span className="text-black/30 text-sm font-light">-</span>
              <input type="number" placeholder="£ TO" value={priceTo} onChange={e => setPriceTo(e.target.value)}
                className="w-full border border-black/20 bg-transparent px-3 py-2 text-[10px] tracking-[0.1em] uppercase outline-none focus:border-black/40 placeholder-black/30"
              />
            </div>
          </MobileSection>

          {/* Mobile Apply / Reset */}
          <div className="flex items-center gap-8 mt-6 pt-4 border-t border-black/10">
            <button
              onClick={() => setFiltersOpen(false)}
              className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#252423] bg-[#252423] text-white px-6 py-3"
            >
              Apply
            </button>
            <button
              onClick={resetFilters}
              className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#252423]/60 hover:text-[#252423] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* ───────────── PRODUCT GRID ───────────── */}
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-12 py-10 pb-24">
        <div className={`grid gap-x-4 md:gap-x-5 gap-y-12 md:gap-y-16 transition-all duration-500 ${
          viewMode === 'grid4'
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : 'grid-cols-1 md:grid-cols-2'
        }`}>
          {loading ? (
            <div className="col-span-full py-20 text-center uppercase tracking-widest text-neutral-400">
              Loading products...
            </div>
          ) : products.length > 0 ? (
            products.map(product => (
              <ProductCard
                key={product._id || product.id}
                product={{ ...product, id: product._id || product.id, image: product.image || (product.images && product.images[0]) }}
                isEditorial={product.isEditorial}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center uppercase tracking-widest text-neutral-400">
              No products found in this category.
            </div>
          )}
        </div>

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`p-2 border border-black/10 rounded-full transition-all ${
                currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black hover:text-white'
              }`}
            >
              <IoChevronBack size={18} />
            </button>
            
            <div className="flex items-center gap-3">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-full text-[11px] font-bold transition-all ${
                    currentPage === i + 1 
                      ? 'bg-black text-white' 
                      : 'text-[#252423]/60 hover:text-black'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 border border-black/10 rounded-full transition-all ${
                currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black hover:text-white'
              }`}
            >
              <IoChevronForward size={18} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Collections;
