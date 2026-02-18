import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoChevronDown } from 'react-icons/io5';
import { fetchNavigation } from '../../utils/api';
import { navigationData as staticNavigationData } from '../../data/navigation';
import MegaMenu from './MegaMenu';

const Navigation = ({ className = '', isScrolled = false, isMegaMenuOpen = false, onMegaMenuToggle }) => {
  const { pathname } = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [menuItems, setMenuItems] = useState(staticNavigationData.mainMenu);

  useEffect(() => {
    const loadNavigation = async () => {
      const data = await fetchNavigation();
      if (data && data.length > 0) {
        const formattedMenu = data.map(item => ({
          title: item.title,
          href: item.href,
          // Restoration: Populate submenu from sections for the "scrolled" state
          submenu: item.sections.length > 0 ? item.sections.flatMap(sec => 
            sec.links.map(link => ({ title: link.label, href: link.href }))
          ) : null,
          megaMenu: item.sections.length > 0 || (item.features && item.features.length > 0) ? {
            columns: item.sections.map(sec => ({
              title: sec.heading,
              links: sec.links.map(link => ({ title: link.label, href: link.href }))
            })),
            // Restoration: Use the new features array from the model
            features: item.features || []
          } : null
        }));
        setMenuItems(formattedMenu);
      }
    };
    loadNavigation();
  }, []);
  
  const isHome = pathname === '/';
  
  const handleMouseEnter = (index) => {
    setActiveDropdown(index);
    // Always notify header to become solid when any menu is open
    onMegaMenuToggle?.(true);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
    onMegaMenuToggle?.(false);
  };

  const isSolidHeader = isScrolled || isMegaMenuOpen || activeDropdown !== null || !isHome;

  return (
    <nav className={className}>
      <ul className="flex items-center gap-8">
        {menuItems.map((item, index) => (
          <li 
            key={index}
            className="static" // Mega menu needs static for full-width positioning
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <Link 
              to={item.href}
              className="flex items-center gap-1 text-[13px] font-medium uppercase tracking-[0.15em] transition-colors py-4 px-2"
              style={{
                color: isSolidHeader ? '#000000' : '#FFFFFF'
              }}
              onClick={() => {
                setActiveDropdown(null);
                onMegaMenuToggle?.(false);
              }}
            >
              {item.title}
            </Link>
            
            {/* Simple Dropdown - Commented out as requested */}
            {/* 
            {item.submenu && activeDropdown === index && isScrolled && (
              <div 
                className={`absolute top-full mt-0 bg-white border border-neutral-100 shadow-xl min-w-[280px] animate-fade-in py-6 z-50 ${
                  index > menuItems.length / 2 ? 'right-0' : 'left-0'
                }`}
              >
                {item.submenu.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    to={subItem.href}
                    className="block px-10 py-3 text-[13px] text-neutral-800 font-normal hover:bg-neutral-50 transition-colors tracking-wide"
                    onClick={() => {
                      setActiveDropdown(null);
                      onMegaMenuToggle?.(false);
                    }}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
            */}

            {/* Mega Menu - Now shown always on hover if data exists */}
            {item.megaMenu && (
              <MegaMenu 
                data={item.megaMenu} 
                isVisible={activeDropdown === index} 
                onClose={() => {
                  setActiveDropdown(null);
                  onMegaMenuToggle?.(false);
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
