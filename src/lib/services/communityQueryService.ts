
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getAuthenticatedUser } from "./baseService";

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
    const user = await getAuthenticatedUser();
    
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
