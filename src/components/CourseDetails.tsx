import React, { useState } from 'react';
import { ArrowLeft, Star, Clock, Users, Shield, Play, Download, CheckCircle, Heart, Share2, BookOpen, Award, Globe, ShoppingCart, Zap, Lock, Eye, ChevronRight, Plus, Minus } from 'lucide-react';
import { Course } from '../types';

interface CourseDetailsProps {
  course: Course;
  onBack: () => void;
  onEnroll: (course: Course) => void;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ course, onBack, onEnroll }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'instructor', label: 'Instructor' },
    { id: 'reviews', label: 'Reviews' }
  ];

  const courseImages = [
    course.image_url,
    'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  const curriculum = [
    { 
      title: 'Introduction to Cybersecurity', 
      duration: '45 min', 
      lessons: 5, 
      locked: false,
      topics: ['What is Cybersecurity?', 'Types of Cyber Threats', 'Security Fundamentals', 'Industry Overview', 'Career Paths']
    },
    { 
      title: 'Network Security Fundamentals', 
      duration: '1.2 hrs', 
      lessons: 8, 
      locked: false,
      topics: ['Network Protocols', 'Firewalls & IDS', 'VPN Technologies', 'Network Monitoring']
    },
    { 
      title: 'Penetration Testing Basics', 
      duration: '2.1 hrs', 
      lessons: 12, 
      locked: true,
      topics: ['Reconnaissance', 'Scanning & Enumeration', 'Vulnerability Assessment', 'Exploitation Techniques']
    },
    { 
      title: 'Advanced Hacking Techniques', 
      duration: '3.5 hrs', 
      lessons: 15, 
      locked: true,
      topics: ['Web Application Testing', 'Wireless Security', 'Social Engineering', 'Advanced Exploitation']
    },
    { 
      title: 'Security Tools & Frameworks', 
      duration: '2.8 hrs', 
      lessons: 10, 
      locked: true,
      topics: ['Metasploit Framework', 'Nmap & Nessus', 'Burp Suite', 'Custom Tool Development']
    },
    { 
      title: 'Real-world Case Studies', 
      duration: '1.5 hrs', 
      lessons: 6, 
      locked: true,
      topics: ['Corporate Breach Analysis', 'Incident Response', 'Forensic Investigation', 'Report Writing']
    }
  ];

  const features = [
    'Lifetime Access',
    'Certificate of Completion',
    '24/7 Support',
    'Mobile & Desktop Access',
    'Downloadable Resources',
    'Community Access'
  ];

  const reviews = [
    { name: 'Alex Kumar', rating: 5, comment: 'Excellent course! Very detailed and practical. The instructor explains complex concepts in a simple way.', date: '2 days ago', verified: true },
    { name: 'Sarah Chen', rating: 5, comment: 'Best cybersecurity course I have taken. Highly recommended! Great hands-on exercises.', date: '1 week ago', verified: true },
    { name: 'Mike Johnson', rating: 4, comment: 'Great content, could use more hands-on labs. Overall very satisfied with the course quality.', date: '2 weeks ago', verified: true },
    { name: 'Priya Sharma', rating: 5, comment: 'Amazing course structure and content. Worth every penny!', date: '3 weeks ago', verified: true }
  ];

  const relatedCourses = [
    { id: '2', title: 'Network Security Fundamentals', price: 549, image: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: '3', title: 'Web Application Security', price: 649, image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: '4', title: 'Python for Hackers', price: 599, image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=300' }
  ];

  const handleEnrollClick = () => {
    onEnroll(course);
  };

  const toggleSection = (index: number) => {
    setExpandedSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cyberpunk Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-purple-900/10 to-pink-900/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-mono bg-black/50 border border-cyan-400/30 px-4 py-2 rounded-lg hover:border-cyan-400 hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Courses</span>
          </button>
        </div>

        {/* Product Layout - Similar to Amazon/Flipkart */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column - Images */}
            <div className="lg:col-span-5">
              {/* Breadcrumb */}
              <div className="text-sm text-gray-400 mb-4 font-mono">
                <span>Home</span> <span className="text-cyan-400 mx-1">{'>'}</span> 
                <span>{course.category}</span> <span className="text-cyan-400 mx-1">{'>'}</span> 
                <span className="text-white">{course.title}</span>
              </div>

              {/* Main Image */}
              <div className="mb-4">
                <div className="relative bg-black/50 border border-cyan-400/30 rounded-xl overflow-hidden">
                  <img 
                    src={courseImages[selectedImage]} 
                    alt={course.title}
                    className="w-full h-80 md:h-96 object-cover"
                  />
                  <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      BESTSELLER
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      LIMITED TIME
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors duration-200"
                    >
                      <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current text-red-400' : 'text-white'}`} />
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-cyan-600/80 hover:bg-cyan-600 text-white p-4 rounded-full transition-all duration-200 hover:scale-110">
                      <Play className="h-8 w-8" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="flex space-x-2 overflow-x-auto mb-6">
                {courseImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index 
                        ? 'border-cyan-400' 
                        : 'border-gray-600 hover:border-cyan-400/50'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`Course view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mb-6">
                <button
                  onClick={handleEnrollClick}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-mono flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>BUY NOW</span>
                </button>
                <button className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-3 px-6 rounded-lg font-bold hover:from-cyan-700 hover:to-purple-700 transition-all duration-200 font-mono flex items-center justify-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>TRY FREE</span>
                </button>
              </div>

              {/* Course Features */}
              <div className="bg-black/50 border border-cyan-400/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 font-mono">What's Included</h3>
                <div className="grid grid-cols-1 gap-3">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-center space-x-3 p-2 bg-black/30 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 font-mono">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Column - Course Info */}
            <div className="lg:col-span-4">
              {/* Course Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 font-mono leading-tight">{course.title}</h1>

              {/* Rating and Stats */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1 bg-green-600 px-2 py-1 rounded">
                  <span className="text-white font-bold text-sm">4.8</span>
                  <Star className="h-4 w-4 text-white fill-current" />
                </div>
                <span className="text-gray-400 font-mono">(2,847 ratings & 42,368 reviews)</span>
              </div>

              {/* Price Section */}
              <div className="mb-6 p-4 bg-black/50 border border-cyan-400/20 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-3xl font-bold text-cyan-400 font-mono">₹{course.price}</span>
                  <span className="text-lg text-gray-500 line-through font-mono">₹{Math.floor(course.price * 1.8)}</span>
                  <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
                    {Math.round(((Math.floor(course.price * 1.8) - course.price) / Math.floor(course.price * 1.8)) * 100)}% off
                  </span>
                </div>
                <div className="text-green-400 text-sm font-mono">You save ₹{Math.floor(course.price * 0.8)}!</div>
                <div className="text-red-400 text-sm font-mono mt-1">⏰ Hurry, Only 6 left!</div>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-black/50 border border-cyan-400/20 rounded-lg">
                  <Users className="h-6 w-6 text-purple-400 mx-auto mb-1" />
                  <div className="text-sm text-gray-400 font-mono">Students</div>
                  <div className="font-bold text-white font-mono">12,543</div>
                </div>
                <div className="text-center p-3 bg-black/50 border border-cyan-400/20 rounded-lg">
                  <Clock className="h-6 w-6 text-cyan-400 mx-auto mb-1" />
                  <div className="text-sm text-gray-400 font-mono">Duration</div>
                  <div className="font-bold text-white font-mono">{course.duration}</div>
                </div>
                <div className="text-center p-3 bg-black/50 border border-cyan-400/20 rounded-lg">
                  <Award className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
                  <div className="text-sm text-gray-400 font-mono">Level</div>
                  <div className="font-bold text-white font-mono">{course.level}</div>
                </div>
              </div>

              {/* Course Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 px-3 py-1 rounded-full text-sm font-mono">
                  {course.category}
                </span>
                <span className="bg-purple-400/10 border border-purple-400/30 text-purple-400 px-3 py-1 rounded-full text-sm font-mono">
                  {course.level}
                </span>
                <span className="bg-green-400/10 border border-green-400/30 text-green-400 px-3 py-1 rounded-full text-sm font-mono">
                  Certificate
                </span>
                <span className="bg-pink-400/10 border border-pink-400/30 text-pink-400 px-3 py-1 rounded-full text-sm font-mono">
                  Lifetime Access
                </span>
              </div>

              {/* Available Offers */}
              <div className="mb-6 bg-black/50 border border-cyan-400/20 rounded-lg p-4">
                <h3 className="font-bold text-white mb-3 font-mono">Available offers</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-300 font-mono">Bank Offer: 5% cashback on Flipkart Axis Bank Credit Card up to ₹4,000</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-300 font-mono">Special Price: Get extra 22% off (price inclusive of cashback/coupon)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-300 font-mono">No Cost EMI: Avail No Cost EMI on select cards for orders above ₹3000</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-3 font-mono">Course Description</h3>
                <p className="text-gray-300 leading-relaxed font-mono mb-3">{course.description}</p>
                <p className="text-gray-300 leading-relaxed font-mono">
                  This comprehensive course covers everything from basic security concepts to advanced penetration testing techniques. 
                  You'll learn hands-on skills using real-world scenarios and industry-standard tools.
                </p>
              </div>

              {/* Instructor Info */}
              <div className="bg-black/50 border border-cyan-400/20 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-white mb-3 font-mono">Instructor</h3>
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=60&h=60"
                    alt="Instructor"
                    className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400"
                  />
                  <div>
                    <h4 className="font-bold text-white font-mono">Adarsh Kosta</h4>
                    <p className="text-cyan-400 text-sm font-mono">Cybersecurity Expert</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-400 font-mono">
                      <span>4.9 ⭐</span>
                      <span>•</span>
                      <span>25K+ students</span>
                      <span>•</span>
                      <span>8 years exp</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Purchase Card */}
            <div className="lg:col-span-3">
              <div className="sticky top-24">
                <div className="bg-black/80 border border-cyan-400/30 rounded-xl p-6 backdrop-blur-sm">
                  {/* Delivery Info */}
                  <div className="mb-4 p-3 bg-black/50 border border-green-400/30 rounded-lg">
                    <div className="text-green-400 font-bold text-sm font-mono mb-1">Instant Access</div>
                    <div className="text-gray-300 text-xs font-mono">Get immediate access after purchase</div>
                  </div>

                  {/* Purchase Options */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 p-3 border border-cyan-400/30 rounded-lg">
                      <input type="radio" name="purchase" defaultChecked className="text-cyan-400" />
                      <div className="flex-1">
                        <div className="font-bold text-white font-mono">Buy Course</div>
                        <div className="text-cyan-400 font-bold font-mono">₹{course.price}</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 mb-6">
                    <button
                      onClick={handleEnrollClick}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-mono"
                    >
                      BUY NOW
                    </button>
                  </div>

                  {/* Course Stats */}
                  <div className="border-t border-cyan-400/20 pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-mono">Students Enrolled</span>
                      <span className="text-white font-mono">12,543</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-mono">Course Duration</span>
                      <span className="text-white font-mono">{course.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-mono">Last Updated</span>
                      <span className="text-white font-mono">Dec 2024</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-mono">Language</span>
                      <span className="text-white font-mono">English</span>
                    </div>
                  </div>

                  {/* Money Back Guarantee */}
                  <div className="mt-4 bg-green-600/20 border border-green-400/30 rounded-lg p-3 text-center">
                    <div className="text-green-400 font-bold text-sm font-mono">30-Day Money Back Guarantee</div>
                    <div className="text-green-300 text-xs font-mono">Full refund if not satisfied</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-12">
            <div className="border-b border-cyan-400/20 mb-6">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm font-mono transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-cyan-400 text-cyan-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {activeTab === 'curriculum' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4 font-mono">Course Curriculum</h3>
                    {curriculum.map((section, i) => (
                      <div key={i} className="bg-black/50 border border-cyan-400/20 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleSection(i)}
                          className="w-full p-4 flex items-center justify-between hover:bg-cyan-400/5 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <BookOpen className="h-5 w-5 text-cyan-400" />
                            <div className="text-left">
                              <h4 className="font-medium text-white font-mono">{section.title}</h4>
                              <p className="text-sm text-gray-400 font-mono">{section.lessons} lessons • {section.duration}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {section.locked ? (
                              <Lock className="h-4 w-4 text-yellow-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-green-400" />
                            )}
                            {expandedSections.includes(i) ? (
                              <Minus className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Plus className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </button>
                        
                        {expandedSections.includes(i) && (
                          <div className="px-4 pb-4 border-t border-cyan-400/10">
                            <div className="space-y-2 mt-3">
                              {section.topics?.map((topic, j) => (
                                <div key={j} className="flex items-center space-x-3 p-2 hover:bg-cyan-400/5 rounded">
                                  <Play className="h-4 w-4 text-cyan-400" />
                                  <span className="text-gray-300 font-mono text-sm">{topic}</span>
                                  {section.locked && j > 1 && (
                                    <Lock className="h-3 w-3 text-yellow-400 ml-auto" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white font-mono">Student Reviews</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-white font-mono">4.8 out of 5</span>
                      </div>
                    </div>
                    
                    {reviews.map((review, i) => (
                      <div key={i} className="bg-black/50 border border-cyan-400/20 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center text-black font-bold">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-white font-mono">{review.name}</h4>
                                {review.verified && (
                                  <span className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded font-mono">Verified</span>
                                )}
                              </div>
                              <div className="flex items-center space-x-1">
                                {[...Array(review.rating)].map((_, j) => (
                                  <Star key={j} className="h-4 w-4 text-yellow-400 fill-current" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-400 font-mono">{review.date}</span>
                        </div>
                        <p className="text-gray-300 font-mono leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 font-mono">Course Overview</h3>
                      <p className="text-gray-300 leading-relaxed font-mono mb-4">
                        This comprehensive cybersecurity course is designed to take you from beginner to advanced level in ethical hacking and penetration testing. 
                        You'll learn practical skills that are immediately applicable in real-world scenarios.
                      </p>
                      <p className="text-gray-300 leading-relaxed font-mono">
                        The course includes hands-on labs, real-world case studies, and industry-standard tools. By the end of this course, 
                        you'll have the skills and knowledge needed to pursue a career in cybersecurity or enhance your existing technical skills.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 font-mono">What You'll Learn</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {[
                          'Master ethical hacking fundamentals and methodologies',
                          'Learn penetration testing techniques and tools',
                          'Understand network security protocols and vulnerabilities',
                          'Use professional security tools like Metasploit, Nmap, Burp Suite',
                          'Identify and exploit common web application vulnerabilities',
                          'Create comprehensive security assessment reports'
                        ].map((item, i) => (
                          <div key={i} className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300 font-mono text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 font-mono">Prerequisites</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300 font-mono">Basic computer knowledge</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300 font-mono">Familiarity with networking concepts (helpful but not required)</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300 font-mono">Willingness to learn and practice</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'instructor' && (
                  <div className="bg-black/50 border border-cyan-400/20 rounded-lg p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <img 
                        src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100"
                        alt="Instructor"
                        className="w-20 h-20 rounded-full object-cover border-2 border-cyan-400"
                      />
                      <div>
                        <h3 className="text-2xl font-bold text-white font-mono">Adarsh Kosta</h3>
                        <p className="text-cyan-400 font-mono text-lg">Cybersecurity Expert & Ethical Hacker</p>
                        <p className="text-gray-400 font-mono">Certified Ethical Hacker (CEH) | CISSP | OSCP</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-6 font-mono leading-relaxed">
                      With over 8 years of experience in cybersecurity, Adarsh has helped hundreds of organizations 
                      secure their digital infrastructure. He holds multiple industry certifications and has trained 
                      thousands of students worldwide. His practical approach to teaching makes complex security 
                      concepts easy to understand and implement.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="bg-black/50 border border-cyan-400/20 rounded-lg p-4">
                        <div className="text-2xl font-bold text-cyan-400 font-mono">50+</div>
                        <div className="text-sm text-gray-400 font-mono">Courses</div>
                      </div>
                      <div className="bg-black/50 border border-purple-400/20 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-400 font-mono">25K+</div>
                        <div className="text-sm text-gray-400 font-mono">Students</div>
                      </div>
                      <div className="bg-black/50 border border-pink-400/20 rounded-lg p-4">
                        <div className="text-2xl font-bold text-pink-400 font-mono">4.9</div>
                        <div className="text-sm text-gray-400 font-mono">Rating</div>
                      </div>
                      <div className="bg-black/50 border border-green-400/20 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-400 font-mono">8</div>
                        <div className="text-sm text-gray-400 font-mono">Years Exp</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Related Courses Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-black/50 border border-cyan-400/20 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 font-mono">Related Courses</h3>
                  <div className="space-y-4">
                    {relatedCourses.map((relatedCourse) => (
                      <div key={relatedCourse.id} className="border border-cyan-400/20 rounded-lg p-3 hover:border-cyan-400/40 transition-colors duration-200 cursor-pointer">
                        <img 
                          src={relatedCourse.image} 
                          alt={relatedCourse.title}
                          className="w-full h-24 object-cover rounded-lg mb-2"
                        />
                        <h4 className="font-medium text-white text-sm font-mono mb-1">{relatedCourse.title}</h4>
                        <div className="text-cyan-400 font-bold text-sm font-mono">₹{relatedCourse.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;