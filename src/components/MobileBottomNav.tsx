import React from 'react';
import { Home, Search, ShoppingCart, BookOpen } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface MobileBottomNavProps {
  onHomeClick: () => void;
  onSearchClick: () => void;
  onCartClick: () => void;
  onLibraryClick: () => void;
  activeTab?: string;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onHomeClick,
  onSearchClick,
  onCartClick,
  onLibraryClick,
  activeTab = 'home'
}) => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, onClick: onHomeClick },
    { id: 'search', label: 'Search', icon: Search, onClick: onSearchClick },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, onClick: onCartClick, badge: cartCount },
    { id: 'library', label: 'Library', icon: BookOpen, onClick: onLibraryClick },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-50 md:hidden safe-bottom">
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 relative min-w-[56px] ${
              activeTab === item.id
                ? 'text-primary-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="relative">
              <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'stroke-[2.5px]' : ''}`} />
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-0.5 font-medium ${activeTab === item.id ? 'font-semibold' : ''}`}>
              {item.label}
            </span>
            {activeTab === item.id && (
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary-600 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;
