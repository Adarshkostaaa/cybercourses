export interface User {
  id: string;
  email: string;
  phone: string;
  username: string;
  full_name: string;
  is_admin: boolean;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  level: string;
  duration: string;
  drive_url: string;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  course_id: string;
  payment_status: 'pending' | 'approved' | 'rejected';
  amount_paid: number;
  coupon_used?: string;
  payment_screenshot?: string;
  created_at: string;
  approved_at?: string;
  user_email: string;
  user_phone: string;
  user_name: string;
  course_title: string;
  course_price: number;
  purchase_time?: string;
}

export interface CartItem {
  id: string;
  course: Course;
  quantity: number;
  added_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}
