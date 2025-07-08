import React, { useState, useMemo, useEffect } from 'react';
import { CartProvider } from './contexts/CartContext';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CourseCard from './components/CourseCard';
import CourseDetails from './components/CourseDetails';
import CheckoutModal from './components/CheckoutModal';
import CartModal from './components/CartModal';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import Footer from './components/Footer';
import LibraryModal from './components/LibraryModal';
import { courses } from './data/courses';
import { Course } from './types';
import { useCart } from './contexts/CartContext';

function AppContent() {
  const [showLanding, setShowLanding] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [libraryUserEmail, setLibraryUserEmail] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'course-details'>('home');
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);

  // Check for saved admin login on component mount
  useEffect(() => {
    const savedAdminLogin = localStorage.getItem('admin_logged_in');
    const adminRememberMe = localStorage.getItem('admin_remember_me');
    
    if (savedAdminLogin === 'true' && adminRememberMe === 'true') {
      setIsAdminLoggedIn(true);
    }
    
    // Check for saved library user login
    const savedLibraryEmail = localStorage.getItem('library_user_email');
    const libraryRememberMe = localStorage.getItem('library_remember_me');
    
    if (savedLibraryEmail && libraryRememberMe === 'true') {
      // User is already signed in to library
      setLibraryUserEmail(savedLibraryEmail);
    }
  }, []);

  const { addToCart } = useCart();

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleEnroll = (course: Course) => {
    // Check if user is signed in to library
    const savedEmail = localStorage.getItem('library_user_email');
    const savedRemember = localStorage.getItem('library_remember_me');
    
    if (savedEmail && savedRemember === 'true') {
      // User is signed in, proceed to checkout
      setLibraryUserEmail(savedEmail);
      setSelectedCourse(course);
      setIsCheckoutModalOpen(true);
    } else {
      // User not signed in, open library modal for sign in
      // Store the course they want to purchase for after sign in
      localStorage.setItem('pending_course_purchase', JSON.stringify(course));
      setIsLibraryModalOpen(true);
    }
  };

  const handleAddToCart = (course: Course) => {
    addToCart(course);
  };

  const handleCartCheckout = (coursesToCheckout: Course[]) => {
    // Check if user is signed in to library
    const savedEmail = localStorage.getItem('library_user_email');
    const savedRemember = localStorage.getItem('library_remember_me');
    
    if (savedEmail && savedRemember === 'true') {
      // User is signed in, proceed to checkout
      setLibraryUserEmail(savedEmail);
      setSelectedCourses(coursesToCheckout);
      setIsCheckoutModalOpen(true);
    } else {
      // User not signed in, open library modal for sign in
      // Store the courses they want to purchase for after sign in
      localStorage.setItem('pending_cart_purchase', JSON.stringify(coursesToCheckout));
      setIsLibraryModalOpen(true);
    }
  };

  const handleViewCourse = (course: Course) => {
    setViewingCourse(course);
    setCurrentView('course-details');
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAdminLogin = (username: string, password: string) => {
    if (username === 'adarshkosta' && password === 'Adarshkosta@@1212') {
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
      setCurrentView('admin');
      
      // Save login state
      localStorage.setItem('admin_logged_in', 'true');
      return true;
    }
    return false;
  };

  const handleAdminAccess = () => {
    if (isAdminLoggedIn) {
      setCurrentView('admin');
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentView('home');
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_remember_me');
    localStorage.removeItem('admin_username');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setViewingCourse(null);
  };

  const handleEnterSite = () => {
    setShowLanding(false);
  };

  const handleLibraryClick = () => {
    // Check if user is already signed in
    const savedEmail = localStorage.getItem('library_user_email');
    const savedRemember = localStorage.getItem('library_remember_me');
    
    if (savedEmail && savedRemember === 'true') {
      // User is already signed in, open library directly
      setLibraryUserEmail(savedEmail);
      setIsLibraryModalOpen(true);
    } else {
      // User not signed in, open library modal for sign in
      setIsLibraryModalOpen(true);
    }
  };

  const handleLibrarySignIn = (email: string) => {
    setLibraryUserEmail(email);
    
    // Check if there was a pending course purchase
    const pendingCourse = localStorage.getItem('pending_course_purchase');
    const pendingCart = localStorage.getItem('pending_cart_purchase');
    
    if (pendingCourse) {
      // User was trying to buy a single course
      const course = JSON.parse(pendingCourse);
      setSelectedCourse(course);
      setIsCheckoutModalOpen(true);
      localStorage.removeItem('pending_course_purchase');
    } else if (pendingCart) {
      // User was trying to checkout cart
      const courses = JSON.parse(pendingCart);
      setSelectedCourses(courses);
      setIsCheckoutModalOpen(true);
      localStorage.removeItem('pending_cart_purchase');
    }
    
    setIsLibraryModalOpen(false);
  };

  if (showLanding) {
    return <LandingPage onEnter={handleEnterSite} />;
  }

  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} onBack={() => setShowAdminLogin(false)} />;
  }

  if (currentView === 'admin' && isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-black">
        <div className="bg-black/80 backdrop-blur-sm border-b border-cyan-400/20 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToHome}
              className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-mono"
            >
              ← Back to Home
            </button>
            <button
              onClick={handleAdminLogout}
              className="bg-red-600/20 hover:bg-red-600/30 border border-red-400/30 text-red-400 px-4 py-2 rounded-lg transition-colors duration-200 font-mono text-sm"
            >
              Logout
            </button>
          </div>
        </div>
        <AdminPanel onLogout={handleAdminLogout} />
      </div>
    );
  }

  if (currentView === 'course-details' && viewingCourse) {
    return (
      <div className="min-h-screen bg-black">
        <Header 
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onAdminClick={handleAdminAccess}
          onCartClick={() => setIsCartModalOpen(true)}
          onLibraryClick={handleLibraryClick}
        />
        <CourseDetails 
          course={viewingCourse}
          onBack={handleBackToHome}
          onEnroll={handleEnroll}
        />
        
        <CartModal 
          isOpen={isCartModalOpen}
          onClose={() => setIsCartModalOpen(false)}
          onCheckout={handleCartCheckout}
        />

        <LibraryModal 
          isOpen={isLibraryModalOpen}
          onClose={() => setIsLibraryModalOpen(false)}
          onSignIn={handleLibrarySignIn}
        />

        <CheckoutModal 
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          course={selectedCourse}
          courses={selectedCourses.length > 0 ? selectedCourses : undefined}
          userEmail={libraryUserEmail}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
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
      
      <Header 
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onAdminClick={handleAdminAccess}
        onCartClick={() => setIsCartModalOpen(true)}
        onLibraryClick={handleLibraryClick}
      />
      
      <HeroSection onExploreCourses={() => {
        const coursesSection = document.querySelector('main');
        if (coursesSection) {
          coursesSection.scrollIntoView({ behavior: 'smooth' });
        }
      }} />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 font-mono">
            {selectedCategory === 'All' 
              ? `All Courses (${filteredCourses.length})` 
              : `${selectedCategory} Courses (${filteredCourses.length})`
            }
          </h2>
          <p className="text-gray-400 font-mono text-sm sm:text-base">
            {searchTerm 
              ? `Search results for "${searchTerm}"` 
              : 'Discover our comprehensive collection of 120+ professional courses'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCourses.map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onEnroll={handleEnroll}
              onViewDetails={handleViewCourse}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 text-4xl sm:text-6xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 font-mono">No courses found</h3>
            <p className="text-gray-400 font-mono text-sm sm:text-base">
              Try adjusting your search or category filter to find more courses.
            </p>
          </div>
        )}
      </main>

      <Footer />

      <CartModal 
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        onCheckout={handleCartCheckout}
      />

      <LibraryModal 
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
      />

      <CheckoutModal 
        isOpen={isCheckoutModalOpen}
        onClose={() => {
          setIsCheckoutModalOpen(false);
          setSelectedCourse(null);
          setSelectedCourses([]);
          setLibraryUserEmail('');
        }}
        course={selectedCourse}
        courses={selectedCourses.length > 0 ? selectedCourses : undefined}
        userEmail={libraryUserEmail}
      />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
