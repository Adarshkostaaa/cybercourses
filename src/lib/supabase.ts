import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback to default values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ysdqmlydybmyibfmvhgg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzZHFtbHlkeWJteWliZm12aGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3ODI2ODcsImV4cCI6MjA2NzM1ODY4N30.7vpKK3LeliQnK54BH3i3SrIxXeBFHIR6e31wKGDba-E';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey
    }
  }
});

// Test database connection
export const testConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Use a simple query with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 5000)
    );
    
    const queryPromise = supabase
      .from('purchases')
      .select('id')
      .limit(1);
    
    const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
    
    if (error) {
      console.error('Connection test failed:', error);
      return false;
    }
    
    console.log('Connection test successful:', data);
    return true;
  } catch (error) {
    console.error('Connection test error (using fallback):', error);
    return false;
  }
};

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          phone: string | null;
          username: string;
          full_name: string | null;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          phone?: string | null;
          username: string;
          full_name?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          phone?: string | null;
          username?: string;
          full_name?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          payment_status: 'pending' | 'approved' | 'rejected';
          amount_paid: number;
          coupon_used: string | null;
          payment_screenshot: string | null;
          created_at: string;
          approved_at: string | null;
          user_email: string;
          user_phone: string;
          user_name: string;
          course_title: string;
          course_price: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          payment_status?: 'pending' | 'approved' | 'rejected';
          amount_paid: number;
          coupon_used?: string | null;
          payment_screenshot?: string | null;
          created_at?: string;
          approved_at?: string | null;
          user_email: string;
          user_phone: string;
          user_name: string;
          course_title: string;
          course_price: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          payment_status?: 'pending' | 'approved' | 'rejected';
          amount_paid?: number;
          coupon_used?: string | null;
          payment_screenshot?: string | null;
          created_at?: string;
          approved_at?: string | null;
          user_email?: string;
          user_phone?: string;
          user_name?: string;
          course_title?: string;
          course_price?: number;
        };
      };
    };
  };
}
