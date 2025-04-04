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

export const createCommunity = async (params: CreateCommunityParams) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("You must be logged in to create a community");
    }
    
    const contributionGoal = params.maxMembers * params.minContribution;
    
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
      throw communityError;
    }
    
    if (!community) {
      throw new Error("Failed to create community");
    }
    
    const { error: memberError } = await supabase
      .from('community_members')
      .insert({
        community_id: community.id,
        user_id: user.id,
        position: 1,
        status: 'active'
      });
      
    if (memberError) {
      throw memberError;
    }
    
    await supabase
      .from('community_activity_logs')
      .insert({
        community_id: community.id,
        user_id: user.id,
        action: 'created',
        details: { message: `Community created by ${user.email}` }
      });
    
    toast.success("Community created successfully!");
    return community.id;
    
  } catch (error: any) {
    toast.error(`Error creating community: ${error.message}`);
    throw error;
  }
};

export const joinCommunity = async (params: JoinCommunityParams) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("You must be logged in to join a community");
    }
    
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select('member_count, max_members, first_cycle_min, status, id')
      .eq('id', params.communityId)
      .single();
    
    if (communityError) {
      throw communityError;
    }
    
    if (!community) {
      throw new Error("Community not found");
    }
    
    if (community.member_count >= community.max_members) {
      throw new Error("This community has reached its maximum member capacity");
    }
    
    const { data: existingMember, error: memberCheckError } = await supabase
      .from('community_members')
      .select('id')
      .eq('community_id', params.communityId)
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (memberCheckError) {
      throw memberCheckError;
    }
    
    if (existingMember) {
      throw new Error("You are already a member of this community");
    }
    
    const { data: lastPosition, error: positionError } = await supabase
      .from('community_members')
      .select('position')
      .eq('community_id', params.communityId)
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (positionError) {
      throw positionError;
    }
    
    const nextPosition = lastPosition ? lastPosition.position + 1 : 1;
    
    const { error: joinError } = await supabase
      .from('community_members')
      .insert({
        community_id: params.communityId,
        user_id: user.id,
        position: nextPosition,
        status: 'active'
      });
      
    if (joinError) {
      throw joinError;
    }
    
    const { error: updateError } = await supabase
      .from('communities')
      .update({ 
        member_count: community.member_count + 1,
      })
      .eq('id', params.communityId);
      
    if (updateError) {
      throw updateError;
    }
    
    if (community.member_count + 1 >= community.first_cycle_min && community.status === 'Locked') {
      const { error: activateError } = await supabase
        .from('communities')
        .update({ status: 'Active' })
        .eq('id', params.communityId);
        
      if (activateError) {
        throw activateError;
      }
      
      const { error: cycleError } = await supabase
        .from('community_cycles')
        .insert({
          community_id: params.communityId,
          cycle_number: 1,
          start_date: new Date().toISOString()
        });
        
      if (cycleError) {
        throw cycleError;
      }
    }
    
    await supabase
      .from('community_activity_logs')
      .insert({
        community_id: params.communityId,
        user_id: user.id,
        action: 'joined',
        details: { message: `${user.email} joined the community` }
      });
    
    toast.success("You have successfully joined the community!");
    return true;
    
  } catch (error: any) {
    toast.error(`Error joining community: ${error.message}`);
    throw error;
  }
};

export const updateCommunitySettings = async (params: UpdateCommunityParams) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("You must be logged in to update community settings");
    }
    
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select('admin_id')
      .eq('id', params.id)
      .single();
    
    if (communityError) {
      throw communityError;
    }
    
    if (!community) {
      throw new Error("Community not found");
    }
    
    if (community.admin_id !== user.id) {
      throw new Error("Only the community admin can update settings");
    }
    
    const updateData: Record<string, any> = {};
    if (params.description !== undefined) updateData.description = params.description;
    if (params.minContribution !== undefined) updateData.min_contribution = params.minContribution;
    if (params.maxMembers !== undefined) updateData.max_members = params.maxMembers;
    if (params.backupFundPercentage !== undefined) updateData.backup_fund_percentage = params.backupFundPercentage;
    if (params.positioningMode !== undefined) updateData.positioning_mode = params.positioningMode;
    if (params.isPrivate !== undefined) updateData.is_private = params.isPrivate;
    
    const { error: updateError } = await supabase
      .from('communities')
      .update(updateData)
      .eq('id', params.id);
      
    if (updateError) {
      throw updateError;
    }
    
    await supabase
      .from('community_activity_logs')
      .insert({
        community_id: params.id,
        user_id: user.id,
        action: 'settings_updated',
        details: { changes: updateData }
      });
    
    toast.success("Community settings updated successfully!");
    return true;
    
  } catch (error: any) {
    toast.error(`Error updating community settings: ${error.message}`);
    throw error;
  }
};

export const fetchCommunities = async (type: 'my' | 'public' = 'my') => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user && type === 'my') {
      throw new Error("You must be logged in to view your communities");
    }
    
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
    
    if (type === 'my' && user) {
      const { data: memberCommunities } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', user.id);
      
      if (memberCommunities && memberCommunities.length > 0) {
        const communityIds = memberCommunities.map(item => item.community_id);
        query = query.in('id', communityIds);
      } else {
        return [];
      }
    } else if (type === 'public') {
      query = query.eq('is_private', false);
    }
    
    const { data: communities, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return communities || [];
    
  } catch (error: any) {
    toast.error(`Error fetching communities: ${error.message}`);
    return [];
  }
};

export const getCommunityDetails = async (communityId: string) => {
  try {
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
      throw communityError;
    }
    
    if (!community) {
      throw new Error("Community not found");
    }
    
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
      throw membersError;
    }
    
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
      throw cyclesError;
    }
    
    const adminUser = { 
      email: 'Unknown', 
      display_name: 'Unknown User' 
    };
    
    let midCycles = [];
    if (cycles && cycles.length > 0) {
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
      }
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    let isMember = false;
    let isAdmin = false;
    
    if (user) {
      const { data: memberCheck } = await supabase
        .from('community_members')
        .select('id')
        .eq('community_id', communityId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      isMember = !!memberCheck;
      isAdmin = community.admin_id === user.id;
    }
    
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
    toast.error(`Error fetching community details: ${error.message}`);
    throw error;
  }
};

export const getCommunityActivityLogs = async (communityId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("You must be logged in to view activity logs");
    }
    
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
      throw error;
    }
    
    return logs || [];
    
  } catch (error: any) {
    toast.error(`Error fetching activity logs: ${error.message}`);
    return [];
  }
};
