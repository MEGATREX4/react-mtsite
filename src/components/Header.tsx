import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from './AppProvider';
import { useScrollPosition } from '../hooks';

export const Header: React.FC = () => {
  const { theme, language, translations, toggleTheme, changeLanguage } = useAppContext();
  const location = useLocation();
  const scrollPosition = useScrollPosition();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState<number>(4);
  const navRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isScrolled = scrollPosition > 50;

  const navigationItems = [
    { path: '/', label: translations?.common?.home || 'Home', icon: 'fas fa-home' },
    { path: '/portfolio', label: translations?.common?.portfolio || 'Portfolio', icon: 'fas fa-briefcase' },
    { path: '/completed_games', label: language === 'uk' ? 'Пройдені ігри' : 'Completed Games', icon: 'fas fa-gamepad' },
    { path: '/pc', label: language === 'uk' ? 'ПК' : 'PC', icon: 'fas fa-desktop' },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Calculate how many items can fit in the navigation
  useEffect(() => {
    const calculateVisibleItems = () => {
      if (!navRef.current || !containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const logoWidth = 200; // Approximate logo width
      const controlsWidth = 200; // Approximate controls width
      const availableWidth = containerWidth - logoWidth - controlsWidth - 48; // padding
      const itemWidth = 150; // Approximate item width
      
      const maxItems = Math.floor(availableWidth / itemWidth);
      setVisibleItems(Math.max(1, Math.min(maxItems, navigationItems.length)));
    };

    calculateVisibleItems();
    window.addEventListener('resize', calculateVisibleItems);
    return () => window.removeEventListener('resize', calculateVisibleItems);
  }, [navigationItems.length]);

  const desktopItems = navigationItems.slice(0, visibleItems);
  const overflowItems = navigationItems.slice(visibleItems);
  const hasOverflow = overflowItems.length > 0;

  if (!translations) return null;

  return (
    <motion.header
      // 1. Змінено умову для фону: додано `|| isMobileMenuOpen`
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        (isScrolled || isMobileMenuOpen)
          ? 'bg-white/90 dark:bg-dark-900/90 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className={`container mx-auto px-4 py-4 mb-10${isMobileMenuOpen ? ' overflow-hidden' : ''}`} ref={containerRef}> 
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <img
              src="https://i.imgur.com/Cw1AbQd.png"
              alt="MEGATREX4 Logo"
              className="w-10 h-10 rounded-full"
            />
            <span className="text-primary-600 dark:text-primary-400">
              MEGATREX4
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6" ref={navRef}>
            {desktopItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`}
              >
                <i className={item.icon} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-gray-100 dark:bg-dark-700 rounded-lg overflow-hidden">
              <button
                onClick={() => changeLanguage('uk')}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  language === 'uk'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                }`}
              >
                UK
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  language === 'en'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                }`}
              >
                EN
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'} />
            </button>

            {/* Mobile Menu Button - Show if mobile or has overflow */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${hasOverflow ? 'block' : 'md:hidden'} p-2 rounded-lg bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200`}
              aria-label="Toggle mobile menu"
            >
              <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 border-t border-gray-200 dark:border-dark-700"
            >
              <div className="flex flex-col space-y-2 pt-4">
                {/* Show overflow items on desktop, all items on mobile */}
                {(hasOverflow && window.innerWidth >= 768 ? overflowItems : navigationItems).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                      location.pathname === item.path
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                    }`}
                  >
                    <i className={item.icon} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};