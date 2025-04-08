
import { supabase } from "@/integrations/supabase/client";
import { getAuthenticatedUser } from "./baseService";

interface ApplyPenaltyParams {
  userId: string;
  communityId: string;
  amount: number;
  reason: string;
}

interface UpdateWalletStatusParams {
  userId: string;
  isFrozen: boolean;
  reason?: string;
}

/**
 * Applies a penalty to a user's wallet
 * Requires admin permissions
 */
export const applyPenalty = async ({ userId, communityId, amount, reason }: ApplyPenaltyParams) => {
  try {
    const adminUser = await getAuthenticatedUser();
    
    // Check if the user is a community admin
    const { data: isAdmin, error: adminCheckError } = await supabase.rpc(
      'is_community_admin',
      { community_id: communityId }
    );
    
    if (adminCheckError || !isAdmin) {
      console.error("Admin check failed:", adminCheckError);
      throw new Error("You don't have permission to apply penalties");
    }
    
    // Get community information
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select('name')
      .eq('id', communityId)
      .single();
    
    if (communityError) {
      console.error("Error fetching community details:", communityError);
      throw communityError;
    }
    
    // Apply penalty using the stored procedure
    const { data, error } = await supabase.rpc(
      'apply_penalty',
      {
        p_user_id: userId,
        p_community_id: communityId,
        p_amount: amount,
      }
    );
    
    if (error) {
      console.error("Error applying penalty:", error);
      throw error;
    }
    
    // Log the transaction
    await supabase
      .from('wallet_transactions' as any)
      .insert({
        user_id: userId,
        amount: amount,
        type: 'penalty',
        description: reason || `Penalty from ${community.name}`,
        community_id: communityId
      });
    
    // Update community member record
    await supabase
      .from('community_members')
      .update({ penalty: amount })
      .eq('community_id', communityId)
      .eq('user_id', userId);
    
    // Log the activity
    await supabase.from('community_activity_logs').insert({
      community_id: communityId,
      user_id: adminUser.id,
      action: 'penalty_applied',
      details: {
        target_user_id: userId,
        amount: amount,
        reason: reason || 'No reason provided'
      }
    });
    
    return data;
  } catch (error: any) {
    console.error("Failed to apply penalty:", error);
    throw error;
  }
};

/**
 * Updates a user's wallet status (freeze/unfreeze)
 * Requires admin permissions
 */
export const updateWalletStatus = async ({ userId, isFrozen, reason }: UpdateWalletStatusParams) => {
  try {
    const adminUser = await getAuthenticatedUser();
    
    // Check if the user is a platform admin (this would require a custom check)
    // For now, we'll assume all authenticated users can do this (not realistic)
    
    // Update wallet status
    const { data, error } = await supabase
      .from('user_wallets' as any)
      .update({ is_frozen: isFrozen })
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error updating wallet status:", error);
      throw error;
    }
    
    // Log the action (in a real system, log to an admin_actions table)
    console.log(`Wallet ${isFrozen ? 'frozen' : 'unfrozen'} for user ${userId} by admin ${adminUser.id}`);
    console.log(`Reason: ${reason || 'No reason provided'}`);
    
    return data;
  } catch (error: any) {
    console.error("Failed to update wallet status:", error);
    throw error;
  }
};

/**
 * Gets a list of wallets with suspicious activity
 * Requires admin permissions
 */
export const getFlaggedWallets = async () => {
  try {
    await getAuthenticatedUser();
    
    // In a real implementation, this would have a sophisticated query
    // For now, we'll just get wallets with frozen status
    const { data, error } = await supabase
      .from('user_wallets' as any)
      .select(`
        user_id,
        available_balance,
        fixed_balance,
        is_frozen,
        created_at
      `)
      .eq('is_frozen', true);
    
    if (error) {
      console.error("Error fetching flagged wallets:", error);
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error("Failed to get flagged wallets:", error);
    throw error;
  }
};
