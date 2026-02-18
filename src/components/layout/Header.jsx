import { Link, useLocation } from 'react-router-dom';
import { IoSearchOutline, IoPersonOutline, IoHeartOutline, IoBagOutline, IoMenuOutline, IoChevronDown } from 'react-icons/io5';
import { navigationData } from '../../data/navigation';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
import { useEffect, useState } from 'react';
import SearchOverlay from './SearchOverlay';
import AccountSidebar from './AccountSidebar';
import CartSidebar from './CartSidebar';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Header = () => {
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { cartCount, isCartOpen, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  
  const isHome = pathname === '/';
  const isSolid = isScrolled || isMegaMenuOpen || !isHome;
  const textColor = isSolid ? '#000000' : '#FFFFFF';
  const bgColor = (isScrolled || isMegaMenuOpen) ? '#F4F2EA' : isHome ? 'transparent' : '#F4F2EA';
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when overlays are open
  useEffect(() => {
    const lock = isSearchOpen || isAccountOpen || isCartOpen || isMobileMenuOpen;
    if (lock) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isSearchOpen, isAccountOpen, isCartOpen, isMobileMenuOpen]);
  
  return (
    <>
      <header 
      className={`sticky top-0 z-[100] transition-all duration-500 ${
        isScrolled ? 'shadow-md backdrop-blur-md' : ''
      }`} 
      style={{ 
        backgroundColor: isScrolled || isMegaMenuOpen ? bgColor : 'transparent',
        color: textColor
      }}
    >
      <div className="w-full mx-auto px-2 sm:px-4 lg:px-8">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between py-2">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center transition-opacity duration-500 hover:opacity-80" 
          >
            <img 
              src="/brand_logo.png" 
              alt="mls logo" 
              className="h-14 w-auto object-contain transition-all duration-500"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <Navigation 
            className="block" 
            isScrolled={isScrolled} 
            isMegaMenuOpen={isMegaMenuOpen}
            onMegaMenuToggle={setIsMegaMenuOpen}
          />
          
          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {/* Region Selector - Desktop */}
            <div className="relative">
              <button 
                className="flex items-center gap-1 text-[11px] uppercase tracking-widest transition-colors duration-500"
                onClick={() => setIsRegionOpen(!isRegionOpen)}
                style={{
                  color: textColor
                }}
              >
                <span>UK</span>
              </button>
              
              {isRegionOpen && (
                <div className="absolute top-full right-0 mt-4 bg-white border border-neutral-100 shadow-xl min-w-[150px] animate-fade-in z-50">
                  {navigationData.regions.map((region, index) => (
                    <a
                      key={index}
                      href={region.href}
                      className="block px-6 py-3 text-[12px] text-neutral-800 hover:bg-neutral-50 transition-colors uppercase tracking-wider"
                    >
                      {region.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            {/* Search */}
            <button 
              className="p-1 transition-colors duration-500"
              onClick={() => setIsSearchOpen(true)}
              style={{
                color: textColor
              }}
            >
              <IoSearchOutline className="w-5 h-5" />
            </button>
            
            {/* User Account */}
            <button 
              className="p-1 transition-colors duration-500"
              onClick={() => setIsAccountOpen(true)}
              style={{
                color: textColor
              }}
            >
              <IoPersonOutline className="w-5 h-5" />
            </button>
            
            {/* Wishlist */}
            <Link 
              to="/wishlist"
              className="p-1 transition-colors duration-500 relative"
              style={{
                color: textColor
              }}
            >
              <IoHeartOutline className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full border border-[#F4F2EA]">
                  {wishlist.length}
                </span>
              )}
            </Link>
            
            {/* Cart */}
            <button 
              className="p-1 transition-colors duration-500 relative"
              onClick={() => setIsCartOpen(true)}
              style={{
                color: textColor
              }}
            >
              <IoBagOutline className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full border border-[#F4F2EA]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Header (Medium and Lower) */}
        <div className="lg:hidden relative flex items-center justify-between py-4">
          {/* Left: Hamburger & Search */}
          <div className="flex items-center gap-4">
            <button 
              className="p-1 transition-colors duration-500"
              onClick={() => setIsMobileMenuOpen(true)}
              style={{ color: textColor }}
            >
              <IoMenuOutline className="w-7 h-7" />
            </button>
            <button 
              className="p-1 transition-colors duration-500"
              onClick={() => setIsSearchOpen(true)}
              style={{ color: textColor }}
            >
              <IoSearchOutline className="w-6 h-6" />
            </button>
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link to="/" className="flex items-center">
              <img 
                src="/brand_logo.png" 
                alt="logo" 
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Right: Account & Bag */}
          <div className="flex items-center gap-4">
            <button 
              className="p-1 transition-colors duration-500"
              onClick={() => setIsAccountOpen(true)}
              style={{ color: textColor }}
            >
              <IoPersonOutline className="w-6 h-6" />
            </button>
            <button 
              className="p-1 flex items-baseline transition-colors duration-500 relative"
              onClick={() => setIsCartOpen(true)}
              style={{ color: textColor }}
            >
              <IoBagOutline className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="text-[10px] ml-0.5 tracking-tighter opacity-80">({cartCount})</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Overlays & Sidebars - Moved outside header to fix fixed positioning when scrolling */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
      
      <AccountSidebar 
        isOpen={isAccountOpen} 
        onClose={() => setIsAccountOpen(false)} 
      />
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
};

export default Header;
