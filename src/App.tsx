import { useState, useMemo, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
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
import SocialProofSection from './components/SocialProofSection';
import WhatYouLearnSection from './components/WhatYouLearnSection';
import InstructorSection from './components/InstructorSection';
import PricingSection from './components/PricingSection';
import GuaranteeSection from './components/GuaranteeSection';
import SocialProofPopup from './components/SocialProofPopup';
import ScrollProgress from './components/ScrollProgress';
import MobileBottomNav from './components/MobileBottomNav';
import { courses } from './data/courses';
import { Course } from './types';
import { useCart } from './contexts/CartContext';

// ─── Course Details Page (reads slug from URL) ──────────────────
function CourseDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [libraryUserEmail, setLibraryUserEmail] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  const course = courses.find(c => c.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!course) {
    return <Navigate to="/" replace />;
  }

  const handleEnroll = (c: Course) => {
    const savedEmail = localStorage.getItem('library_user_email');
    const savedRemember = localStorage.getItem('library_remember_me');
    if (savedEmail && savedRemember === 'true') {
      setLibraryUserEmail(savedEmail);
      setSelectedCourse(c);
      setIsCheckoutModalOpen(true);
    } else {
      localStorage.setItem('pending_course_purchase', JSON.stringify(c));
      setIsLibraryModalOpen(true);
    }
  };

  const handleCartCheckout = (coursesToCheckout: Course[]) => {
    const savedEmail = localStorage.getItem('library_user_email');
    const savedRemember = localStorage.getItem('library_remember_me');
    if (savedEmail && savedRemember === 'true') {
      setLibraryUserEmail(savedEmail);
      setSelectedCourses(coursesToCheckout);
      setIsCheckoutModalOpen(true);
    } else {
      localStorage.setItem('pending_cart_purchase', JSON.stringify(coursesToCheckout));
      setIsLibraryModalOpen(true);
    }
  };

  const handleLibrarySignIn = (email: string) => {
    setLibraryUserEmail(email);
    const pendingCourse = localStorage.getItem('pending_course_purchase');
    const pendingCart = localStorage.getItem('pending_cart_purchase');
    if (pendingCourse) {
      const c = JSON.parse(pendingCourse);
      setSelectedCourse(c);
      setIsCheckoutModalOpen(true);
      localStorage.removeItem('pending_course_purchase');
    } else if (pendingCart) {
      const cs = JSON.parse(pendingCart);
      setSelectedCourses(cs);
      setIsCheckoutModalOpen(true);
      localStorage.removeItem('pending_cart_purchase');
    }
    setIsLibraryModalOpen(false);
  };

  const handleLibraryClick = () => {
    const savedEmail = localStorage.getItem('library_user_email');
    const savedRemember = localStorage.getItem('library_remember_me');
    if (savedEmail && savedRemember === 'true') {
      setLibraryUserEmail(savedEmail);
    }
    setIsLibraryModalOpen(true);
  };

  // Track activity
  const trackActivity = (action: string, details?: string) => {
    const activities = JSON.parse(localStorage.getItem('user_activities') || '[]');
    const userEmail = localStorage.getItem('library_user_email') || 'anonymous';
    activities.push({
      id: `act_${Date.now()}`,
      user_email: userEmail,
      action,
      details: details || '',
      timestamp: new Date().toISOString(),
      page: 'course-details'
    });
    if (activities.length > 500) activities.splice(0, activities.length - 500);
    localStorage.setItem('user_activities', JSON.stringify(activities));
  };

  useEffect(() => {
    trackActivity('view_course', `Viewed: ${course.title}`);
  }, [course.title]);

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <Header
        onSearchChange={() => {}}
        onCategoryChange={(cat) => navigate(cat === 'All' ? '/' : `/?category=${encodeURIComponent(cat)}`)}
        onAdminClick={() => navigate('/admin')}
        onCartClick={() => setIsCartModalOpen(true)}
        onLibraryClick={handleLibraryClick}
      />
      <CourseDetails
        course={course}
        onBack={() => navigate('/')}
        onEnroll={handleEnroll}
        onSignInRequired={() => setIsLibraryModalOpen(true)}
      />

      <MobileBottomNav
        onHomeClick={() => navigate('/')}
        onSearchClick={() => navigate('/')}
        onCartClick={() => setIsCartModalOpen(true)}
        onLibraryClick={handleLibraryClick}
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
        onClose={() => {
          setIsCheckoutModalOpen(false);
          setSelectedCourse(null);
          setSelectedCourses([]);
          setLibraryUserEmail('');
        }}
        course={selectedCourse || undefined}
        courses={selectedCourses.length > 0 ? selectedCourses : undefined}
        userEmail={libraryUserEmail}
      />
    </div>
  );
}

// ─── Admin Login Page ───────────────────────────────────────────
function AdminLoginPage() {
  const navigate = useNavigate();

  const handleAdminLogin = (username: string, password: string) => {
    if (username === 'adarshkosta' && password === 'Adarshkosta@@1212') {
      localStorage.setItem('admin_logged_in', 'true');
      navigate('/admin');
      return true;
    }
    return false;
  };

  return <AdminLogin onLogin={handleAdminLogin} onBack={() => navigate('/')} />;
}

// ─── Admin Panel Page ───────────────────────────────────────────
function AdminPanelPage() {
  const navigate = useNavigate();
  const isAdminLoggedIn = localStorage.getItem('admin_logged_in') === 'true';

  if (!isAdminLoggedIn) {
    return <Navigate to="/login/admin" replace />;
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_remember_me');
    localStorage.removeItem('admin_username');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-700 transition-colors font-medium text-sm"
          >
            ← Back to Home
          </button>
          <button
            onClick={handleAdminLogout}
            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
      <AdminPanel />
    </div>
  );
}

// ─── Home / Courses Page ────────────────────────────────────────
function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [libraryUserEmail, setLibraryUserEmail] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const { addToCart } = useCart();

  // Read category from URL query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }

    // Check for referral code
    const refCode = params.get('ref');
    if (refCode) {
      localStorage.setItem('pending_referral_code', refCode);
    }
  }, [location.search]);

  // Check for saved library user
  useEffect(() => {
    const savedEmail = localStorage.getItem('library_user_email');
    const savedRemember = localStorage.getItem('library_remember_me');
    if (savedEmail && savedRemember === 'true') {
      setLibraryUserEmail(savedEmail);
    }
  }, []);

  // Track activity
  const trackActivity = (action: string, details?: string) => {
    const activities = JSON.parse(localStorage.getItem('user_activities') || '[]');
    const userEmail = localStorage.getItem('library_user_email') || 'anonymous';
    activities.push({
      id: `act_${Date.now()}`,
      user_email: userEmail,
      action,
      details: details || '',
      timestamp: new Date().toISOString(),
      page: 'home'
    });
    if (activities.length > 500) activities.splice(0, activities.length - 500);
    localStorage.setItem('user_activities', JSON.stringify(activities));
  };

  useEffect(() => {
    trackActivity('page_visit', 'User visited the site');
  }, []);

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
    const savedEmail = localStorage.getItem('library_user_email');
    const savedRemember = localStorage.getItem('library_remember_me');
    if (savedEmail && savedRemember === 'true') {
      setLibraryUserEmail(savedEmail);
      setSelectedCourse(course);
      setIsCheckoutModalOpen(true);
    } else {
      localStorage.setItem('pending_course_purchase', JSON.stringify(course));
      setIsLibraryModalOpen(true);
    }
  };

  const handleAddToCart = (course: Course) => {
    addToCart(course);
    trackActivity('add_to_cart', `Added: ${course.title} (₹${course.price})`);
  };

  const handleCartCheckout = (coursesToCheckout: Course[]) => {
    const savedEmail = localStorage.getItem('library_user_email');
    const savedRemember = localStorage.getItem('library_remember_me');
    if (savedEmail && savedRemember === 'true') {
      setLibraryUserEmail(savedEmail);
      setSelectedCourses(coursesToCheckout);
      setIsCheckoutModalOpen(true);
    } else {
      localStorage.setItem('pending_cart_purchase', JSON.stringify(coursesToCheckout));
      setIsLibraryModalOpen(true);
    }
  };

  const handleViewCourse = (course: Course) => {
    trackActivity('view_course', `Viewed: ${course.title}`);
    navigate(`/course/${course.slug}`);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      navigate('/', { replace: true });
    } else {
      navigate(`/?category=${encodeURIComponent(category)}`, { replace: true });
    }
  };

  const handleLibraryClick = () => {
    const savedEmail = localStorage.getItem('library_user_email');
    const savedRemember = localStorage.getItem('library_remember_me');
    if (savedEmail && savedRemember === 'true') {
      setLibraryUserEmail(savedEmail);
    }
    setIsLibraryModalOpen(true);
  };

  const handleLibrarySignIn = (email: string) => {
    setLibraryUserEmail(email);
    const pendingCourse = localStorage.getItem('pending_course_purchase');
    const pendingCart = localStorage.getItem('pending_cart_purchase');
    if (pendingCourse) {
      const course = JSON.parse(pendingCourse);
      setSelectedCourse(course);
      setIsCheckoutModalOpen(true);
      localStorage.removeItem('pending_course_purchase');
    } else if (pendingCart) {
      const cs = JSON.parse(pendingCart);
      setSelectedCourses(cs);
      setIsCheckoutModalOpen(true);
      localStorage.removeItem('pending_cart_purchase');
    }
    setIsLibraryModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <ScrollProgress />
      <Header
        onSearchChange={(s) => setSearchTerm(s)}
        onCategoryChange={handleCategoryChange}
        onAdminClick={() => navigate('/admin')}
        onCartClick={() => setIsCartModalOpen(true)}
        onLibraryClick={handleLibraryClick}
      />

      <HeroSection onExploreCourses={() => {
        const coursesSection = document.querySelector('main');
        if (coursesSection) coursesSection.scrollIntoView({ behavior: 'smooth' });
      }} />

      <SocialProofSection />
      <WhatYouLearnSection />

      {/* Courses Section */}
      <main className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              📚 Browse Courses
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900 mb-4">
              {selectedCategory === 'All'
                ? `Explore Our ${filteredCourses.length} Professional Courses`
                : `${selectedCategory} Courses (${filteredCourses.length})`
              }
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {searchTerm
                ? `Search results for "${searchTerm}"`
                : 'Choose from our comprehensive collection of expert-led, industry-relevant courses'
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
            <div className="text-center py-12">
              <div className="text-gray-300 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-heading">No courses found</h3>
              <p className="text-gray-500">
                Try adjusting your search or category filter to find more courses.
              </p>
            </div>
          )}
        </div>
      </main>

      <InstructorSection />

      <PricingSection onExploreCourses={() => {
        const coursesSection = document.querySelector('main');
        if (coursesSection) coursesSection.scrollIntoView({ behavior: 'smooth' });
      }} />

      <GuaranteeSection onExploreCourses={() => {
        const coursesSection = document.querySelector('main');
        if (coursesSection) coursesSection.scrollIntoView({ behavior: 'smooth' });
      }} />

      <Footer />

      <MobileBottomNav
        onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onSearchClick={() => {
          const coursesSection = document.querySelector('main');
          if (coursesSection) coursesSection.scrollIntoView({ behavior: 'smooth' });
        }}
        onCartClick={() => setIsCartModalOpen(true)}
        onLibraryClick={handleLibraryClick}
      />

      <SocialProofPopup />

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
        onClose={() => {
          setIsCheckoutModalOpen(false);
          setSelectedCourse(null);
          setSelectedCourses([]);
          setLibraryUserEmail('');
        }}
        course={selectedCourse || undefined}
        courses={selectedCourses.length > 0 ? selectedCourses : undefined}
        userEmail={libraryUserEmail}
      />
    </div>
  );
}

// ─── App with Routes ────────────────────────────────────────────
function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/courses" element={<HomePage />} />
      <Route path="/course/:slug" element={<CourseDetailsPage />} />
      <Route path="/admin" element={<AdminPanelPage />} />
      <Route path="/login/admin" element={<AdminLoginPage />} />
      <Route path="/login" element={<HomePage />} />
      <Route path="/signup" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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
