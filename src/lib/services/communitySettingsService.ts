
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getAuthenticatedUser, logCommunityActivity } from "./baseService";

interface UpdateCommunityParams {
  id: string;
  description?: string;
  minContribution?: number;
  maxMembers?: number;
  backupFundPercentage?: number;
  positioningMode?: "Random" | "Fixed";
  isPrivate?: boolean;
}

/**
 * Allows community admin to update settings
 */
export const updateCommunitySettings = async (params: UpdateCommunityParams) => {
  try {
    const user = await getAuthenticatedUser();
    
    // Step 1: Check admin status
    console.log("Checking admin status...");
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select('admin_id')
      .eq('id', params.id)
      .single();
    
    if (communityError) {
      console.error("Error checking admin status:", communityError);
      throw communityError;
    }
    
    if (!community) {
      throw new Error("Community not found");
    }
    
    if (community.admin_id !== user.id) {
      throw new Error("Only the community admin can update settings");
    }
    
    // Step 2: Prepare update data
    const updateData: Record<string, any> = {};
    if (params.description !== undefined) updateData.description = params.description;
    if (params.minContribution !== undefined) updateData.min_contribution = params.minContribution;
    if (params.maxMembers !== undefined) updateData.max_members = params.maxMembers;
    if (params.backupFundPercentage !== undefined) updateData.backup_fund_percentage = params.backupFundPercentage;
    if (params.positioningMode !== undefined) updateData.positioning_mode = params.positioningMode;
    if (params.isPrivate !== undefined) updateData.is_private = params.isPrivate;
    
    // Step 3: Update community
    console.log("Updating community settings...");
    const { error: updateError } = await supabase
      .from('communities')
      .update(updateData)
      .eq('id', params.id);
      
    if (updateError) {
      console.error("Error updating community:", updateError);
      throw updateError;
    }
    
    // Step 4: Log the activity
    await logCommunityActivity(
      params.id,
      user.id,
      'settings_updated',
      { changes: updateData }
    );
    
    toast.success("Community settings updated successfully!");
    return true;
    
  } catch (error: any) {
    console.error("Error updating community settings:", error);
    toast.error(`Error updating community settings: ${error.message}`);
    throw error;
  }
};
