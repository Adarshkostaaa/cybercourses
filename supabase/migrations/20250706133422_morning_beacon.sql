/*
  # Create users and purchases tables

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `phone` (text)
      - `username` (text, unique)
      - `full_name` (text)
      - `is_admin` (boolean, default false)
      - `created_at` (timestamp)
    - `purchases`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
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
    - Enable RLS on both tables
    - Add policies for authenticated users to read/write their own data
    - Add admin policies for managing purchases
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  phone text,
  username text UNIQUE NOT NULL,
  full_name text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
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
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Purchases policies
CREATE POLICY "Users can read own purchases"
  ON purchases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create purchases"
  ON purchases
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can read all purchases"
  ON purchases
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

CREATE POLICY "Admins can update purchases"
  ON purchases
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(payment_status);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON purchases(created_at DESC);
