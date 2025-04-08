
-- Create a function to update user profile data safely
CREATE OR REPLACE FUNCTION public.update_user_profile(
  p_user_id UUID,
  p_full_name TEXT,
  p_phone_number TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET 
    full_name = p_full_name,
    phone_number = p_phone_number,
    updated_at = now()
  WHERE id = p_user_id;
  
  RETURN TRUE;
END;
$$;
