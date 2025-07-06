/*
  # Create purchases table with proper structure

  1. New Tables
    - `purchases`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable for guest purchases)
      - `course_id` (text)
      - `payment_status` (text, default 'pending')
      - `amount_paid` (numeric)
      - `coupon_used` (text, optional)
      - `payment_screenshot` (text, optional)
      - `created_at` (timestamp)
      - `approved_at` (timestamp, optional)
      - `user_email` (text)
      - `user_phone` (text)
      - `user_name` (text)
      - `course_title` (text)
      - `course_price` (numeric)

  2. Security
    - Enable RLS on purchases table
    - Add policies for public access (no authentication required)
*/

-- Create purchases table if it doesn't exist
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

-- Drop any existing policies first
DROP POLICY IF EXISTS "Allow purchase creation" ON purchases;
DROP POLICY IF EXISTS "Allow purchase reading" ON purchases;
DROP POLICY IF EXISTS "Allow purchase updates" ON purchases;
DROP POLICY IF EXISTS "Allow purchase deletion" ON purchases;

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