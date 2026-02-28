import React from 'react';
import { Shield, CheckCircle, Lock, CreditCard, RefreshCcw, Star } from 'lucide-react';

interface GuaranteeSectionProps {
  onExploreCourses?: () => void;
}

const GuaranteeSection: React.FC<GuaranteeSectionProps> = ({ onExploreCourses }) => {
  const handleClick = () => {
    if (onExploreCourses) onExploreCourses();
    else {
      const el = document.querySelector('main');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Guarantee */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <Shield className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900 mb-4">
            7-Day Money Back <span className="text-green-600">Guarantee</span>
          </h2>
          <p className="text-lg text-gray-500 mb-6 max-w-xl mx-auto">
            We're so confident you'll love our courses that we offer a full refund within 7 days if you're not completely satisfied. No questions asked.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Full refund within 7 days</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>No questions asked</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Zero risk to you</span>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Lock, title: 'Secure Payment', desc: '256-bit SSL encryption' },
            { icon: CreditCard, title: 'Safe Checkout', desc: 'UPI & multiple payment options' },
            { icon: RefreshCcw, title: 'Money Back', desc: '7-day guarantee' },
            { icon: Star, title: 'Trusted by 25K+', desc: '4.8 average rating' }
          ].map((badge, i) => (
            <div key={i} className="flex flex-col items-center text-center p-5 bg-white rounded-xl border border-gray-100 hover:shadow-card transition-all duration-200">
              <div className="bg-primary-50 rounded-full p-3 mb-3">
                <badge.icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{badge.title}</h3>
              <p className="text-xs text-gray-500">{badge.desc}</p>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 sm:p-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-heading">
            Ready to Transform Your Career?
          </h3>
          <p className="text-lg text-primary-100 mb-6 max-w-lg mx-auto">
            Join thousands of students who already started their learning journey. Don't miss out on this limited-time offer.
          </p>
          <button
            onClick={handleClick}
            className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 shadow-btn"
          >
            Start Learning Today →
          </button>
          <p className="text-sm text-primary-200 mt-4">✓ No risk — 7-day money-back guarantee</p>
        </div>
      </div>
    </section>
  );
};

export default GuaranteeSection;
