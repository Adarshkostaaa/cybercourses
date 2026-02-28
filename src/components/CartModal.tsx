import { ShoppingCart, X, Trash2, CreditCard, Shield, Tag } from 'lucide-react';
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

  const totalPrice = getTotalPrice();
  const originalTotal = cartItems.reduce((sum, item) => sum + (item.course.price * 2.5), 0);
  const savings = Math.round(originalTotal - totalPrice);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 font-heading">Shopping Cart</h2>
                <p className="text-xs text-gray-500">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Cart Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingCart className="h-14 w-14 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2 font-heading">Your cart is empty</h3>
              <p className="text-sm text-gray-500 mb-4">Add some courses to get started!</p>
              <button onClick={onClose}
                className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-btn text-sm">
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-gray-50 border border-gray-100 rounded-xl p-3 group hover:border-primary-200 transition-all">
                  <div className="flex items-start space-x-3">
                    <img src={item.course.image_url} alt={item.course.title}
                      className="w-20 h-14 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight">{item.course.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{item.course.category} • {item.course.level}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-primary-600 font-bold text-sm">₹{item.course.price}</span>
                          <span className="text-xs text-gray-400 line-through">₹{Math.round(item.course.price * 2.5)}</span>
                        </div>
                        <button onClick={() => removeFromCart(item.course.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Remove">
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
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            {/* Savings Badge */}
            {savings > 0 && (
              <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2 mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4 text-green-600" />
                <span className="text-green-700 text-sm font-medium">You're saving ₹{savings.toLocaleString()} on this order!</span>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-sm text-gray-500">Total</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">₹{totalPrice.toLocaleString()}</span>
                  <span className="text-sm text-gray-400 line-through">₹{Math.round(originalTotal).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Shield className="h-3.5 w-3.5 text-green-500" />
                <span>Secure checkout</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={clearCart}
                className="flex-1 bg-white border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all text-sm">
                Clear Cart
              </button>
              <button onClick={handleCheckout}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold transition-all shadow-btn hover:shadow-lg text-sm flex items-center justify-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Checkout</span>
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-3">7-day money back guarantee • Lifetime access</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
