
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getAuthenticatedUser, logCommunityActivity } from "./baseService";

interface JoinCommunityParams {
  communityId: string;
}

/**
 * Allows a user to join an existing community
 */
export const joinCommunity = async (params: JoinCommunityParams) => {
  try {
    const user = await getAuthenticatedUser();
    
    // Step 1: Get community details
    console.log("Fetching community details...");
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select('member_count, max_members, first_cycle_min, status, id')
      .eq('id', params.communityId)
      .single();
    
    if (communityError) {
      console.error("Error fetching community:", communityError);
      throw communityError;
    }
    
    if (!community) {
      throw new Error("Community not found");
    }
    
    // Step 2: Check capacity
    if (community.member_count >= community.max_members) {
      throw new Error("This community has reached its maximum member capacity");
    }
    
    // Step 3: Check if already a member
    console.log("Checking existing membership...");
    const { data: existingMember, error: memberCheckError } = await supabase
      .from('community_members')
      .select('id')
      .eq('community_id', params.communityId)
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (memberCheckError) {
      console.error("Error checking membership:", memberCheckError);
      throw memberCheckError;
    }
    
    if (existingMember) {
      throw new Error("You are already a member of this community");
    }
    
    // Step 4: Determine position
    console.log("Determining position...");
    const { data: lastPosition, error: positionError } = await supabase
      .from('community_members')
      .select('position')
      .eq('community_id', params.communityId)
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (positionError) {
      console.error("Error getting last position:", positionError);
      throw positionError;
    }
    
    const nextPosition = lastPosition ? lastPosition.position + 1 : 1;
    
    // Step 5: Add member
    console.log("Adding member...");
    const { error: joinError } = await supabase
      .from('community_members')
      .insert({
        community_id: params.communityId,
        user_id: user.id,
        position: nextPosition,
        status: 'active'
      });
      
    if (joinError) {
      console.error("Error joining community:", joinError);
      throw joinError;
    }
    
    // Step 6: Update community member count
    console.log("Updating community member count...");
    const { error: updateError } = await supabase
      .from('communities')
      .update({ 
        member_count: community.member_count + 1,
      })
      .eq('id', params.communityId);
      
    if (updateError) {
      console.error("Error updating member count:", updateError);
      throw updateError;
    }
    
    // Step 7: Check if community should be activated
    if (community.member_count + 1 >= community.first_cycle_min && community.status === 'Locked') {
      console.log("Activating community...");
      await activateCommunity(params.communityId);
    }
    
    // Step 8: Log the activity
    await logCommunityActivity(
      params.communityId,
      user.id,
      'joined',
      { message: `${user.email} joined the community` }
    );
    
    toast.success("You have successfully joined the community!");
    return true;
    
  } catch (error: any) {
    console.error("Error joining community:", error);
    toast.error(`Error joining community: ${error.message}`);
    throw error;
  }
};

/**
 * Helper to activate a community and create its first cycle
 */
const activateCommunity = async (communityId: string) => {
  try {
    const { error: activateError } = await supabase
      .from('communities')
      .update({ status: 'Active' })
      .eq('id', communityId);
      
    if (activateError) {
      console.error("Error activating community:", activateError);
      return false;
    }
    
    // Create first cycle if activation was successful
    const { error: cycleError } = await supabase
      .from('community_cycles')
      .insert({
        community_id: communityId,
        cycle_number: 1,
        start_date: new Date().toISOString()
      });
      
    if (cycleError) {
      console.error("Error creating cycle:", cycleError);
      return false;
    }
    
    return true;
  } catch (activationError) {
    console.error("Exception activating community:", activationError);
    return false;
  }
};
