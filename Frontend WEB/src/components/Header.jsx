import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icons from './Icons';
import { companyData } from '../constants/companyData';

export default function Header({ currentPage, setCurrentPage, t, lang, setLang }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    { key: 'home', label: t.home || 'Home' },
    { key: 'about', label: t.about || 'About' },
    { key: 'products', label: t.products || 'Products' },
    { key: 'portfolio', label: t.portfolio || 'Portfolio' },
    { key: 'gallery', label: t.gallery || 'Gallery' },
    { key: 'contact', label: t.contact || 'Contact' },
  ];

  const handleMenuClose = () => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <header className="bg-[#003366] text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex-shrink-0">
            <Link to="/" onClick={handleMenuClose} className="flex items-center cursor-pointer">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white text-[#003366] font-bold text-base sm:text-lg flex items-center justify-center rounded-md transform -skew-x-12">AKS</div>
              <div className="flex flex-col justify-center ml-2">
                <span className="text-lg sm:text-xl font-bold tracking-wider leading-tight">{companyData.shortName}</span>
                <span className="text-xs sm:text-sm text-white/80 font-normal leading-tight">Electrical, Panel Maker & Supplier</span>
              </div>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <div className="flex items-baseline space-x-2 lg:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.key === 'home' ? '/' : `/${item.key}`}
                  onClick={handleMenuClose}
                  className={`px-2 py-1.5 lg:px-3 lg:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-300 cursor-pointer ${
                    (location.pathname === '/' && item.key === 'home') || location.pathname === `/${item.key}`
                      ? 'bg-white text-[#003366]'
                      : 'hover:bg-white hover:text-[#003366]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex gap-1 lg:gap-2 items-center border-l border-white/20 pl-3 lg:pl-6">
              <button
                onClick={() => setLang('id')}
                className={`px-2 py-1 rounded-md text-xs sm:text-sm font-medium transition-all duration-300 ${
                  lang === 'id' ? 'bg-white text-[#003366]' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                ID
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-md text-xs sm:text-sm font-medium transition-all duration-300 ${
                  lang === 'en' ? 'bg-white text-[#003366]' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                EN
              </button>
            </div>
          </div>
          <div className="md:hidden flex items-center gap-1">
            <div className="flex gap-0.5">
              <button
                onClick={() => setLang('id')}
                className={`px-1.5 py-0.5 rounded text-xs font-medium transition-all duration-300 ${
                  lang === 'id' ? 'bg-white text-[#003366]' : 'bg-white/10 text-white'
                }`}
              >
                ID
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-1.5 py-0.5 rounded text-xs font-medium transition-all duration-300 ${
                  lang === 'en' ? 'bg-white text-[#003366]' : 'bg-white/10 text-white'
                }`}
              >
                EN
              </button>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white hover:text-[#003366] focus:outline-none"
              aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
              title={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
            >
              {isMenuOpen ? Icons.x : Icons.menu}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.key === 'home' ? '/' : `/${item.key}`}
                onClick={handleMenuClose}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-white hover:text-[#003366] transition-colors duration-300 cursor-pointer"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
