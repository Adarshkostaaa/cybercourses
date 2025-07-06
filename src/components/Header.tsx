import React, { useState } from 'react';
import { Search, Menu, X, Shield, ShoppingCart, BookOpen } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface HeaderProps {
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onAdminClick?: () => void;
  onCartClick?: () => void;
  onLibraryClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchChange, onCategoryChange, onAdminClick, onCartClick, onLibraryClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartCount } = useCart();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const categories = [
    'All', 'Cybersecurity', 'Video Editing', 'Programming', 
    'Digital Marketing', 'Web Development', 'Design', 'Data Science', 'Business'
  ];

  const cartCount = getCartCount();

  return (
    <header className="bg-black/90 backdrop-blur-md border-b border-cyan-400/30 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 animate-pulse" />
            <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-mono">
              CYBERCOURSE
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 flex-1 justify-center">
            <button 
              onClick={() => onCategoryChange('All')}
              className="hover:text-cyan-400 transition-colors duration-200 font-mono text-white text-sm xl:text-base"
            >
              Home
            </button>
            <button 
              onClick={() => onCategoryChange('Cybersecurity')}
              className="hover:text-cyan-400 transition-colors duration-200 font-mono text-white text-sm xl:text-base"
            >
              Courses
            </button>
            {onLibraryClick && (
              <button 
                onClick={onLibraryClick}
                className="hover:text-cyan-400 transition-colors duration-200 font-mono text-white text-sm xl:text-base"
              >
                My Library
              </button>
            )}
            {onAdminClick && (
              <button 
                onClick={onAdminClick}
                className="hover:text-cyan-400 transition-colors duration-200 font-mono text-white text-sm xl:text-base"
              >
                Admin
              </button>
            )}
          </nav>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4 flex-1 max-w-xs lg:max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 bg-black/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:bg-black/70 transition-all duration-200 text-white placeholder-gray-400 font-mono text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-shrink-0">
            {/* Library Button */}
            {onLibraryClick && (
              <button
                onClick={onLibraryClick}
                className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 font-mono text-xs sm:text-sm"
                title="My Library"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden lg:inline">My Library</span>
              </button>
            )}

            {/* Cart Button */}
            {onCartClick && (
              <button
                onClick={onCartClick}
                className="relative p-2 hover:bg-cyan-800/30 rounded-lg transition-colors duration-200"
                title="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-mono">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Admin Button */}
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="hidden sm:block bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 font-mono text-xs sm:text-sm"
              >
                Admin
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-cyan-800/30 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-black/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:bg-black/70 transition-all duration-200 text-white placeholder-gray-400 font-mono text-sm"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2">
            <button 
              onClick={() => {
                onCategoryChange('All');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-cyan-800/30 rounded-lg transition-colors duration-200 font-mono text-sm"
            >
              Home
            </button>
            <button 
              onClick={() => {
                onCategoryChange('Cybersecurity');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-cyan-800/30 rounded-lg transition-colors duration-200 font-mono text-sm"
            >
              Courses
            </button>
            {onLibraryClick && (
              <button 
                onClick={() => {
                  onLibraryClick();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full text-left px-4 py-2 hover:bg-cyan-800/30 rounded-lg transition-colors duration-200 font-mono text-sm"
              >
                <BookOpen className="h-4 w-4" />
                <span>My Library</span>
              </button>
            )}
            {onAdminClick && (
              <button 
                onClick={() => {
                  onAdminClick();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-cyan-800/30 rounded-lg transition-colors duration-200 font-mono text-sm"
              >
                Admin
              </button>
            )}
          </div>
        )}
      </div>

      {/* Category Pills - Mobile Optimized */}
      <div className="border-t border-cyan-400/20 px-4 sm:px-6 lg:px-8 py-2 sm:py-3 bg-black/30">
        <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className="whitespace-nowrap px-2 py-1 sm:px-3 sm:py-1 bg-black/50 hover:bg-cyan-700/30 border border-cyan-400/20 hover:border-cyan-400 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 font-mono"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;