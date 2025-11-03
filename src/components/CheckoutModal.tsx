import React, { useState, useEffect } from 'react';
import { X, Copy, CheckCircle, Clock, QrCode, CreditCard, Smartphone, Building, User, Mail, Phone } from 'lucide-react';
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
  
  // User details form
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    phone: ''
  });

  // Handle both single course and multiple courses
  const coursesToCheckout = courses || (course ? [course] : []);
  const totalOriginalPrice = coursesToCheckout.reduce((sum, c) => sum + c.price, 0);

  const validCoupons = {
    'GET20': 20,
    'FREE20': 20,
    'SAVE30': 30
  };

  const discount = appliedCoupon ? validCoupons[appliedCoupon as keyof typeof validCoupons] || 0 : 0;
  const discountAmount = (totalOriginalPrice * discount) / 100;
  const finalPrice = totalOriginalPrice - discountAmount;

  const upiId = "adarshkosta@fam";

  // Set user email from props when component mounts or userEmail changes
  useEffect(() => {
    if (userEmail) {
      setUserDetails(prev => ({ ...prev }));
    }
  }, [userEmail]);

  const handleApplyCoupon = () => {
    if (validCoupons[couponCode as keyof typeof validCoupons]) {
      setAppliedCoupon(couponCode);
    } else {
      alert('Invalid coupon code');
    }
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleConfirmPayment = () => {
    // Validate user details
    if (!userDetails.fullName.trim() || !userEmail?.trim() || !userDetails.phone.trim()) {
      alert('Please fill in all your details');
      return;
    }

    if (!userEmail?.includes('@')) {
      alert('Invalid user email. Please sign in again.');
      return;
    }

    // Create purchase records for all courses
    coursesToCheckout.forEach(courseItem => {
      createPurchaseRecord(courseItem);
    });
    
    setShowPaymentWaiting(true);
  };

  const createPurchaseRecord = async (courseItem: Course) => {
    try {
      console.log('Attempting to create purchase record for course:', courseItem.title);
      
      // Create purchase data
      const purchaseAmount = coursesToCheckout.length === 1 ? finalPrice : Math.round((courseItem.price / totalOriginalPrice) * finalPrice);
      
      // Get the user's registered email from library users if they're signed in
      const savedEmail = localStorage.getItem('library_user_email');
      const finalUserEmail = savedEmail || userEmail?.trim() || '';
      
      // Always store locally first (guaranteed to work)
      const localPurchase = {
        id: `local_${Date.now()}_${courseItem.id}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: null,
        course_id: courseItem.id,
        payment_status: 'pending',
        amount_paid: purchaseAmount,
        coupon_used: appliedCoupon || null,
        user_email: finalUserEmail,
        user_phone: userDetails.phone.trim(),
        user_name: userDetails.fullName.trim(),
        course_title: courseItem.title,
        course_price: purchaseAmount,
        created_at: new Date().toISOString()
      };
      
      // Store for admin processing (always works)
      const existingPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
      existingPurchases.push(localPurchase);
      localStorage.setItem('admin_purchases', JSON.stringify(existingPurchases));
      
      // Also store in recent purchases for immediate library access
      const recentPurchases = JSON.parse(localStorage.getItem('recent_purchases') || '[]');
      // Check if this purchase already exists to avoid duplicates
      const existingRecent = recentPurchases.find((p: any) => 
        p.course_id === localPurchase.course_id && 
        p.user_email.toLowerCase() === localPurchase.user_email.toLowerCase()
      );
      
      if (!existingRecent) {
        recentPurchases.push(localPurchase);
      }
      localStorage.setItem('recent_purchases', JSON.stringify(recentPurchases));
      
      console.log('Purchase stored locally for admin processing');
      
      // Try to store in database as backup (don't block if it fails)
      try {
        const connectionOk = await testConnection();
        if (connectionOk) {
          const purchaseData = {
            user_id: null,
            course_id: courseItem.id,
            payment_status: 'pending' as const,
            amount_paid: purchaseAmount,
            coupon_used: appliedCoupon || null,
            user_email: finalUserEmail,
            user_phone: userDetails.phone.trim(),
            user_name: userDetails.fullName.trim(),
            course_title: courseItem.title,
            course_price: purchaseAmount
          };

          const { error } = await supabase
            .from('purchases')
            .insert([purchaseData]);

          if (error) {
            console.warn('Database insert failed, but local storage succeeded:', error);
          } else {
            console.log('Purchase also stored in database successfully');
          }
        } else {
          console.warn('Database connection failed, using local storage only');
        }
      } catch (dbError) {
        console.warn('Database operation failed, but local storage succeeded:', dbError);
      }
      
    } catch (error) {
      console.error('Error in createPurchaseRecord:', error);
      // This shouldn't happen since we're using localStorage, but just in case
      console.warn('Unexpected error, but purchase should still be recorded locally');
    }
  };

  if (!isOpen) return null;

  if (showPaymentWaiting) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-black/90 border border-cyan-400/30 rounded-xl max-w-md w-full p-6 sm:p-8 text-center backdrop-blur-md">
          <div className="mb-6">
            <div className="bg-green-600/20 border border-green-400/30 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-400 animate-pulse" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-mono">Payment Confirmation Received!</h3>
            <p className="text-gray-300 mb-4 font-mono text-sm sm:text-base">
              Your payment confirmation has been received. Course access will be granted within 20-30 minutes.
            </p>
            <div className="bg-green-600/20 border border-green-400/30 rounded-lg p-3 sm:p-4 mb-4">
              <p className="text-green-200 text-xs sm:text-sm font-medium font-mono">
                ✓ Course link will be sent to {userEmail} once payment is verified.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-2 sm:py-3 px-4 rounded-lg font-medium hover:from-cyan-700 hover:to-purple-700 transition-all duration-200 font-mono border border-cyan-400/30 hover:border-cyan-400 text-sm sm:text-base"
            >
              Continue Shopping
            </button>
            <p className="text-xs sm:text-sm text-gray-400 font-mono">
              Need help? Contact us at <a href="mailto:adarshkosta1@gmail.com" className="text-cyan-400 hover:text-cyan-300">adarshkosta1@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/90 border border-cyan-400/30 rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto backdrop-blur-md">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-cyan-400/20 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">Complete Your Purchase</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-cyan-800/30 rounded-full transition-colors duration-200"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Course Details & User Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 font-mono">Order Summary</h3>
              
              {/* Course List */}
              <div className="space-y-3 mb-6">
                {coursesToCheckout.map((courseItem, index) => (
                  <div key={courseItem.id} className="bg-black/50 border border-cyan-400/20 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start space-x-3">
                      <img 
                        src={courseItem.image_url}
                        alt={courseItem.title}
                        className="w-16 h-12 sm:w-20 sm:h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white font-mono text-sm sm:text-base line-clamp-2">{courseItem.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-400 font-mono">{courseItem.category} • {courseItem.level}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-cyan-400 font-bold text-sm sm:text-base font-mono">₹{courseItem.price}</span>
                          <span className="text-xs text-gray-500 font-mono">{courseItem.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* User Details Form */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 font-mono">Your Details</h3>
                
                {/* Show signed in email */}
                <div className="mb-4 p-3 bg-green-600/20 border border-green-400/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-mono text-sm">Signed in as: {userEmail}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={userDetails.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 sm:py-3 bg-black/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-gray-500 transition-all duration-200 font-mono text-sm sm:text-base"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={userDetails.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 sm:py-3 bg-black/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-gray-500 transition-all duration-200 font-mono text-sm sm:text-base"
                        placeholder="+91 9876543210"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
                  Coupon Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter GET20, FREE20, or SAVE30"
                    className="flex-1 px-3 py-2 bg-black/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-gray-500 transition-all duration-200 font-mono text-sm"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg hover:from-cyan-700 hover:to-purple-700 transition-all duration-200 font-mono border border-cyan-400/30 hover:border-cyan-400 text-sm"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-green-400 text-sm mt-1 font-mono">
                    ✓ {appliedCoupon} applied - {discount}% off
                  </p>
                )}
              </div>

              {/* Price Summary */}
              <div className="bg-black/50 border border-cyan-400/20 rounded-lg p-4">
                <h4 className="font-medium text-white mb-3 font-mono">Price Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-mono text-sm">Subtotal ({coursesToCheckout.length} {coursesToCheckout.length === 1 ? 'course' : 'courses'})</span>
                    <span className="font-medium text-white font-mono text-sm">₹{totalOriginalPrice}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-400 font-mono text-sm">
                      <span>Discount ({discount}%)</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="border-t border-cyan-400/20 pt-2">
                    <div className="flex justify-between text-lg font-bold text-white font-mono">
                      <span>Total</span>
                      <span className="text-cyan-400">₹{finalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Payment */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 font-mono">Payment Method</h3>
              
              {/* Payment Method Selection */}
              <div className="space-y-3 mb-6">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedPaymentMethod === 'upi' 
                      ? 'border-cyan-400 bg-cyan-400/10' 
                      : 'border-gray-600 bg-black/30'
                  }`}
                  onClick={() => setSelectedPaymentMethod('upi')}
                >
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-cyan-400" />
                    <div>
                      <h4 className="font-medium text-white font-mono">UPI Payment</h4>
                      <p className="text-sm text-gray-400 font-mono">Pay using any UPI app</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`p-4 border rounded-lg cursor-not-allowed opacity-50 ${
                    selectedPaymentMethod === 'card' 
                      ? 'border-cyan-400 bg-cyan-400/10' 
                      : 'border-gray-600 bg-black/30'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-400 font-mono">Credit/Debit Card</h4>
                      <p className="text-sm text-gray-500 font-mono">Coming Soon</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`p-4 border rounded-lg cursor-not-allowed opacity-50 ${
                    selectedPaymentMethod === 'netbanking' 
                      ? 'border-cyan-400 bg-cyan-400/10' 
                      : 'border-gray-600 bg-black/30'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-400 font-mono">Net Banking</h4>
                      <p className="text-sm text-gray-500 font-mono">Coming Soon</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* UPI Payment Details */}
              {selectedPaymentMethod === 'upi' && (
                <div className="bg-black/50 border border-cyan-400/20 rounded-lg p-4 text-center mb-6">
                  <div className="flex items-center justify-center mb-3">
                    <QrCode className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 mr-2" />
                    <h4 className="font-medium text-white font-mono text-sm sm:text-base">Scan QR Code to Pay ₹{finalPrice}</h4>
                  </div>
                  
                  <div className="mb-3 mx-auto w-fit">
                    <img 
                      src="/qr.png"
                      alt="UPI Payment QR Code"
                      className="w-40 h-40 sm:w-56 sm:h-56 object-cover rounded-lg"
                    />
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-2 font-mono">Or use UPI ID directly:</p>
                  <div className="flex items-center justify-center space-x-2">
                    <code className="bg-black/50 px-3 py-1 rounded text-sm text-cyan-400 border border-cyan-400/30 font-mono">{upiId}</code>
                    <button
                      onClick={handleCopyUPI}
                      className="p-1 hover:bg-cyan-700/30 rounded transition-colors duration-200"
                      title="Copy UPI ID"
                    >
                      {copied ? <CheckCircle className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-gray-300" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Instructions */}
              <div className="bg-cyan-600/20 border border-cyan-400/30 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-cyan-200 mb-3 font-mono text-sm sm:text-base">Quick Payment Steps</h4>
                <div className="text-xs sm:text-sm text-cyan-100 space-y-2 font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="bg-cyan-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                    <span>Pay ₹{finalPrice} using QR code or UPI ID</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-cyan-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                    <span>Click "Confirm Payment" after completing payment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-cyan-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                    <span>Get course link at {userEmail} within 20-30 minutes</span>
                  </div>
                </div>
              </div>

              {/* Confirm Payment Button */}
              <button
                onClick={handleConfirmPayment}
                disabled={selectedPaymentMethod !== 'upi' || !userDetails.fullName || !userEmail || !userDetails.phone}
                className="w-full bg-gradient-to-r from-green-600 to-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-cyan-700 transition-all duration-200 transform hover:scale-105 font-mono border border-green-400/30 hover:border-green-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
              >
                ✓ Confirm Payment Completed
              </button>
              
              <p className="text-xs text-gray-400 text-center mt-2 font-mono">
                Need help? Contact us at <a href="mailto:adarshkosta1@gmail.com" className="text-cyan-400 hover:text-cyan-300">adarshkosta1@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
