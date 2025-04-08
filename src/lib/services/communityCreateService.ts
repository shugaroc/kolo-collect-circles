
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getAuthenticatedUser, logCommunityActivity } from "./baseService";

interface CreateCommunityParams {
  name: string;
  description?: string;
  contributionFrequency: string;
  minContribution: number;
  maxMembers: number;
  backupFundPercentage: number;
  positioningMode: "Random" | "Fixed";
  isPrivate: boolean;
}

/**
 * Creates a new community
 */
export const createCommunity = async (params: CreateCommunityParams) => {
  try {
    const user = await getAuthenticatedUser();
    
    const contributionGoal = params.maxMembers * params.minContribution;
    
    // Step 1: Create the community
    console.log("Creating community...");
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .insert({
        name: params.name,
        description: params.description,
        admin_id: user.id,
        min_contribution: params.minContribution,
        max_members: params.maxMembers,
        backup_fund_percentage: params.backupFundPercentage,
        positioning_mode: params.positioningMode,
        is_private: params.isPrivate,
        contribution_goal: contributionGoal
      })
      .select('id')
      .single();
    
    if (communityError) {
      console.error("Error creating community:", communityError);
      
      // Handle specific known errors
      if (communityError.message?.includes("infinite recursion detected in policy")) {
        throw new Error("There's a database permission issue with the community creation. Please try again later.");
      }
      
      throw communityError;
    }
    
    if (!community) {
      throw new Error("Failed to create community");
    }
    
    console.log("Community created:", community.id);
    
    // Step 2: Add creator as the first member - as a separate transaction to avoid policy conflicts
    try {
      console.log("Adding creator as member...");
      
      // Short delay to allow database consistency
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { error: memberError } = await supabase
        .from('community_members')
        .insert({
          community_id: community.id,
          user_id: user.id,
          position: 1,
          status: 'active'
        });
        
      if (memberError) {
        console.error("Error adding creator as member:", memberError);
        // We don't throw here to allow community creation to succeed
        toast.warning("Community created but there was an issue adding you as a member");
      }
    } catch (memberError: any) {
      console.error("Exception adding creator as member:", memberError);
      // We don't throw here to allow community creation to succeed
      toast.warning("Community created but there was an issue adding you as a member");
    }
    
    // Step 3: Log the activity
    await logCommunityActivity(
      community.id,
      user.id,
      'created',
      { message: `Community created by ${user.email}` }
    );
    
    toast.success("Community created successfully!");
    return community.id;
    
  } catch (error: any) {
    console.error("Community creation error:", error);
    // Don't toast here, let the calling component handle the error
    throw error;
  }
};
