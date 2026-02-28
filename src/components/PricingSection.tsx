import React, { useState, useEffect } from 'react';
import { CheckCircle, Zap, Lock, ArrowRight } from 'lucide-react';

interface PricingSectionProps {
  onExploreCourses?: () => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onExploreCourses }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (totalSeconds <= 0) return { hours: 23, minutes: 59, seconds: 59 };
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    if (onExploreCourses) onExploreCourses();
    else {
      const el = document.querySelector('main');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 via-primary-900 to-purple-900 text-white relative overflow-hidden">
      {/* BG pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <span className="inline-block bg-yellow-400/20 text-yellow-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-yellow-400/30">
            ⏰ Limited Time Offer
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mb-4">
            Invest in Your Future <span className="text-yellow-400">Today</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Get access to any of our 20+ professional courses at an unbeatable price. Plus, our
            <span className="text-green-400 font-semibold"> Ethical Hacking Masterclass is completely FREE</span> right now!
          </p>
        </div>

        {/* Countdown */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-10">
          {[
            { value: timeLeft.hours, label: 'Hours' },
            { value: timeLeft.minutes, label: 'Minutes' },
            { value: timeLeft.seconds, label: 'Seconds' }
          ].map((item, i) => (
            <div key={i} className="text-center animate-countdown-pulse">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-2">
                <span className="text-2xl sm:text-3xl font-bold font-heading">{String(item.value).padStart(2, '0')}</span>
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Pricing card */}
        <div className="max-w-lg mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center mb-8">
          <div className="mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-4xl sm:text-5xl font-bold text-white font-heading">₹449</span>
              <div className="text-left">
                <span className="text-lg text-gray-400 line-through block">₹1,999</span>
                <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">Save 78%</span>
              </div>
            </div>
            <p className="text-sm text-gray-300">Average price per course • One-time payment</p>
          </div>

          <div className="space-y-3 mb-6 text-left">
            {[
              'Full lifetime access to course content',
              'Certificate of completion included',
              'Downloadable resources & source code',
              '24/7 community support access',
              '7-day money-back guarantee'
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-sm text-gray-200">{item}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleClick}
            className="w-full bg-yellow-400 text-gray-900 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all duration-200 shadow-btn flex items-center justify-center space-x-2"
          >
            <Zap className="h-5 w-5" />
            <span>Enroll Now — Save 78%</span>
            <ArrowRight className="h-5 w-5" />
          </button>

          <p className="text-xs text-gray-400 mt-3 flex items-center justify-center space-x-1">
            <Lock className="h-3 w-3" />
            <span>Secure checkout • Instant access</span>
          </p>
        </div>

        {/* Urgency */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-red-500/20 border border-red-400/30 px-4 py-2 rounded-full text-sm">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
            <span className="text-red-300 font-medium">🔥 247 students enrolled in the last 24 hours</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
