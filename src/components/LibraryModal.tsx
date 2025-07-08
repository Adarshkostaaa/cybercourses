import React, { useState, useEffect } from 'react';
import { X, BookOpen, Play, Clock, Star, Search, ExternalLink, Mail, User, Eye, EyeOff, LogOut, UserPlus, Lock, ArrowLeft } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);

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
    // Load all courses for specific user email from admin purchases
    const adminPurchases = JSON.parse(localStorage.getItem('admin_purchases') || '[]');
    
    // Also check recent purchases from checkout
    const recentPurchases = JSON.parse(localStorage.getItem('recent_purchases') || '[]');
    
    // Combine all purchases
    const allPurchases = [...adminPurchases, ...recentPurchases];
    
    // Filter courses for this specific user email
    const userCourses = allPurchases
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
        status: purchase.payment_status || 'pending',
        has_access: purchase.payment_status === 'approved'
      }));
    
    // Remove duplicates - keep only the latest status for each course
    const uniqueCourses = userCourses.reduce((acc: any[], current: any) => {
      const existingIndex = acc.findIndex(course => 
        course.course_id === current.course_id && 
        course.user_email === current.user_email
      );
      
      if (existingIndex >= 0) {
        const existing = acc[existingIndex];
        // Keep the approved one if one is approved, otherwise keep the most recent
        if (current.status === 'approved' || 
            (existing.status !== 'approved' && new Date(current.approved_at) > new Date(existing.approved_at))) {
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

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(course => 
        course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  };

  // 🚀 CLOUD-BASED AUTHENTICATION SYSTEM
  const handleSignUp = async () => {
    setAuthError('');
    setAuthSuccess('');
    setIsLoading(true);
    
    // Validation
    if (!fullName.trim()) {
      setAuthError('Please enter your full name');
      setIsLoading(false);
      return;
    }

    if (!emailInput.trim()) {
      setAuthError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    if (!emailInput.includes('@')) {
      setAuthError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setAuthError('Please enter a password');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setAuthError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const email = emailInput.toLowerCase().trim();
    
    console.log('🚀 STARTING CLOUD-BASED SIGNUP FOR:', email);
    
    try {
      // Create user data
      const userData = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: email,
        password: password,
        full_name: fullName.trim(),
        created_at: new Date().toISOString()
      };
      
      console.log('📝 User data created:', userData);
      
      // STEP 1: Try to store in Supabase database FIRST (cloud storage)
      let cloudStorageSuccess = false;
      try {
        console.log('☁️ Attempting cloud storage...');
        
        // Check if user already exists in database
        const { data: existingUser, error: checkError } = await supabase
          .from('library_users')
          .select('email')
          .eq('email', email)
          .single();
          
        if (existingUser) {
          setAuthError('An account with this email already exists. Please sign in instead.');
          setIsLoading(false);
          return;
        }
        
        // Insert new user into database
        const { data: insertedUser, error: insertError } = await supabase
          .from('library_users')
          .insert([{
            email: email,
            password: password,
            full_name: fullName.trim()
          }])
          .select()
          .single();
          
        if (insertError) {
          console.error('❌ Database insert failed:', insertError);
          throw insertError;
        }
        
        console.log('✅ Successfully stored in cloud database:', insertedUser);
        cloudStorageSuccess = true;
        
      } catch (dbError) {
        console.error('❌ Cloud storage failed:', dbError);
        console.log('📱 Falling back to localStorage...');
        
        // Check if user exists in localStorage
        const existingUsers = JSON.parse(localStorage.getItem('library_users') || '[]');
        const userExists = existingUsers.find((user: any) => user.email.toLowerCase() === email);
        
        if (userExists) {
          setAuthError('An account with this email already exists. Please sign in instead.');
          setIsLoading(false);
          return;
        }
      }
      
      // STEP 2: Store in localStorage as backup (always do this)
