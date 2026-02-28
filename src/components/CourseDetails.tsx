import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Clock, Users, Shield, Play, CheckCircle, Heart, BookOpen, Award, Globe, Lock, ChevronDown, ChevronUp, Zap, BadgeCheck } from 'lucide-react';
import { Course } from '../types';
import FreeCourseReferral from './FreeCourseReferral';
import PsychologicalEngagement from './PsychologicalEngagement';

interface CourseDetailsProps {
  course: Course;
  onBack: () => void;
  onEnroll: (course: Course) => void;
  onSignInRequired?: () => void;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ course, onBack, onEnroll, onSignInRequired }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 42, seconds: 18 });
  const [userEmail, setUserEmail] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('library_user_email');
    const savedRemember = localStorage.getItem('library_remember_me');
    if (savedEmail && savedRemember === 'true') {
      setUserEmail(savedEmail);
      setIsSignedIn(true);
    }
  }, []);

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

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'instructor', label: 'Instructor' },
    { id: 'reviews', label: 'Reviews' }
  ];

  const curriculum = [
    { title: 'Getting Started & Introduction', duration: '45 min', lessons: 5, locked: false, topics: ['Welcome & Course Overview', 'Setting Up Your Environment', 'Core Concepts & Fundamentals', 'Industry Overview', 'Your First Exercise'] },
    { title: 'Core Fundamentals Deep Dive', duration: '1.5 hrs', lessons: 8, locked: false, topics: ['Core Principles', 'Essential Tools', 'Key Technologies', 'Best Practices'] },
    { title: 'Intermediate Techniques', duration: '2.5 hrs', lessons: 12, locked: true, topics: ['Advanced Concepts', 'Real-World Patterns', 'Optimization Strategies', 'Practical Exercises'] },
    { title: 'Advanced Mastery', duration: '3 hrs', lessons: 15, locked: true, topics: ['Expert-Level Techniques', 'Complex Projects', 'Industry Standards', 'Performance Tuning'] },
    { title: 'Tools & Professional Workflow', duration: '2 hrs', lessons: 10, locked: true, topics: ['Professional Tools', 'Workflow Automation', 'Collaboration', 'Deployment'] },
    { title: 'Real-World Projects & Capstone', duration: '2 hrs', lessons: 6, locked: true, topics: ['Case Study Analysis', 'Capstone Project', 'Portfolio Building', 'Career Next Steps'] }
  ];

  const reviews = [
    { name: 'Alex Kumar', rating: 5, comment: 'Absolutely phenomenal course! The instructor explains complex concepts in a way that just clicks. Best investment I\'ve made in my career.', date: '2 days ago', verified: true },
    { name: 'Sarah Chen', rating: 5, comment: 'I went from zero knowledge to building real projects. The hands-on approach is exactly what I needed. Highly recommended!', date: '1 week ago', verified: true },
    { name: 'Mike Johnson', rating: 5, comment: 'Great content and excellent production quality. The community support is outstanding too. Worth every rupee!', date: '2 weeks ago', verified: true },
    { name: 'Priya Sharma', rating: 5, comment: 'This course helped me land my dream job. The curriculum is perfectly structured and the projects are industry-relevant.', date: '3 weeks ago', verified: true }
  ];

  const whatYouLearn = [
    `Master ${course.category} fundamentals and methodologies`,
    'Build real-world projects from scratch',
    'Use professional industry-standard tools',
    'Understand best practices and patterns',
    'Create a strong portfolio to showcase',
    'Get career-ready with practical skills'
  ];

  const isFree = course.price === 0;
  const originalPrice = isFree ? 1999 : Math.floor(course.price * 2.5);
  const discountPercent = isFree ? 100 : Math.round(((originalPrice - course.price) / originalPrice) * 100);

  const toggleSection = (index: number) => {
    setExpandedSections(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const totalLessons = curriculum.reduce((sum, s) => sum + s.lessons, 0);

  return (
    <div className="min-h-screen bg-white pb-20 sm:pb-0">
      {/* Sticky Mobile CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:hidden z-40 safe-bottom shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            {isFree ? (
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-green-600">FREE</span>
                <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-gray-900">₹{course.price}</span>
                <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>
                <span className="text-xs text-green-600 font-semibold">{discountPercent}% off</span>
              </div>
            )}
          </div>
          <button
            onClick={() => isFree ? document.getElementById('referral-section')?.scrollIntoView({ behavior: 'smooth' }) : onEnroll(course)}
            className={`px-6 py-3 rounded-xl font-bold text-sm shadow-btn ${
              isFree ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
          >
            {isFree ? '🎁 Get Free Access' : 'Enroll Now'}
          </button>
        </div>
      </div>

      {/* Course header banner */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <button onClick={onBack} className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors mb-6 text-sm">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Courses</span>
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Breadcrumb */}
              <div className="text-sm text-gray-400 mb-4">
                Home &gt; {course.category} &gt; <span className="text-white">{course.title}</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-yellow-400 text-yellow-900 px-2.5 py-0.5 rounded text-xs font-bold">Bestseller</span>
                <span className="bg-green-500 text-white px-2.5 py-0.5 rounded text-xs font-bold">Updated Recently</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading mb-4 leading-tight">{course.title}</h1>
              <p className="text-lg text-gray-300 mb-4 leading-relaxed">{course.description}</p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400 font-bold">4.8</span>
                  <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />)}</div>
                  <span className="text-sm text-gray-400">(12,847 ratings)</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-400">
                  <Users className="h-4 w-4" />
                  <span>42,368 students</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center space-x-3">
                <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=40&h=40" alt="Instructor" className="w-8 h-8 rounded-full object-cover" />
                <span className="text-sm text-gray-300">Created by <span className="text-primary-300 font-medium">Adarsh Kosta</span></span>
                <BadgeCheck className="h-4 w-4 text-blue-400" />
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1"><Clock className="h-4 w-4" /><span>{course.duration}</span></div>
                <div className="flex items-center space-x-1"><BookOpen className="h-4 w-4" /><span>{totalLessons} lessons</span></div>
                <div className="flex items-center space-x-1"><Globe className="h-4 w-4" /><span>English</span></div>
                <div className="flex items-center space-x-1"><Award className="h-4 w-4" /><span>Certificate</span></div>
              </div>
            </div>

            {/* Mobile course image */}
            <div className="lg:hidden">
              <img src={course.image_url} alt={course.title} className="w-full h-48 sm:h-64 object-cover rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* What You'll Learn */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 font-heading mb-4">What You'll Learn</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {whatYouLearn.map((item, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6 -mx-4 sm:mx-0">
              <nav className="flex space-x-1 sm:space-x-8 overflow-x-auto scrollbar-hide px-4 sm:px-0">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-3 sm:px-0 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 font-heading mb-3">Course Description</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{course.description}</p>
                  <p className="text-gray-600 leading-relaxed">
                    This comprehensive course is designed to take you from beginner to advanced level with practical, project-based learning.
                    You'll gain hands-on experience with real-world scenarios and industry-standard tools, preparing you for a successful career.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 font-heading mb-3">Prerequisites</h3>
                  <ul className="space-y-2">
                    {['Basic computer knowledge', 'Willingness to learn and practice', 'No prior experience required — we start from scratch'].map((item, i) => (
                      <li key={i} className="flex items-center space-x-3"><CheckCircle className="h-4 w-4 text-green-500" /><span className="text-sm text-gray-600">{item}</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 font-heading mb-3">Who This Course Is For</h3>
                  <ul className="space-y-2">
                    {['Complete beginners looking to start a new career', 'Professionals wanting to upgrade their skills', 'Students seeking practical, industry-relevant knowledge', 'Anyone interested in learning at their own pace'].map((item, i) => (
                      <li key={i} className="flex items-center space-x-3"><CheckCircle className="h-4 w-4 text-primary-500" /><span className="text-sm text-gray-600">{item}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Curriculum */}
            {activeTab === 'curriculum' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 font-heading">Course Curriculum</h3>
                  <span className="text-sm text-gray-500">{curriculum.length} sections • {totalLessons} lessons • {course.duration}</span>
                </div>
                {curriculum.map((section, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => toggleSection(i)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-5 w-5 text-primary-500" />
                        <div className="text-left">
                          <h4 className="font-medium text-gray-900 text-sm">{section.title}</h4>
                          <p className="text-xs text-gray-500">{section.lessons} lessons • {section.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {section.locked && <Lock className="h-4 w-4 text-gray-400" />}
                        {expandedSections.includes(i) ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                      </div>
                    </button>
                    {expandedSections.includes(i) && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        <div className="space-y-2 mt-3">
                          {section.topics?.map((topic, j) => (
                            <div key={j} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                              {section.locked && j > 1 ? <Lock className="h-3.5 w-3.5 text-gray-400" /> : <Play className="h-3.5 w-3.5 text-primary-500" />}
                              <span className="text-sm text-gray-600">{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Instructor */}
            {activeTab === 'instructor' && (
              <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl border border-primary-100 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=120&h=120" alt="Instructor" className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-soft" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-gray-900 font-heading">Adarsh Kosta</h3>
                      <BadgeCheck className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="text-primary-600 font-medium text-sm mb-3">Cybersecurity Expert & Full-Stack Educator</p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      With over 8 years of experience, Adarsh has helped thousands of students launch successful careers. He holds CEH, CISSP & OSCP certifications.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[{ v: '50+', l: 'Courses' }, { v: '25K+', l: 'Students' }, { v: '4.9', l: 'Rating' }, { v: '8+', l: 'Years' }].map((s, i) => (
                        <div key={i} className="bg-white rounded-lg p-2 text-center border border-gray-100">
                          <div className="text-sm font-bold text-primary-600">{s.v}</div>
                          <div className="text-xs text-gray-500">{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 font-heading">Student Reviews</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />)}</div>
                    <span className="text-sm font-semibold text-gray-900">4.8 out of 5</span>
                  </div>
                </div>
                {reviews.map((review, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-card transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">{review.name.charAt(0)}</div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-semibold text-gray-900">{review.name}</h4>
                            {review.verified && <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium border border-green-200">Verified</span>}
                          </div>
                          <div className="flex items-center space-x-1 mt-0.5">{[...Array(review.rating)].map((_, j) => <Star key={j} className="h-3 w-3 text-yellow-400 fill-current" />)}</div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-36">
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-card">
                {/* Course image — desktop only */}
                <div className="hidden lg:block">
                  <div className="relative">
                    <img src={course.image_url} alt={course.title} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-soft hover:scale-110 transition-transform cursor-pointer">
                        <Play className="h-6 w-6 text-primary-600 fill-primary-600" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Price */}
                  <div className="mb-4">
                    {isFree ? (
                      <>
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="text-3xl font-bold text-green-600 font-heading">FREE</span>
                          <span className="text-lg text-gray-400 line-through">₹{originalPrice}</span>
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold animate-pulse">🎁 100% FREE</span>
                        </div>
                        <p className="text-sm text-green-600 font-medium">You save ₹{originalPrice}! Limited time offer.</p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="text-3xl font-bold text-gray-900 font-heading">₹{course.price}</span>
                          <span className="text-lg text-gray-400 line-through">₹{originalPrice}</span>
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">{discountPercent}% off</span>
                        </div>
                        <p className="text-sm text-green-600 font-medium">You save ₹{originalPrice - course.price}!</p>
                      </>
                    )}
                  </div>

                  {/* Countdown */}
                  <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4 text-center">
                    <p className="text-xs text-red-600 font-semibold mb-1">⏰ Sale ends in</p>
                    <div className="flex justify-center gap-2">
                      {[
                        { v: timeLeft.hours, l: 'hr' },
                        { v: timeLeft.minutes, l: 'min' },
                        { v: timeLeft.seconds, l: 'sec' }
                      ].map((t, i) => (
                        <span key={i} className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-bold">
                          {String(t.v).padStart(2, '0')}{t.l}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="space-y-3 mb-5" id="referral-section">
                    {isFree ? (
                      <div className="space-y-4">
                        <FreeCourseReferral
                          courseId={course.id}
                          courseTitle={course.title}
                          driveUrl={course.drive_url}
                          userEmail={userEmail}
                          isSignedIn={isSignedIn}
                          onSignInRequired={onSignInRequired || (() => {})}
                        />
                      </div>
                    ) : (
                      <button onClick={() => onEnroll(course)}
                        className="w-full py-3.5 rounded-xl font-bold text-base transition-colors shadow-btn flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white">
                        <Zap className="h-5 w-5" /><span>Enroll Now</span>
                      </button>
                    )}
                    <button onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`w-full py-3 rounded-xl font-semibold text-sm border transition-colors flex items-center justify-center space-x-2 ${isWishlisted ? 'bg-red-50 border-red-200 text-red-600' : 'border-gray-200 text-gray-700 hover:border-primary-300'}`}>
                      <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} /><span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                    </button>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 pb-5 border-b border-gray-100">
                    {[
                      { label: 'Lifetime access', icon: Clock },
                      { label: 'Certificate of completion', icon: Award },
                      { label: `${totalLessons} lessons`, icon: BookOpen },
                      { label: course.duration + ' of content', icon: Play },
                      { label: 'Downloadable resources', icon: Globe },
                      { label: '24/7 support', icon: Shield }
                    ].map((f, i) => (
                      <div key={i} className="flex items-center space-x-3 text-sm text-gray-600">
                        <f.icon className="h-4 w-4 text-gray-400" />
                        <span>{f.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Guarantee */}
                  <div className="mt-5 bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                    <Shield className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <p className="text-sm font-semibold text-green-700">7-Day Money Back Guarantee</p>
                    <p className="text-xs text-green-600">Full refund if not satisfied</p>
                  </div>

                  {/* Trust */}
                  <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1"><Lock className="h-3 w-3" /><span>Secure</span></div>
                    <div className="flex items-center space-x-1"><Shield className="h-3 w-3" /><span>SSL</span></div>
                    <div className="flex items-center space-x-1"><CheckCircle className="h-3 w-3" /><span>Trusted</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Psychological Engagement Section — calming, below the course content */}
        {isFree && isSignedIn && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="mt-4">
              <PsychologicalEngagement userEmail={userEmail} isSignedIn={isSignedIn} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
