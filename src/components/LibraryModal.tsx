import { useState, useEffect } from 'react';
import { X, BookOpen, Play, Clock, Star, Search, ExternalLink, Mail, Eye, EyeOff, LogOut, UserPlus, Lock, ArrowLeft, User, Shield, CheckCircle, Sparkles } from 'lucide-react';
import { supabase, testConnection } from '../lib/supabase';

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
  username?: string;
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
  
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Check username availability
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    const timer = setTimeout(() => {
      setCheckingUsername(true);
      const normalizedUsername = username.toLowerCase().trim();
      const allUsers = JSON.parse(localStorage.getItem('library_users') || '[]');
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users_list') || '[]');
      const taken = allUsers.some((u: any) => u.username?.toLowerCase() === normalizedUsername) ||
        registeredUsers.some((u: any) => u.username?.toLowerCase() === normalizedUsername);
      setUsernameAvailable(!taken);
      setCheckingUsername(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  // Password strength checker
  useEffect(() => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [password]);

  useEffect(() => {
    if (isOpen) {
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
    const adminPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
    const recentPurchases = JSON.parse(localStorage.getItem('recent_purchases') || '[]');
    const allPurchases = [...adminPurchases, ...recentPurchases];
    const userCourses = allPurchases
      .filter((purchase: any) => purchase.user_email.toLowerCase() === email.toLowerCase())
      .map((purchase: any) => ({
        id: `approved_${purchase.id}`,
        purchase_id: purchase.id,
        user_email: purchase.user_email,
        user_name: purchase.user_name,
        course_id: purchase.course_id,
        course_title: purchase.course_title,
        amount_paid: purchase.amount_paid,
        approved_at: purchase.approved_at || purchase.created_at,
        status: purchase.payment_status || 'pending',
        has_access: purchase.payment_status === 'approved'
      }));
    const uniqueCourses = userCourses.reduce((acc: any[], current: any) => {
      const existingIndex = acc.findIndex((course: any) => 
        course.course_id === current.course_id && course.user_email === current.user_email
      );
      if (existingIndex >= 0) {
        const existing = acc[existingIndex];
        if (current.status === 'approved' || (existing.status !== 'approved' && new Date(current.approved_at) > new Date(existing.approved_at))) {
          acc[existingIndex] = current;
        }
      } else {
        acc.push(current);
      }
      return acc;
    }, []);
    setApprovedCourses(uniqueCourses);
  };

  const filterCourses = () => {
    let filtered = approvedCourses;
    if (searchTerm.trim()) {
      filtered = filtered.filter(course => course.course_title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredCourses(filtered);
  };

  const findUserAcrossAllSources = async (email: string): Promise<LibraryUser | null> => {
    const normalizedEmail = email.toLowerCase().trim();
    const existingUsers = JSON.parse(localStorage.getItem('library_users') || '[]');
    const localUser = existingUsers.find((user: LibraryUser) => user.email.toLowerCase() === normalizedEmail);
    if (localUser) return localUser;
    try {
      const connectionTest = await testConnection();
      if (!connectionTest) throw new Error('Connection failed');
      const timeoutPromise = new Promise<null>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000));
      const queryPromise = (async () => {
        const { data, error } = await supabase.from('library_users').select('*').eq('email', normalizedEmail).single();
        if (!error && data) return data;
        if (error?.message?.includes('relation') && error?.message?.includes('does not exist')) throw new Error('Table missing');
        const allResult = await supabase.from('library_users').select('*');
        if (!allResult.error && allResult.data) {
          return allResult.data.find((user: any) => user.email.toLowerCase() === normalizedEmail) || null;
        }
        return null;
      })();
      const cloudUser = await Promise.race([queryPromise, timeoutPromise]);
      if (cloudUser) {
        const updatedUsers = [...existingUsers, cloudUser];
        localStorage.setItem('library_users', JSON.stringify(updatedUsers));
        return cloudUser;
      }
    } catch { /* cloud search failed */ }
    const alternativeKeys = ['cybercourse_users', 'registered_users', 'user_accounts', 'library_accounts'];
    for (const key of alternativeKeys) {
      const altUsers = JSON.parse(localStorage.getItem(key) || '[]');
      const altUser = altUsers.find((user: any) => user.email?.toLowerCase() === normalizedEmail);
      if (altUser) return altUser;
    }
    try {
      const sessionUser = sessionStorage.getItem('current_library_user');
      if (sessionUser) {
        const parsedUser = JSON.parse(sessionUser);
        if (parsedUser.email?.toLowerCase() === normalizedEmail) return parsedUser;
      }
    } catch { /* session check failed */ }
    return null;
  };

  const storeUserAcrossAllSources = async (user: LibraryUser) => {
    const existingUsers = JSON.parse(localStorage.getItem('library_users') || '[]');
    const existingIndex = existingUsers.findIndex((u: LibraryUser) => u.email.toLowerCase() === user.email.toLowerCase());
    if (existingIndex >= 0) existingUsers[existingIndex] = user;
    else existingUsers.push(user);
    localStorage.setItem('library_users', JSON.stringify(existingUsers));

    // Save to registered_users for admin panel tracking
    const registeredUsers = JSON.parse(localStorage.getItem('registered_users_list') || '[]');
    const regIndex = registeredUsers.findIndex((u: any) => u.email.toLowerCase() === user.email.toLowerCase());
    if (regIndex < 0) {
      registeredUsers.push({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at,
        has_purchased: false,
        last_active: new Date().toISOString()
      });
      localStorage.setItem('registered_users_list', JSON.stringify(registeredUsers));
    }

    try {
      const connectionTest = await testConnection();
      if (!connectionTest) throw new Error('No connection');
      const timeoutPromise = new Promise<null>((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000));
      const insertPromise = supabase.from('library_users').insert([{ email: user.email, password: user.password, full_name: user.full_name }]).select().single();
      await Promise.race([insertPromise, timeoutPromise]);
    } catch { /* cloud storage failed */ }
    const backupKeys = ['cybercourse_users', 'registered_users', 'user_accounts', 'library_accounts'];
    backupKeys.forEach(key => {
      const backupUsers = JSON.parse(localStorage.getItem(key) || '[]');
      const bi = backupUsers.findIndex((u: any) => u.email?.toLowerCase() === user.email.toLowerCase());
      if (bi >= 0) backupUsers[bi] = user;
      else backupUsers.push(user);
      localStorage.setItem(key, JSON.stringify(backupUsers));
    });
    sessionStorage.setItem('current_library_user', JSON.stringify(user));
    sessionStorage.setItem('library_users_backup', JSON.stringify(existingUsers));
  };

  // Track user activity
  const trackActivity = (action: string, details?: string) => {
    const activities = JSON.parse(localStorage.getItem('user_activities') || '[]');
    activities.push({
      id: `act_${Date.now()}`,
      user_email: emailInput.toLowerCase().trim() || userEmail,
      action,
      details: details || '',
      timestamp: new Date().toISOString(),
      page: 'library'
    });
    // Keep last 500 activities
    if (activities.length > 500) activities.splice(0, activities.length - 500);
    localStorage.setItem('user_activities', JSON.stringify(activities));
  };

  // Record referral when someone signs up via referral link
  const recordReferral = (refCode: string, newUserEmail: string, newUserName: string) => {
    // Find the referral data matching the code
    const allKeys = Object.keys(localStorage);
    const referralKeys = allKeys.filter(k => k.startsWith('referral_'));
    for (const key of referralKeys) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        if (data.referralCode === refCode) {
          // Check if this user was already referred
          const alreadyReferred = data.referredUsers?.some((u: any) => u.email.toLowerCase() === newUserEmail.toLowerCase());
          if (!alreadyReferred) {
            data.referredUsers = data.referredUsers || [];
            data.referredUsers.push({
              email: newUserEmail,
              name: newUserName,
              signedUpAt: new Date().toISOString()
            });
            if (data.referredUsers.length >= 5) {
              data.unlocked = true;
            }
            localStorage.setItem(key, JSON.stringify(data));
          }
          break;
        }
      } catch { /* skip invalid entries */ }
    }
  };

  const handleSignUp = async () => {
    setAuthError('');
    setAuthSuccess('');
    setIsLoading(true);
    try {
      if (!fullName.trim()) { setAuthError('Please enter your full name'); return; }
      if (!username.trim() || username.length < 3) { setAuthError('Username must be at least 3 characters'); return; }
      if (usernameAvailable === false) { setAuthError('This username is already taken. Please choose another.'); return; }
      if (!emailInput.trim()) { setAuthError('Please enter your email address'); return; }
      if (!emailInput.includes('@')) { setAuthError('Please enter a valid email address'); return; }
      if (!password.trim()) { setAuthError('Please enter a password'); return; }
      if (password.length < 6) { setAuthError('Password must be at least 6 characters long'); return; }
      if (password !== confirmPassword) { setAuthError('Passwords do not match'); return; }
      const email = emailInput.toLowerCase().trim();
      setAuthSuccess('Checking if account already exists...');
      const existingUser = await findUserAcrossAllSources(email);
      if (existingUser) { setAuthError('An account with this email already exists. Please sign in instead.'); setAuthSuccess(''); return; }
      setAuthSuccess('Creating your account...');
      await new Promise(resolve => setTimeout(resolve, 300));
      const newUser: LibraryUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email, password, full_name: fullName.trim(), created_at: new Date().toISOString(),
        username: username.toLowerCase().trim()
      } as any;
      await storeUserAcrossAllSources(newUser);

      // Also store username in registered_users_list
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users_list') || '[]');
      const regIndex = registeredUsers.findIndex((u: any) => u.email.toLowerCase() === email);
      if (regIndex >= 0) {
        registeredUsers[regIndex].username = username.toLowerCase().trim();
      }
      localStorage.setItem('registered_users_list', JSON.stringify(registeredUsers));

      // Check and record referral
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');
      if (refCode) {
        recordReferral(refCode, email, fullName.trim());
      }

      trackActivity('signup', `New account created: ${fullName.trim()} (@${username})`);
      setAuthSuccess('Account created successfully! You can now sign in.');
      setTimeout(() => {
        setCurrentView('signin');
        setEmailInput(''); setPassword(''); setConfirmPassword(''); setFullName(''); setUsername('');
        setAuthSuccess(''); setAuthError('');
      }, 2000);
    } catch {
      setAuthError('An error occurred during signup. Please try again.');
      setAuthSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setAuthError('');
    setAuthSuccess('');
    setIsLoading(true);
    try {
      if (!emailInput.trim()) { setAuthError('Please enter your email address'); return; }
      if (!emailInput.includes('@')) { setAuthError('Please enter a valid email address'); return; }
      if (!password.trim()) { setAuthError('Please enter your password'); return; }
      const email = emailInput.toLowerCase().trim();
      setAuthSuccess('Searching for your account...');
      await new Promise(resolve => setTimeout(resolve, 500));
      const user = await findUserAcrossAllSources(email);
      if (!user) { setAuthError('No account found with this email. Please sign up first.'); setAuthSuccess(''); return; }
      setAuthSuccess('Verifying password...');
      await new Promise(resolve => setTimeout(resolve, 200));
      if (user.password !== password) { setAuthError('Incorrect password. Please try again.'); setAuthSuccess(''); return; }
      setAuthSuccess('Sign in successful!');
      setUserEmail(email);
      setIsSignedIn(true);
      loadUserCourses(email);
      localStorage.setItem('library_user_email', email);
      localStorage.setItem('library_remember_me', 'true');
      trackActivity('signin', `User signed in`);

      // Update registered user last_active
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users_list') || '[]');
      const ri = registeredUsers.findIndex((u: any) => u.email.toLowerCase() === email);
      if (ri >= 0) {
        registeredUsers[ri].last_active = new Date().toISOString();
        localStorage.setItem('registered_users_list', JSON.stringify(registeredUsers));
      }

      if (onSignIn) onSignIn(email);
      setEmailInput(''); setPassword(''); setAuthSuccess('');
    } catch {
      setAuthError('An error occurred during sign in. Please try again.');
      setAuthSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    trackActivity('signout', `User signed out`);
    setIsSignedIn(false);
    setUserEmail('');
    setApprovedCourses([]);
    setFilteredCourses([]);
    setSearchTerm('');
    localStorage.removeItem('library_user_email');
    localStorage.removeItem('library_remember_me');
  };

  const handleAccessCourse = (courseId: string) => {
    trackActivity('access_course', `Accessed course ID: ${courseId}`);
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
      '1': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop',
      '2': 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=250&fit=crop',
      '3': 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop',
      '4': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop',
      '5': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop'
    };
    return courseImages[courseId] || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop';
  };

  if (!isOpen) return null;

  // ============ AUTH FORM (Sign In / Sign Up) ============
  if (!isSignedIn) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4">
        <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl overflow-hidden animate-fade-in-up max-h-[95vh] overflow-y-auto scroll-smooth-ios">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Back">
                <ArrowLeft className="h-5 w-5 text-gray-500" />
              </button>
              <BookOpen className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-bold text-gray-900 font-heading">
                {currentView === 'signup' ? 'Create Account' : 'Access Library'}
              </h2>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                {currentView === 'signup' ? <UserPlus className="h-8 w-8 text-primary-600" /> : <BookOpen className="h-8 w-8 text-primary-600" />}
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-heading mb-1">
                {currentView === 'signup' ? 'Create Your Account' : 'Sign In to Your Library'}
              </h3>
              <p className="text-sm text-gray-500">
                {currentView === 'signup' ? 'Sign up to access your courses from any device' : 'Sign in to access your courses from any device'}
              </p>
            </div>

            {authSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-center text-sm flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4" /> {authSuccess}
              </div>
            )}
            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-center text-sm">
                {authError}
              </div>
            )}

            <div className="space-y-4">
              {currentView === 'signup' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
                      placeholder="Enter your full name" disabled={isLoading} />
                  </div>
                </div>
              )}
              {currentView === 'signup' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">@</span>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                      className={`w-full pl-8 pr-10 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 text-sm transition-all ${
                        username.length >= 3 
                          ? usernameAvailable === true ? 'border-green-300 focus:ring-green-500 focus:border-green-500' 
                            : usernameAvailable === false ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-200 focus:ring-primary-500 focus:border-primary-500'
                          : 'border-gray-200 focus:ring-primary-500 focus:border-primary-500'
                      }`}
                      placeholder="choose_a_username" disabled={isLoading} maxLength={20} />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {checkingUsername && (
                        <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-availability-check" />
                      )}
                      {!checkingUsername && username.length >= 3 && usernameAvailable === true && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {!checkingUsername && username.length >= 3 && usernameAvailable === false && (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  {username.length >= 3 && !checkingUsername && (
                    <p className={`text-xs mt-1 font-medium ${usernameAvailable ? 'text-green-600' : 'text-red-500'}`}>
                      {usernameAvailable ? '✓ Username is available!' : '✗ Username is already taken'}
                    </p>
                  )}
                  {username.length > 0 && username.length < 3 && (
                    <p className="text-xs mt-1 text-gray-400">Minimum 3 characters</p>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
                    placeholder="Enter your email address" disabled={isLoading} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
                    placeholder="Enter your password" disabled={isLoading} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors" disabled={isLoading}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {currentView === 'signup' && password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          i <= passwordStrength
                            ? passwordStrength <= 2 ? 'bg-red-400' : passwordStrength <= 3 ? 'bg-yellow-400' : 'bg-green-400'
                            : 'bg-gray-200'
                        }`} />
                      ))}
                    </div>
                    <p className={`text-xs font-medium ${
                      passwordStrength <= 2 ? 'text-red-500' : passwordStrength <= 3 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {passwordStrength <= 1 ? 'Weak' : passwordStrength <= 2 ? 'Fair' : passwordStrength <= 3 ? 'Good' : passwordStrength <= 4 ? 'Strong' : 'Very Strong'}
                    </p>
                  </div>
                )}
              </div>
              {currentView === 'signup' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
                      placeholder="Confirm your password" disabled={isLoading} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors" disabled={isLoading}>
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Trust Badge */}
              <div className="bg-primary-50 border border-primary-100 rounded-xl p-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary-600 flex-shrink-0" />
                <span className="text-primary-700 text-sm font-medium">
                  Auto-Remember: You'll stay signed in across all your devices
                </span>
              </div>

              <button onClick={currentView === 'signup' ? handleSignUp : handleSignIn} disabled={isLoading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-btn hover:shadow-lg flex items-center justify-center gap-2">
                {isLoading ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{currentView === 'signup' ? 'Creating Account...' : 'Signing In...'}</span></>
                ) : (
                  <><Sparkles className="h-4 w-4" />
                  <span>{currentView === 'signup' ? 'Create Account' : 'Access My Library'}</span></>
                )}
              </button>

              <div className="text-center">
                <button onClick={() => { setCurrentView(currentView === 'signup' ? 'signin' : 'signup'); setAuthError(''); setAuthSuccess(''); setEmailInput(''); setPassword(''); setConfirmPassword(''); setFullName(''); setUsername(''); setUsernameAvailable(null); }}
                  className="text-primary-600 hover:text-primary-700 transition-colors text-sm font-medium" disabled={isLoading}>
                  {currentView === 'signup' ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 text-center">
              <p className="text-gray-400 text-xs">
                Need help? Contact{' '}
                <a href="mailto:adarshkosta1@gmail.com" className="text-primary-600 hover:text-primary-700 font-medium">adarshkosta1@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ LIBRARY CONTENT (Signed In) ============
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={onClose} className="p-1.5 hover:bg-white/60 rounded-lg transition-colors" title="Back">
                <ArrowLeft className="h-5 w-5 text-primary-600" />
              </button>
              <BookOpen className="h-5 w-5 text-primary-600" />
              <div>
                <h2 className="text-lg font-bold text-gray-900 font-heading">My Course Library</h2>
                <p className="text-xs text-gray-500">Welcome back, {userEmail}</p>
              </div>
              <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                {filteredCourses.filter(c => c.has_access).length} Available
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={handleSignOut}
                className="flex items-center space-x-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium">
                <LogOut className="h-3.5 w-3.5" /><span>Sign Out</span>
              </button>
              <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search your courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-14 w-14 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2 font-heading">
                {approvedCourses.length === 0 ? 'No Purchases Yet' : 'No Courses Found'}
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {approvedCourses.length === 0 ? "You haven't purchased any courses yet. Browse and purchase courses to see them here!" : 'No courses match your search.'}
              </p>
              {approvedCourses.length === 0 && (
                <button onClick={onClose}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-btn text-sm">
                  Browse Courses
                </button>
              )}
            </div>
          ) : (
            <div>
              {/* Stats */}
              <div className="mb-6 grid grid-cols-3 gap-3">
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">{filteredCourses.filter(c => c.has_access).length}</div>
                  <div className="text-xs text-green-600 font-medium">Available</div>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-amber-600">{filteredCourses.filter(c => !c.has_access).length}</div>
                  <div className="text-xs text-amber-600 font-medium">Pending</div>
                </div>
                <div className="bg-primary-50 border border-primary-100 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-primary-600">{filteredCourses.length}</div>
                  <div className="text-xs text-primary-600 font-medium">Total</div>
                </div>
              </div>

              {/* Course Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map((course) => (
                  <div key={course.id}
                    className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 hover:shadow-card group ${
                      course.has_access ? 'border-green-200 cursor-pointer' : 'border-amber-200 cursor-default'
                    }`}
                    onClick={() => course.has_access && handleAccessCourse(course.course_id)}>
                    <div className="relative">
                      <img src={getCourseImage(course.course_id)} alt={course.course_title}
                        className={`w-full h-36 object-cover transition-transform duration-300 ${course.has_access ? 'group-hover:scale-105' : 'opacity-80'}`} />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          course.has_access ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {course.has_access ? '✅ Approved' : '⏳ Pending'}
                        </span>
                      </div>
                      {course.has_access && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="bg-white text-primary-600 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg">
                            <Play className="h-4 w-4" /> Open Course <ExternalLink className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className={`text-sm font-bold mb-2 line-clamp-2 leading-tight transition-colors ${
                        course.has_access ? 'text-gray-900 group-hover:text-primary-600' : 'text-gray-600'}`}>
                        {course.course_title}
                      </h3>
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>Course</span>
                        </div>
                        <span className={`font-bold ${course.has_access ? 'text-green-600' : 'text-amber-600'}`}>₹{course.amount_paid}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span>4.8 • {course.has_access ? `Approved ${new Date(course.approved_at).toLocaleDateString()}` : 'Awaiting approval'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <span className="text-green-600 font-medium">✅ {filteredCourses.filter(c => c.has_access).length} Available</span>
              <span className="text-amber-600 font-medium">⏳ {filteredCourses.filter(c => !c.has_access).length} Pending</span>
            </div>
            <span>Signed in as <span className="text-primary-600 font-medium">{userEmail}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryModal;
