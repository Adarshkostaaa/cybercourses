# 🚀 Supabase Database Setup Instructions

## ❌ Current Issue
Your application is showing these errors:
- `relation "public.purchases" does not exist`
- `relation "public.library_users" does not exist`

## ✅ Solution
You need to create these tables in your Supabase database by running the migration scripts.

## 📋 Step-by-Step Instructions

### Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: `ysdqmlydybmyibfmvhgg`

### Step 2: Open SQL Editor
1. In your project dashboard, click on **"SQL Editor"** in the left sidebar
2. Click **"New Query"** to create a new SQL script

### Step 3: Create the `purchases` table
Copy and paste this SQL script into the editor and click **"Run"**:

```sql
-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT NULL,
  course_id text NOT NULL,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'approved', 'rejected')),
  amount_paid numeric NOT NULL,
  coupon_used text,
  payment_screenshot text,
  created_at timestamptz DEFAULT now(),
  approved_at timestamptz,
  user_email text NOT NULL,
  user_phone text NOT NULL,
  user_name text NOT NULL,
  course_title text NOT NULL,
  course_price numeric NOT NULL
);

-- Enable Row Level Security
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Create policies that allow public access (no authentication required)
CREATE POLICY "Allow purchase creation"
  ON purchases
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow purchase reading"
  ON purchases
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow purchase updates"
  ON purchases
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Allow purchase deletion"
  ON purchases
  FOR DELETE
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_purchases_user_email ON purchases(user_email);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(payment_status);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON purchases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_purchases_course_id ON purchases(course_id);

-- Insert some sample data for testing
INSERT INTO purchases (
  user_email,
  user_phone,
  user_name,
  course_id,
  course_title,
  course_price,
  amount_paid,
  payment_status
) VALUES 
(
  'john@example.com',
  '+91 9876543210',
  'John Doe',
  '1',
  'Ethical Hacking Masterclass',
  699,
  699,
  'pending'
),
(
  'jane@example.com',
  '+91 9876543211',
  'Jane Smith',
  '2',
  'Adobe After Effects Masterclass',
  599,
  599,
  'approved'
)
ON CONFLICT (id) DO NOTHING;
```

### Step 4: Create the `library_users` table
Create another new query and run this SQL script:

```sql
-- Create library_users table
CREATE TABLE IF NOT EXISTS library_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE library_users ENABLE ROW LEVEL SECURITY;

-- Create policies that allow public access (no authentication required)
CREATE POLICY "Allow library user creation"
  ON library_users
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow library user reading"
  ON library_users
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow library user updates"
  ON library_users
  FOR UPDATE
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_library_users_email ON library_users(email);
CREATE INDEX IF NOT EXISTS idx_library_users_created_at ON library_users(created_at DESC);

-- Insert some sample data for testing
INSERT INTO library_users (
  email,
  password,
  full_name
) VALUES 
(
  'test@gmail.com',
  'test@gmail.com',
  'Test User'
),
(
  'demo@example.com',
  'demo123',
  'Demo User'
)
ON CONFLICT (email) DO NOTHING;
```

### Step 5: Verify Tables Were Created
Run this query to verify both tables exist:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('purchases', 'library_users');
```

You should see both `purchases` and `library_users` in the results.

## 🎉 After Setup
Once you've run both scripts successfully:
1. Refresh your application
2. The database errors should be resolved
3. Your app will now use Supabase for data storage with localStorage as fallback

## 🆘 Need Help?
If you encounter any issues:
1. Check the Supabase logs in the dashboard
2. Ensure your project URL and API key are correct in the `.env` file
3. Contact support at adarshkosta1@gmail.com

## 🔧 Technical Notes
- Tables use Row Level Security (RLS) with public access policies
- UUID primary keys are auto-generated
- Indexes are created for optimal performance
- Sample data is included for testing
