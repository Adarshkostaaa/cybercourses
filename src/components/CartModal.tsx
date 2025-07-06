import React from 'react';
import { X, Trash2, ShoppingCart, CreditCard } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Course } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: (courses: Course[]) => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onCheckout }) => {
  const { cartItems, removeFromCart, clearCart, getTotalPrice } = useCart();

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      const courses = cartItems.map(item => item.course);
      onCheckout(courses);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/90 border border-cyan-400/30 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden backdrop-blur-md">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-cyan-400/20 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-6 w-6 text-cyan-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">Shopping Cart</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-cyan-800/30 rounded-full transition-colors duration-200"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Cart Content */}
        <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 font-mono">Your cart is empty</h3>
              <p className="text-gray-400 font-mono text-sm sm:text-base">Add some courses to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-black/50 border border-cyan-400/20 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <img 
                      src={item.course.image_url} 
                      alt={item.course.title}
                      className="w-16 h-12 sm:w-20 sm:h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm sm:text-base font-mono line-clamp-2">{item.course.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-400 font-mono">{item.course.category} • {item.course.level}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-cyan-400 font-bold text-sm sm:text-base font-mono">₹{item.course.price}</span>
                        <button
                          onClick={() => removeFromCart(item.course.id)}
                          className="p-1 sm:p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors duration-200"
                          title="Remove from cart"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-cyan-400/20 bg-black/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg sm:text-xl font-bold text-white font-mono">Total:</span>
              <span className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono">₹{getTotalPrice().toLocaleString()}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={clearCart}
                className="flex-1 bg-red-600/20 border border-red-400/30 text-red-400 py-2 sm:py-3 px-4 rounded-lg font-medium hover:bg-red-600/30 hover:border-red-400 transition-all duration-200 font-mono text-sm sm:text-base"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-2 sm:py-3 px-4 rounded-lg font-medium hover:from-cyan-700 hover:to-purple-700 transition-all duration-200 font-mono text-sm sm:text-base flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Checkout ({cartItems.length} items)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;