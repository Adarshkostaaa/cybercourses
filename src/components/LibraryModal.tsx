import React, { useState, useEffect } from 'react';
import { X, BookOpen, Play, Clock, Star, Search, ExternalLink, Mail, User, Eye, EyeOff, LogOut, UserPlus, Lock, ArrowLeft } from 'lucide-react';

interface LibraryEntry {
  id: string;
  purchase_id: string;
  user_email: string;
  user_name: string;
  course_id: string;
  course_title: string;
  amount_paid: number;
  approved_at: string;
  status: 'approved';
  has_access: boolean;
}

interface LibraryUser {
  id: string;
  email: string;
  password: string;
  full_name: string;
  created_at: string;
}

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn?: (email: string) => void;
}

const LibraryModal: React.FC<LibraryModalProps> = ({ isOpen, onClose, onSignIn }) => {
  const [approvedCourses, setApprovedCourses] = useState<LibraryEntry[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<LibraryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [currentView, setCurrentView] = useState<'signin' | 'signup'>('signin');
  
  // Form states
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Check if user is already signed in (from localStorage)
      const savedEmail = localStorage.getItem('library_user_email');
      const savedRemember = localStorage.getItem('library_remember_me');
      
      if (savedEmail && savedRemember === 'true') {
        setUserEmail(savedEmail);
        setIsSignedIn(true);
        loadUserCourses(savedEmail);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    filterCourses();
  }, [approvedCourses, searchTerm]);

  const loadUserCourses = (email: string) => {
    // Load all courses for specific user email (both approved and pending)
    const adminPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
    const userCourses = adminPurchases
      .filter((purchase: any) => 
        purchase.user_email.toLowerCase() === email.toLowerCase()
      )
      .map((purchase: any) => ({
        id: `approved_${purchase.id}`,
        purchase_id: purchase.id,
        user_email: purchase.user_email,
        user_name: purchase.user_name,
        course_id: purchase.course_id,
        course_title: purchase.course_title,
        amount_paid: purchase.amount_paid,
        approved_at: purchase.approved_at || purchase.created_at,
        status: purchase.payment_status,
        has_access: purchase.payment_status === 'approved'
      }));
    
    setApprovedCourses(userCourses);
  };

  const filterCourses = () => {
    let filtered = approvedCourses;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(course => 
        course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  };

  const handleSignUp = () => {
    setAuthError('');
    setAuthSuccess('');
    
    // Validation
    if (!fullName.trim()) {
      setAuthError('Please enter your full name');
      return;
    }

    if (!emailInput.trim()) {
      setAuthError('Please enter your email address');
      return;
    }

    if (!emailInput.includes('@')) {
      setAuthError('Please enter a valid email address');
      return;
    }

    if (!password.trim()) {
      setAuthError('Please enter a password');
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }

    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('library_users') || '[]');
    const userExists = existingUsers.find((user: LibraryUser) => 
      user.email.toLowerCase() === emailInput.toLowerCase()
    );

    if (userExists) {
      setAuthError('An account with this email already exists. Please sign in instead.');
      return;
    }

    // Create new user
    const newUser: LibraryUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: emailInput.toLowerCase(),
      password: password, // In production, this should be hashed
      full_name: fullName.trim(),
      created_at: new Date().toISOString()
    };

    // Save user to localStorage
    existingUsers.push(newUser);
    localStorage.setItem('library_users', JSON.stringify(existingUsers));

    setAuthSuccess('Account created successfully! You can now sign in.');
    
    // Clear form and switch to sign in
    setTimeout(() => {
      setCurrentView('signin');
      setEmailInput('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setAuthSuccess('');
      setAuthError('');
    }, 2000);
  };

  const handleSignIn = () => {
    setAuthError('');
    
    if (!emailInput.trim()) {
      setAuthError('Please enter your email address');
      return;
    }

    if (!emailInput.includes('@')) {
      setAuthError('Please enter a valid email address');
      return;
    }

    if (!password.trim()) {
      setAuthError('Please enter your password');
      return;
    }

    // Check if user exists and password matches
    const existingUsers = JSON.parse(localStorage.getItem('library_users') || '[]');
    const user = existingUsers.find((user: LibraryUser) => 
      user.email.toLowerCase() === emailInput.toLowerCase()
    );

    if (!user) {
      setAuthError('No account found with this email. Please sign up first.');
      return;
    }

    if (user.password !== password) {
      setAuthError('Incorrect password. Please try again.');
      return;
    }

    // Check if user has any courses (approved or pending)
    const adminPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
    const userCourses = adminPurchases.filter((purchase: any) => 
      purchase.user_email.toLowerCase() === emailInput.toLowerCase()
    );

    if (userCourses.length === 0) {
      setAuthError('No courses found for this account. Purchase a course first.');
      return;
    }

    // Sign in successful
    setUserEmail(emailInput);
    setIsSignedIn(true);
    loadUserCourses(emailInput);

    // Save to localStorage if remember me is checked
    if (rememberMe) {
      localStorage.setItem('library_user_email', emailInput);
      localStorage.setItem('library_remember_me', 'true');
    } else {
      // Clear localStorage if remember me is not checked
      localStorage.removeItem('library_user_email');
      localStorage.removeItem('library_remember_me');
    }

    // Notify parent component about sign in
    if (onSignIn) {
      onSignIn(emailInput);
    }

    // Clear form
    setEmailInput('');
    setPassword('');
    setAuthError('');
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setUserEmail('');
    setApprovedCourses([]);
    setFilteredCourses([]);
    setSearchTerm('');
    
    // Clear localStorage
    localStorage.removeItem('library_user_email');
    localStorage.removeItem('library_remember_me');
  };

  const handleAccessCourse = (courseId: string) => {
    // Import courses data to get drive URL
    import('../data/courses').then(({ courses }) => {
      const course = courses.find(c => c.id === courseId);
      if (course && course.drive_url) {
        window.open(course.drive_url, '_blank');
      } else {
        alert('Course content is not available yet. Please contact support.');
      }
    });
  };

  const getCourseImage = (courseId: string) => {
    const courseImages: { [key: string]: string } = {
      '1': 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
      '2': 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800',
      '3': 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
      '4': 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=800',
      '5': 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800'
    };
    return courseImages[courseId] || 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800';
  };

  const getCourseCategory = (courseId: string) => {
    const categoryMap: { [key: string]: string } = {
      '1': 'Cybersecurity',
      '2': 'Video Editing',
      '3': 'Programming',
      '4': 'Cybersecurity',
      '5': 'Digital Marketing'
    };
    return categoryMap[courseId] || 'Course';
  };

  const getCourseDuration = (courseId: string) => {
    const durationMap: { [key: string]: string } = {
      '1': '12 hours',
      '2': '10 hours',
      '3': '15 hours',
      '4': '14 hours',
      '5': '11 hours'
    };
    return durationMap[courseId] || '10 hours';
  };

  if (!isOpen) return null;

  // Authentication Forms (Sign Up / Sign In)
  if (!isSignedIn) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-black/90 border border-cyan-400/30 rounded-xl max-w-md w-full backdrop-blur-md">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-cyan-400/20 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-cyan-800/30 rounded-lg transition-colors duration-200 mr-2"
                  title="Back"
                >
                  <ArrowLeft className="h-5 w-5 text-cyan-400" />
                </button>
                <BookOpen className="h-6 w-6 text-cyan-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">
                  {currentView === 'signup' ? 'Create Account' : 'Access Library'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-cyan-800/30 rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300" />
              </button>
            </div>
          </div>

          {/* Auth Form */}
          <div className="p-4 sm:p-6">
            <div className="text-center mb-6">
              <div className="bg-cyan-600/20 border border-cyan-400/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                {currentView === 'signup' ? (
                  <UserPlus className="h-8 w-8 text-cyan-400" />
                ) : (
                  <BookOpen className="h-8 w-8 text-cyan-400" />
                )}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-mono">
                {currentView === 'signup' ? 'Create Your Account' : 'Sign In to Your Library'}
              </h3>
              <p className="text-gray-400 text-sm font-mono">
                {currentView === 'signup' 
                  ? 'Create an account to access your purchased courses'
                  : 'Sign in to access your approved courses'
                }
              </p>
            </div>

            {/* Success Message */}
            {authSuccess && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg mb-4 text-center text-sm font-mono">
                {authSuccess}
              </div>
            )}

            {/* Error Message */}
            {authError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-center text-sm font-mono">
                {authError}
              </div>
            )}

            <div className="space-y-4">
              {/* Full Name (Sign Up Only) */}
              {currentView === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-gray-500 font-mono text-sm"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-gray-500 font-mono text-sm"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-black/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-gray-500 font-mono text-sm"
                    placeholder={currentView === 'signup' ? 'Create a password (min 6 chars)' : 'Enter your password'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Sign Up Only) */}
              {currentView === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 font-mono">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-black/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-gray-500 font-mono text-sm"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Remember Me (Sign In Only) */}
              {currentView === 'signin' && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-cyan-400 bg-black/50 border border-cyan-400/30 rounded focus:ring-cyan-400 focus:ring-2"
                  />
                  <label htmlFor="rememberMe" className="text-sm text-gray-300 font-mono">
                    Remember me
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={currentView === 'signup' ? handleSignUp : handleSignIn}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-3 px-4 rounded-lg font-bold hover:from-cyan-700 hover:to-purple-700 transition-all duration-200 font-mono text-sm"
              >
                {currentView === 'signup' ? 'Create Account' : 'Access My Library'}
              </button>

              {/* Switch View */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setCurrentView(currentView === 'signup' ? 'signin' : 'signup');
                    setAuthError('');
                    setAuthSuccess('');
                    setEmailInput('');
                    setPassword('');
                    setConfirmPassword('');
                    setFullName('');
                  }}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-mono text-sm"
                >
                  {currentView === 'signup' 
                    ? 'Already have an account? Sign In' 
                    : "Don't have an account? Sign Up"
                  }
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-xs font-mono">
                {currentView === 'signup' 
                  ? 'After creating an account, purchase courses and wait for admin approval.'
                  : 'Need help accessing your courses?'
                }
              </p>
              <p className="text-gray-400 text-xs font-mono mt-2">
                Contact{' '}
                <a href="mailto:adarshkosta1@gmail.com" className="text-cyan-400 hover:text-cyan-300">
                  adarshkosta1@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Library Content (when signed in)
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/90 border border-cyan-400/30 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden backdrop-blur-md">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-cyan-400/20 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="p-2 hover:bg-cyan-800/30 rounded-lg transition-colors duration-200 mr-2"
                title="Back"
              >
                <ArrowLeft className="h-5 w-5 text-cyan-400" />
              </button>
              <BookOpen className="h-6 w-6 text-cyan-400" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">My Course Library</h2>
                <p className="text-sm text-gray-400 font-mono">Welcome back, {userEmail}</p>
              </div>
              <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm font-mono">
                {filteredCourses.filter(c => c.has_access).length} Available
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 bg-red-600/20 hover:bg-red-600/30 border border-red-400/30 text-red-400 px-3 py-2 rounded-lg transition-colors duration-200 font-mono text-sm"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-cyan-800/30 rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:p-6 border-b border-cyan-400/20 bg-black/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/50 border border-cyan-400/30 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-gray-500 font-mono text-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 font-mono">
                {approvedCourses.length === 0 ? "No Courses Yet" : "No Courses Found"}
              </h3>
              <p className="text-gray-400 font-mono text-sm sm:text-base">
                {approvedCourses.length === 0 
                  ? "No courses found for your email yet. Purchase a course first!"
                  : "No courses match your search criteria."
                }
              </p>
            </div>
          ) : (
            <div>
              {/* Course Stats */}
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-black/50 border border-green-400/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 font-mono">{filteredCourses.filter(c => c.has_access).length}</div>
                  <div className="text-sm text-gray-400 font-mono">Available</div>
                </div>
                <div className="bg-black/50 border border-cyan-400/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400 font-mono">{filteredCourses.filter(c => !c.has_access).length}</div>
                  <div className="text-sm text-gray-400 font-mono">Pending</div>
                </div>
                <div className="bg-black/50 border border-purple-400/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-cyan-400 font-mono">
                    {filteredCourses.length}
                  </div>
                  <div className="text-sm text-gray-400 font-mono">Total Courses</div>
                </div>
              </div>

              {/* Course Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredCourses.map((course) => (
                  <div 
                    key={course.id} 
                    className={`bg-black/50 border rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 group ${
                      course.has_access 
                        ? 'border-green-400/30 hover:border-green-400 cursor-pointer' 
                        : 'border-yellow-400/30 hover:border-yellow-400 cursor-default'
                    }`}
                    onClick={() => course.has_access && handleAccessCourse(course.course_id)}
                  >
                    <div className="relative">
                      <img 
                        src={getCourseImage(course.course_id)} 
                        alt={course.course_title}
                        className={`w-full h-32 sm:h-40 object-cover transition-transform duration-300 ${
                          course.has_access ? 'group-hover:scale-110' : 'opacity-75'
                        }`}
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          course.has_access 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {course.has_access ? '✅ APPROVED' : '⏳ PENDING'}
                        </span>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                          course.has_access 
                            ? 'bg-cyan-400/20 border-cyan-400/50 text-cyan-400' 
                            : 'bg-yellow-400/20 border-yellow-400/50 text-yellow-400'
                        }`}>
                          {course.has_access ? '🎓 READY' : '⏰ WAITING'}
                        </span>
                      </div>
                      {course.has_access && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="bg-green-600/80 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-all duration-200 flex items-center space-x-2 font-mono">
                            <Play className="h-4 w-4" />
                            <span>OPEN COURSE</span>
                            <ExternalLink className="h-4 w-4" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/30 px-2 py-1 rounded font-mono">
                          {getCourseCategory(course.course_id)}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-400 font-mono">4.8</span>
                        </div>
                      </div>
                      
                      <h3 className={`text-sm sm:text-base font-bold mb-2 line-clamp-2 font-mono leading-tight transition-colors duration-200 ${
                        course.has_access 
                          ? 'text-white group-hover:text-green-400' 
                          : 'text-gray-300'
                      }`}>
                        {course.course_title}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3 text-xs font-mono">
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Clock className="h-3 w-3 text-cyan-400" />
                          <span>{getCourseDuration(course.course_id)}</span>
                        </div>
                        <span className={`font-bold ${course.has_access ? 'text-green-400' : 'text-yellow-400'}`}>
                          ₹{course.amount_paid}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500 font-mono mb-3">
                        {course.has_access 
                          ? `Approved: ${new Date(course.approved_at).toLocaleDateString()}`
                          : `Purchased: ${new Date(course.approved_at).toLocaleDateString()}`
                        }
                      </div>
                      
                      <div className="space-y-2">
                        {course.has_access ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAccessCourse(course.course_id);
                            }}
                            className="w-full bg-gradient-to-r from-green-600 to-cyan-600 text-white py-2 px-3 rounded-lg font-bold hover:from-green-700 hover:to-cyan-700 transition-all duration-200 font-mono text-xs flex items-center justify-center space-x-2 hover:scale-105"
                          >
                            <Play className="h-3 w-3" />
                            <span>START LEARNING</span>
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full bg-yellow-600/20 border border-yellow-400/30 text-yellow-400 py-2 px-3 rounded-lg font-bold cursor-not-allowed font-mono text-xs flex items-center justify-center space-x-2"
                          >
                            <Clock className="h-3 w-3" />
                            <span>WAITING FOR APPROVAL</span>
                          </button>
                        )}
                        
                        <div className="text-center">
                          <span className={`text-xs font-mono ${
                            course.has_access 
                              ? 'text-green-400' 
                              : 'text-yellow-400'
                          }`}>
                            {course.has_access 
                              ? '🚀 Click to Access Course Content' 
                              : '⏳ Admin will approve your purchase soon'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-cyan-400/20 bg-black/50">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-4 text-xs font-mono">
              <span className="text-green-400">✅ {filteredCourses.filter(c => c.has_access).length} Available</span>
              <span className="text-yellow-400">⏳ {filteredCourses.filter(c => !c.has_access).length} Pending</span>
              <span className="text-cyan-400">🎓 Instant Access</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm font-mono">
              Signed in as: <span className="text-cyan-400">{userEmail}</span> • Need help? Contact{' '}
              <a href="mailto:adarshkosta1@gmail.com" className="text-cyan-400 hover:text-cyan-300">
                adarshkosta1@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryModal;
