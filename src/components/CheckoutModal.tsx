import React, { useState, useEffect } from 'react';
import { X, Copy, CheckCircle, QrCode, CreditCard, Smartphone, Building, User, Phone, Lock, Shield, Star } from 'lucide-react';
import { Course } from '../types';
import { supabase, testConnection } from '../lib/supabase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  course?: Course;
  courses?: Course[];
  userEmail?: string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, course, courses, userEmail }) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [showPaymentWaiting, setShowPaymentWaiting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [userDetails, setUserDetails] = useState({ fullName: '', phone: '' });

  const coursesToCheckout = courses || (course ? [course] : []);
  const totalOriginalPrice = coursesToCheckout.reduce((sum, c) => sum + c.price, 0);

  const validCoupons: Record<string, number> = { 'GET20': 20, 'FREE20': 20, 'SAVE30': 30 };

  const discount = appliedCoupon ? validCoupons[appliedCoupon] || 0 : 0;
  const discountAmount = (totalOriginalPrice * discount) / 100;
  const finalPrice = totalOriginalPrice - discountAmount;

  const upiId = "adarshkosta@fam";

  useEffect(() => {
    if (userEmail) setUserDetails(prev => ({ ...prev }));
  }, [userEmail]);

  const handleApplyCoupon = () => {
    if (validCoupons[couponCode]) setAppliedCoupon(couponCode);
    else alert('Invalid coupon code');
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleConfirmPayment = () => {
    if (!userDetails.fullName.trim() || !userEmail?.trim() || !userDetails.phone.trim()) {
      alert('Please fill in all your details');
      return;
    }
    if (!userEmail?.includes('@')) {
      alert('Invalid user email. Please sign in again.');
      return;
    }
    coursesToCheckout.forEach(courseItem => createPurchaseRecord(courseItem));
    setShowPaymentWaiting(true);
  };

  const createPurchaseRecord = async (courseItem: Course) => {
    try {
      const purchaseAmount = coursesToCheckout.length === 1 ? finalPrice : Math.round((courseItem.price / totalOriginalPrice) * finalPrice);
      const savedEmail = localStorage.getItem('library_user_email');
      const finalUserEmail = savedEmail || userEmail?.trim() || '';

      const localPurchase = {
        id: `local_${Date.now()}_${courseItem.id}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: null, course_id: courseItem.id, payment_status: 'pending',
        amount_paid: purchaseAmount, coupon_used: appliedCoupon || null,
        user_email: finalUserEmail, user_phone: userDetails.phone.trim(),
        user_name: userDetails.fullName.trim(), course_title: courseItem.title,
        course_price: purchaseAmount, created_at: new Date().toISOString()
      };

      const existingPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
      existingPurchases.push(localPurchase);
      localStorage.setItem('admin_purchases', JSON.stringify(existingPurchases));

      const recentPurchases = JSON.parse(localStorage.getItem('recent_purchases') || '[]');
      const existingRecent = recentPurchases.find((p: any) =>
        p.course_id === localPurchase.course_id && p.user_email.toLowerCase() === localPurchase.user_email.toLowerCase()
      );
      if (!existingRecent) recentPurchases.push(localPurchase);
      localStorage.setItem('recent_purchases', JSON.stringify(recentPurchases));

      try {
        const connectionOk = await testConnection();
        if (connectionOk) {
          const purchaseData = {
            user_id: null, course_id: courseItem.id, payment_status: 'pending' as const,
            amount_paid: purchaseAmount, coupon_used: appliedCoupon || null,
            user_email: finalUserEmail, user_phone: userDetails.phone.trim(),
            user_name: userDetails.fullName.trim(), course_title: courseItem.title,
            course_price: purchaseAmount
          };
          await supabase.from('purchases').insert([purchaseData]);
        }
      } catch (dbError) { console.warn('Database operation failed, using local storage:', dbError); }
    } catch (error) { console.error('Error in createPurchaseRecord:', error); }
  };

  if (!isOpen) return null;

  if (showPaymentWaiting) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl animate-fade-in-up">
          <div className="mb-6">
            <div className="relative mx-auto w-24 h-24 mb-5">
              <div className="absolute inset-0 bg-green-200 rounded-full animate-breathe"></div>
              <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 font-heading">Payment Confirmed! 🎉</h3>
            <p className="text-gray-600 mb-5 text-sm leading-relaxed">
              Your payment has been received successfully. Course access will be granted within 20-30 minutes.
            </p>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-5">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="text-green-700 text-sm font-bold">Order Submitted Successfully</p>
              </div>
              <p className="text-green-600 text-xs">
                Course link will be sent to <strong>{userEmail}</strong> once payment is verified.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-2">
              <p className="text-blue-700 text-xs font-medium">
                📧 Check your email (including spam folder) within 30 minutes
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white py-3.5 rounded-xl font-bold text-base hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
            Continue Exploring Courses
          </button>
          <p className="text-xs text-gray-400 mt-4">
            Need help? <a href="mailto:adarshkosta1@gmail.com" className="text-primary-600 hover:underline font-medium">adarshkosta1@gmail.com</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-50 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[95vh] overflow-y-auto shadow-2xl scroll-smooth-ios">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50 flex items-center justify-between rounded-t-3xl sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-heading">Complete Your Purchase</h2>
            <div className="flex items-center space-x-2 mt-1">
              <Lock className="h-3.5 w-3.5 text-green-500" />
              <span className="text-xs text-green-600 font-medium">Secure Checkout</span>
              <Shield className="h-3.5 w-3.5 text-blue-500 ml-2" />
              <span className="text-xs text-blue-600 font-medium">SSL Protected</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Left — Order & User Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                {coursesToCheckout.map((courseItem) => (
                  <div key={courseItem.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <img src={courseItem.image_url} alt={courseItem.title} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{courseItem.title}</h4>
                      <p className="text-xs text-gray-500">{courseItem.category} • {courseItem.level}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-primary-600 font-bold text-sm">₹{courseItem.price}</span>
                        <div className="flex items-center space-x-0.5">
                          {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* User Details */}
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Your Details</h3>
              {userEmail && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-700">Signed in as: <strong>{userEmail}</strong></span>
                </div>
              )}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" name="fullName" value={userDetails.fullName} onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-sm text-gray-900 placeholder-gray-400"
                      placeholder="Your full name" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="tel" name="phone" value={userDetails.phone} onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-sm text-gray-900 placeholder-gray-400"
                      placeholder="+91 9876543210" required />
                  </div>
                </div>
              </div>

              {/* Coupon */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Coupon Code</label>
                <div className="flex space-x-2">
                  <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 text-sm placeholder-gray-400" />
                  <button onClick={handleApplyCoupon} className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
                    Apply
                  </button>
                </div>
                {appliedCoupon && <p className="text-green-600 text-sm mt-1 font-medium">✓ {appliedCoupon} applied — {discount}% off</p>}
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 text-sm mb-3">Price Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({coursesToCheckout.length} {coursesToCheckout.length === 1 ? 'course' : 'courses'})</span>
                    <span className="font-medium text-gray-900">₹{totalOriginalPrice}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discount}%)</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-primary-600 text-lg">₹{finalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Guarantee reminder */}
              <div className="mt-4 flex items-center space-x-2 text-xs text-gray-500">
                <Shield className="h-4 w-4 text-green-500" />
                <span>7-day money-back guarantee • Instant access after payment verification</span>
              </div>
            </div>

            {/* Right — Payment */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Payment Method</h3>
              <div className="space-y-3 mb-6">
                <div onClick={() => setSelectedPaymentMethod('upi')}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === 'upi' ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-100' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-primary-600" />
                    <div><h4 className="font-medium text-gray-900 text-sm">UPI Payment</h4><p className="text-xs text-gray-500">Pay using any UPI app</p></div>
                    {selectedPaymentMethod === 'upi' && <CheckCircle className="h-5 w-5 text-primary-600 ml-auto" />}
                  </div>
                </div>
                {[{ icon: CreditCard, title: 'Credit/Debit Card', sub: 'Coming Soon' }, { icon: Building, title: 'Net Banking', sub: 'Coming Soon' }].map((m, i) => (
                  <div key={i} className="p-4 border border-gray-200 rounded-xl opacity-50 cursor-not-allowed">
                    <div className="flex items-center space-x-3">
                      <m.icon className="h-5 w-5 text-gray-400" />
                      <div><h4 className="font-medium text-gray-400 text-sm">{m.title}</h4><p className="text-xs text-gray-400">{m.sub}</p></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* UPI Details */}
              {selectedPaymentMethod === 'upi' && (
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-6 text-center mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <QrCode className="h-5 w-5 text-primary-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-base">Scan to Pay ₹{finalPrice}</h4>
                  </div>
                  <div className="mb-4 mx-auto w-fit bg-white p-3 rounded-2xl shadow-lg border border-gray-100">
                    <img 
                      src="/qr.png" 
                      alt="UPI QR Code" 
                      className="w-48 h-48 object-contain rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Try SVG fallback
                        if (target.src.includes('.png')) {
                          target.src = '/qr-code.svg';
                        } else if (target.src.includes('-code.svg')) {
                          target.src = '/qr-placeholder.svg';
                        }
                      }}
                    />
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-3 mb-3">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Or pay using UPI ID:</p>
                    <div className="flex items-center justify-center space-x-2">
                      <code className="bg-primary-50 px-4 py-2 rounded-lg text-sm text-primary-700 border border-primary-200 font-bold tracking-wide">{upiId}</code>
                      <button onClick={handleCopyUPI} className="p-2 hover:bg-gray-100 rounded-lg transition-all active:scale-95">
                        {copied ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-gray-400" />}
                      </button>
                    </div>
                    {copied && <p className="text-green-600 text-xs mt-1 font-medium animate-fade-in">✓ UPI ID copied!</p>}
                  </div>
                  <p className="text-xs text-gray-400">Supports Google Pay, PhonePe, Paytm & all UPI apps</p>
                </div>
              )}

              {/* Steps */}
              <div className="bg-gradient-to-r from-primary-50 to-indigo-50 border border-primary-100 rounded-xl p-5 mb-6">
                <h4 className="font-bold text-primary-900 text-sm mb-3 flex items-center gap-2">
                  <Smartphone className="h-4 w-4" /> Quick Payment Steps
                </h4>
                <div className="space-y-3">
                  {[
                    `Pay ₹${finalPrice} using QR code or UPI ID`,
                    'Click "Confirm Payment" after completing payment',
                    `Get course link at ${userEmail} within 20-30 minutes`
                  ].map((step, i) => (
                    <div key={i} className="flex items-center space-x-3 text-sm text-primary-800">
                      <span className="bg-gradient-to-br from-primary-600 to-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm">{i + 1}</span>
                      <span className="font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm */}
              <button onClick={handleConfirmPayment}
                disabled={selectedPaymentMethod !== 'upi' || !userDetails.fullName || !userEmail || !userDetails.phone}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-base hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-[1.02] active:scale-[0.98]">
                <CheckCircle className="h-5 w-5" />
                <span>Confirm Payment Completed</span>
              </button>

              <div className="mt-3 flex items-center justify-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center space-x-1"><Lock className="h-3 w-3" /><span>Secure</span></div>
                <div className="flex items-center space-x-1"><Shield className="h-3 w-3" /><span>Encrypted</span></div>
              </div>

              <p className="text-xs text-gray-400 text-center mt-3">
                Need help? <a href="mailto:adarshkosta1@gmail.com" className="text-primary-600 hover:underline">adarshkosta1@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
