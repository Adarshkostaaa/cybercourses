import React, { useState, useEffect } from 'react';
import { Star, Users, Award, Play, CheckCircle, ArrowRight, Shield, Clock, TrendingUp } from 'lucide-react';

interface HeroSectionProps {
  onExploreCourses?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onExploreCourses }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    // Animate student count
    let count = 0;
    const target = 25847;
    const increment = Math.ceil(target / 60);
    const timer = setInterval(() => {
      count += increment;
      if (count >= target) {
        setStudentCount(target);
        clearInterval(timer);
      } else {
        setStudentCount(count);
      }
    }, 30);
    return () => clearInterval(timer);
  }, []);

  const handleExploreCourses = () => {
    if (onExploreCourses) {
      onExploreCourses();
    } else {
      const coursesSection = document.querySelector('main');
      if (coursesSection) {
        coursesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-purple-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Trust badges row */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1 rounded-full text-xs font-semibold">
                🏆 Bestseller
              </span>
              <span className="inline-flex items-center bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-semibold">
                <CheckCircle className="h-3 w-3 mr-1" /> Verified Creator
              </span>
              <span className="inline-flex items-center bg-primary-50 text-primary-700 border border-primary-200 px-3 py-1 rounded-full text-xs font-semibold">
                <TrendingUp className="h-3 w-3 mr-1" /> Trending
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-heading text-gray-900 leading-tight mb-6">
              Master <span className="text-primary-600">Cybersecurity</span> & Digital Skills — Even if You're a
              <span className="relative inline-block ml-2">
                <span className="text-primary-600">Beginner</span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M1 5.5C47 2 153 2 199 5.5" stroke="#6366f1" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
              Join <span className="font-semibold text-gray-900">{studentCount.toLocaleString()}+</span> students building real-world skills with hands-on courses taught by industry experts.
            </p>

            {/* Trust stats inline */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8">
              <div className="flex items-center space-x-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900">4.8</span>
                <span className="text-sm text-gray-500">(12,847 reviews)</span>
              </div>
              <div className="flex items-center space-x-1.5 text-sm text-gray-600">
                <Users className="h-4 w-4 text-primary-500" />
                <span className="font-semibold text-gray-900">25,847</span>
                <span>students</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
              <button
                onClick={handleExploreCourses}
                className="group inline-flex items-center justify-center bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-primary-700 transition-all duration-200 shadow-btn hover:shadow-soft"
              >
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="inline-flex items-center justify-center border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-base hover:border-primary-200 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>

            {/* Free course hook */}
            <div className="flex items-center gap-2 mb-8 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 max-w-md">
              <span className="text-green-600 text-lg">🎁</span>
              <p className="text-sm text-green-800 font-medium">
                <span className="font-bold">Ethical Hacking Masterclass</span> is completely <span className="text-green-700 font-bold">FREE</span> right now!
              </p>
            </div>

            {/* Instructor preview */}
            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-100 shadow-card max-w-sm">
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=60&h=60"
                alt="Instructor"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-100"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">Adarsh Kosta</p>
                <p className="text-xs text-gray-500">Cybersecurity Expert • 8+ years experience</p>
                <div className="flex items-center space-x-1 mt-0.5">
                  <CheckCircle className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-blue-600 font-medium">Verified Instructor</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content — Course Preview */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Mobile stats banner (replaces floating cards on small screens) */}
            <div className="grid grid-cols-3 gap-3 mb-4 md:hidden">
              {[
                { label: 'Completion', value: '98%', icon: '🏆' },
                { label: 'Courses', value: '120+', icon: '📚' },
                { label: 'Access', value: 'Lifetime', icon: '⏰' }
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-card p-3 text-center">
                  <span className="text-lg">{stat.icon}</span>
                  <p className="text-sm font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="relative">
              {/* Main image */}
              <div className="rounded-2xl overflow-hidden shadow-card-hover border border-gray-100">
                <img
                  src="https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Cybersecurity Course"
                  className="w-full h-72 sm:h-80 lg:h-96 object-cover"
                />
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-soft hover:scale-110 transition-transform cursor-pointer">
                    <Play className="h-8 w-8 text-primary-600 fill-primary-600" />
                  </div>
                </div>
              </div>

              {/* Floating stats cards — hidden on mobile to prevent overflow */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-card-hover border border-gray-100 p-3 animate-float hidden md:block">
                <div className="flex items-center space-x-2">
                  <div className="bg-green-100 rounded-lg p-1.5">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Completion Rate</p>
                    <p className="text-sm font-bold text-gray-900">98%</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-card-hover border border-gray-100 p-3 animate-float hidden md:block" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-2">
                  <div className="bg-primary-100 rounded-lg p-1.5">
                    <Shield className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Certified</p>
                    <p className="text-sm font-bold text-gray-900">120+ Courses</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -right-6 bg-white rounded-xl shadow-card-hover border border-gray-100 p-3 animate-float hidden lg:block" style={{ animationDelay: '2s' }}>
                <div className="flex items-center space-x-2">
                  <div className="bg-yellow-100 rounded-lg p-1.5">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Lifetime</p>
                    <p className="text-sm font-bold text-gray-900">Access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by companies */}
        <div className={`mt-10 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-100 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-center text-xs sm:text-sm text-gray-400 font-medium uppercase tracking-wider mb-6 sm:mb-8">Trusted by professionals from leading companies</p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 lg:gap-16 opacity-40 grayscale">
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'].map((company) => (
              <span key={company} className="text-lg sm:text-2xl font-bold text-gray-400 font-heading">{company}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
