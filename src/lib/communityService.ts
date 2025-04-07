
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

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

interface JoinCommunityParams {
  communityId: string;
}

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
 * Creates a new community and adds the creator as the first member
 */
export const createCommunity = async (params: CreateCommunityParams) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("You must be logged in to create a community");
    }
    
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
      throw communityError;
    }
    
    if (!community) {
      throw new Error("Failed to create community");
    }
    
    console.log("Community created:", community.id);
    
    // Step 2: Add creator as the first member using a separate function call
    // This approach helps avoid infinite recursion issues with RLS policies
    try {
      console.log("Adding creator as member...");
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
    try {
      await supabase
        .from('community_activity_logs')
        .insert({
          community_id: community.id,
          user_id: user.id,
          action: 'created',
          details: { message: `Community created by ${user.email}` }
        });
    } catch (logError) {
      console.error("Error logging activity:", logError);
      // Non-critical error, continue
    }
    
    toast.success("Community created successfully!");
    return community.id;
    
  } catch (error: any) {
    console.error("Community creation error:", error);
    // Don't toast here, let the calling component handle the error
    throw error;
  }
};

/**
 * Allows a user to join an existing community
 */
export const joinCommunity = async (params: JoinCommunityParams) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("You must be logged in to join a community");
    }
    
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
      try {
        const { error: activateError } = await supabase
          .from('communities')
          .update({ status: 'Active' })
          .eq('id', params.communityId);
          
        if (activateError) {
          console.error("Error activating community:", activateError);
          // Non-critical error, continue
        } else {
          // Create first cycle if activation was successful
          const { error: cycleError } = await supabase
            .from('community_cycles')
            .insert({
              community_id: params.communityId,
              cycle_number: 1,
              start_date: new Date().toISOString()
            });
            
          if (cycleError) {
            console.error("Error creating cycle:", cycleError);
            // Non-critical error, continue
          }
        }
      } catch (activationError) {
        console.error("Exception activating community:", activationError);
        // Non-critical error, continue
      }
    }
    
    // Step 8: Log the activity
    try {
      await supabase
        .from('community_activity_logs')
        .insert({
          community_id: params.communityId,
          user_id: user.id,
          action: 'joined',
          details: { message: `${user.email} joined the community` }
        });
    } catch (logError) {
      console.error("Error logging activity:", logError);
      // Non-critical error, continue
    }
    
    toast.success("You have successfully joined the community!");
    return true;
    
  } catch (error: any) {
    console.error("Error joining community:", error);
    toast.error(`Error joining community: ${error.message}`);
    throw error;
  }
};

/**
 * Allows community admin to update settings
 */
export const updateCommunitySettings = async (params: UpdateCommunityParams) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("You must be logged in to update community settings");
    }
    
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
    try {
      await supabase
        .from('community_activity_logs')
        .insert({
          community_id: params.id,
          user_id: user.id,
          action: 'settings_updated',
          details: { changes: updateData }
        });
    } catch (logError) {
      console.error("Error logging activity:", logError);
      // Non-critical error, continue
    }
    
    toast.success("Community settings updated successfully!");
    return true;
    
  } catch (error: any) {
    console.error("Error updating community settings:", error);
    toast.error(`Error updating community settings: ${error.message}`);
    throw error;
  }
};

/**
 * Fetches communities based on type (my or public)
 */
export const fetchCommunities = async (type: 'my' | 'public' = 'my') => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user && type === 'my') {
      throw new Error("You must be logged in to view your communities");
    }
    
    // Setup basic query
    let query = supabase
      .from('communities')
      .select(`
        id, 
        name, 
        description, 
        status, 
        member_count, 
        total_contribution,
        contribution_goal,
        min_contribution,
        max_members
      `);
    
    // Apply filters based on type
    if (type === 'my' && user) {
      console.log("Fetching user communities...");
      try {
        const { data: memberCommunities, error: memberError } = await supabase
          .from('community_members')
          .select('community_id')
          .eq('user_id', user.id);
        
        if (memberError) {
          console.error("Error fetching member communities:", memberError);
          return [];
        }
        
        if (memberCommunities && memberCommunities.length > 0) {
          const communityIds = memberCommunities.map(item => item.community_id);
          query = query.in('id', communityIds);
        } else {
          return [];
        }
      } catch (memberError) {
        console.error("Exception fetching member communities:", memberError);
        return [];
      }
    } else if (type === 'public') {
      console.log("Fetching public communities...");
      query = query.eq('is_private', false);
    }
    
    // Execute query
    const { data: communities, error } = await query;
    
    if (error) {
      console.error("Error fetching communities:", error);
      throw error;
    }
    
    return communities || [];
    
  } catch (error: any) {
    console.error("Error fetching communities:", error);
    toast.error(`Error fetching communities: ${error.message}`);
    return [];
  }
};

/**
 * Fetches detailed information about a specific community
 */
export const getCommunityDetails = async (communityId: string) => {
  try {
    // Step 1: Get community data
    console.log("Fetching community details...");
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select(`
        id,
        name,
        description,
        status,
        member_count,
        max_members,
        total_contribution,
        contribution_goal,
        backup_fund,
        backup_fund_percentage,
        min_contribution,
        positioning_mode,
        admin_id
      `)
      .eq('id', communityId)
      .single();
    
    if (communityError) {
      console.error("Error fetching community details:", communityError);
      throw communityError;
    }
    
    if (!community) {
      throw new Error("Community not found");
    }
    
    // Step 2: Get members
    console.log("Fetching members...");
    const { data: members, error: membersError } = await supabase
      .from('community_members')
      .select(`
        id,
        user_id,
        position,
        status,
        contribution_paid,
        penalty,
        joined_at
      `)
      .eq('community_id', communityId);
    
    if (membersError) {
      console.error("Error fetching members:", membersError);
      throw membersError;
    }
    
    // Step 3: Get cycle information
    console.log("Fetching cycles...");
    const { data: cycles, error: cyclesError } = await supabase
      .from('community_cycles')
      .select(`
        id,
        cycle_number,
        start_date,
        end_date,
        is_complete
      `)
      .eq('community_id', communityId)
      .order('cycle_number', { ascending: false })
      .limit(1);
    
    if (cyclesError) {
      console.error("Error fetching cycles:", cyclesError);
      throw cyclesError;
    }
    
    // Default admin user info
    const adminUser = { 
      email: 'Unknown', 
      display_name: 'Unknown User' 
    };
    
    // Step 4: Get mid-cycles if applicable
    let midCycles = [];
    if (cycles && cycles.length > 0) {
      console.log("Fetching mid-cycles...");
      try {
        const { data: midCyclesData, error: midCyclesError } = await supabase
          .from('community_mid_cycles')
          .select(`
            id,
            payout_date,
            is_complete,
            payout_member_id
          `)
          .eq('cycle_id', cycles[0].id)
          .order('payout_date', { ascending: true });
        
        if (!midCyclesError && midCyclesData) {
          midCycles = midCyclesData;
        } else if (midCyclesError) {
          console.error("Error fetching mid-cycles:", midCyclesError);
        }
      } catch (midCyclesException) {
        console.error("Exception fetching mid-cycles:", midCyclesException);
      }
    }
    
    // Step 5: Check user membership and admin status
    console.log("Checking user status...");
    const { data: { user } } = await supabase.auth.getUser();
    let isMember = false;
    let isAdmin = false;
    
    if (user) {
      try {
        const { data: memberCheck, error: memberCheckError } = await supabase
          .from('community_members')
          .select('id')
          .eq('community_id', communityId)
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (!memberCheckError) {
          isMember = !!memberCheck;
        } else {
          console.error("Error checking membership:", memberCheckError);
        }
        
        isAdmin = community.admin_id === user.id;
      } catch (memberCheckException) {
        console.error("Exception checking membership:", memberCheckException);
      }
    }
    
    // Return compiled data
    return {
      ...community,
      members: members || [],
      cycle: cycles && cycles.length > 0 ? cycles[0] : null,
      midCycles: midCycles,
      admin: adminUser,
      userStatus: {
        isMember,
        isAdmin
      }
    };
    
  } catch (error: any) {
    console.error("Error fetching community details:", error);
    toast.error(`Error fetching community details: ${error.message}`);
    throw error;
  }
};

/**
 * Fetches activity logs for a community
 */
export const getCommunityActivityLogs = async (communityId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("You must be logged in to view activity logs");
    }
    
    console.log("Fetching activity logs...");
    const { data: logs, error } = await supabase
      .from('community_activity_logs')
      .select(`
        id,
        user_id,
        action,
        details,
        created_at
      `)
      .eq('community_id', communityId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching activity logs:", error);
      throw error;
    }
    
    return logs || [];
    
  } catch (error: any) {
    console.error("Error fetching activity logs:", error);
    toast.error(`Error fetching activity logs: ${error.message}`);
    return [];
  }
};
