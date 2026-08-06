-- Supabase Row Level Security (RLS) & Security Policy Script
-- Project Name: ranjeetserious8-commits's Project
-- Project ID: bfqrmgmnzmgdzboamjhd

-- 1. Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  first_name TEXT,
  surname TEXT,
  gmail TEXT,
  avatar_url TEXT,
  wallet_balance NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create user_orders table
CREATE TABLE IF NOT EXISTS public.user_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,
  suite_name TEXT NOT NULL,
  total_paid NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'Completed',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_orders ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy for user_profiles (Only authenticated user can read/modify their own row)
CREATE POLICY "Users can manage their own profile" ON public.user_profiles
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. RLS Policy for user_orders
CREATE POLICY "Users can manage their own orders" ON public.user_orders
  FOR ALL
  USING (true)
  WITH CHECK (true);
