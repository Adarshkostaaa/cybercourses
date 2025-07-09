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
    console.log('🔗 Testing Supabase connection...');
    
    // Test with a simple query and shorter timeout for faster fallback
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 3000)
    );
    
    // Try a simple health check query first
    let queryPromise = supabase
      .from('purchases')
      .select('count')
      .limit(1);
    
    console.log('📡 Testing database connection...');
    let result = await Promise.race([queryPromise, timeoutPromise]) as any;
    let { error } = result;
    
    if (error) {
      console.log('⚠️ Database connection test failed:', error.message);
      
      // Check if it's a table not found error
      if (error.message && error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log('❌ Database tables do not exist. Please run the migration scripts in Supabase.');
        console.log('📋 Check SUPABASE_SETUP_INSTRUCTIONS.md for setup instructions.');
      }
      
      return false;
    }
    
    console.log('✅ Supabase connection test successful');
    return true;
  } catch (error) {
    console.log('❌ Supabase connection test failed (using localStorage fallback):', error);
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
      library_users: {
        Row: {
          id: string;
          email: string;
          password: string;
          full_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password: string;
          full_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password?: string;
          full_name?: string;
          created_at?: string;
        };
      };
    };
  };
}
