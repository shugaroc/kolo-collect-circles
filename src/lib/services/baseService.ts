
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Common functions and utilities used across services
export const getAuthenticatedUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error("Authentication error:", error);
    throw new Error("Authentication failed: " + error.message);
  }
  
  if (!user) {
    throw new Error("You must be logged in to perform this action");
  }
  
  return user;
};

// Log activity to the community_activity_logs table
export const logCommunityActivity = async (communityId: string, userId: string, action: string, details: any) => {
  try {
    await supabase
      .from('community_activity_logs')
      .insert({
        community_id: communityId,
        user_id: userId,
        action: action,
        details: details
      });
  } catch (error) {
    console.error("Error logging activity:", error);
    // Non-critical error, continue with operation
  }
};

// Generic error handler for service operations
export const handleServiceError = (error: any, customMessage?: string) => {
  const message = customMessage || "Operation failed";
  console.error(`${message}:`, error);
  
  // Pass the error up to be handled by the caller
  throw error;
};
