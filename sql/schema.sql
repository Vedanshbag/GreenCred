-- Create users table, linked to Supabase auth
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) NOT NULL,
  username TEXT UNIQUE,
  wallet_address TEXT,
  green_cred_score INT DEFAULT 500 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activities table
CREATE TABLE public.activities (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  activity_type TEXT NOT NULL, -- e.g., 'driving_km', 'beef_kg'
  description TEXT NOT NULL, -- e.g., 'Drove a car', 'Ate a plant-based meal'
  value DECIMAL NOT NULL,
  co2_emissions DECIMAL NOT NULL, -- The calculated carbon footprint in kg CO2e
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create nfts table to store earned rewards
CREATE TABLE public.nfts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  nft_name TEXT NOT NULL,
  nft_description TEXT,
  image_url TEXT, -- Link to image (could be on IPFS or Supabase Storage)
  minted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to automatically create a user profile on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function when a new user is added to auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
