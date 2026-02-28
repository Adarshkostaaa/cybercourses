import React, { useState } from 'react';
import { Search, Menu, X, ShoppingCart, BookOpen, GraduationCap, ChevronDown } from 'lucide-react';
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
  const [showCategories, setShowCategories] = useState(false);
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white text-center py-2 px-4 text-sm font-medium">
        🔥 <span className="font-semibold">Flash Sale!</span> Get up to <span className="font-bold">80% OFF</span> on all courses — Limited time only!
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0 cursor-pointer" onClick={() => onCategoryChange('All')}>
            <div className="bg-primary-600 rounded-lg p-1.5">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold font-heading text-gray-900">
              Cyber<span className="text-primary-600">Course</span>
            </span>
          </div>

          {/* Categories Dropdown */}
          <div className="hidden lg:flex relative ml-6">
            <button
              onClick={() => setShowCategories(!showCategories)}
              onBlur={() => setTimeout(() => setShowCategories(false), 200)}
              className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <span>Categories</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showCategories ? 'rotate-180' : ''}`} />
            </button>
            {showCategories && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-card-hover border border-gray-100 py-2 w-56 z-50">
                {categories.filter(c => c !== 'All').map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      onCategoryChange(category);
                      setShowCategories(false);
                    }}
                    className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for courses, topics, or skills..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all text-sm text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {onLibraryClick && (
              <button
                onClick={onLibraryClick}
                className="flex items-center space-x-1.5 text-sm font-medium text-gray-700 hover:text-primary-600 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">My Library</span>
              </button>
            )}

            {onCartClick && (
              <button
                onClick={onCartClick}
                className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors"
                title="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            )}

            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="hidden sm:block text-sm font-medium text-gray-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Admin
              </button>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-sm text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-100 pt-3 space-y-1 animate-fade-in">
            <button onClick={() => { onCategoryChange('All'); setIsMenuOpen(false); }}
              className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors">
              Home
            </button>
            {categories.filter(c => c !== 'All').map(category => (
              <button key={category} onClick={() => { onCategoryChange(category); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors">
                {category}
              </button>
            ))}
            {onLibraryClick && (
              <button onClick={() => { onLibraryClick(); setIsMenuOpen(false); }}
                className="flex items-center space-x-2 w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors">
                <BookOpen className="h-4 w-4" /><span>My Library</span>
              </button>
            )}
            {onAdminClick && (
              <button onClick={() => { onAdminClick(); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors">
                Admin
              </button>
            )}
          </div>
        )}
      </div>

      {/* Category Pills */}
      <div className="hidden lg:block border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className="whitespace-nowrap px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
