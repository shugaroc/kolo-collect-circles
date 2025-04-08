
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getAuthenticatedUser } from "./baseService";

interface ContributeParams {
  communityId: string;
  amount: number;
  cycleId?: string;
}

/**
 * Processes a contribution from the user's wallet to a community
 */
export const processContribution = async ({ communityId, amount, cycleId }: ContributeParams) => {
  try {
    if (!amount || amount <= 0) {
      throw new Error("Please enter a valid amount");
    }

    const user = await getAuthenticatedUser();
    
    // Get community information
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select('name, min_contribution')
      .eq('id', communityId)
      .single();
    
    if (communityError) {
      console.error("Error fetching community details:", communityError);
      throw communityError;
    }
    
    // Validate minimum contribution
    if (amount < community.min_contribution) {
      throw new Error(`Minimum contribution amount is €${community.min_contribution}`);
    }
    
    // Check if user is a member
    const { data: membership, error: membershipError } = await supabase
      .from('community_members')
      .select('id, status')
      .eq('community_id', communityId)
      .eq('user_id', user.id)
      .single();
    
    if (membershipError || !membership) {
      console.error("Error checking membership:", membershipError);
      throw new Error("You are not a member of this community");
    }
    
    if (membership.status !== 'active') {
      throw new Error(`Your membership status (${membership.status}) doesn't allow contributions`);
    }
    
    // Check wallet balance
    const { data: wallet, error: walletError } = await supabase
      .from('user_wallets' as any)
      .select('available_balance, is_frozen')
      .eq('user_id', user.id)
      .single();
    
    if (walletError) {
      console.error("Error checking wallet balance:", walletError);
      throw walletError;
    }
    
    if (wallet.is_frozen) {
      throw new Error("Your wallet is currently frozen. Please contact support.");
    }
    
    if (wallet.available_balance < amount) {
      throw new Error("Insufficient available balance");
    }
    
    // Process contribution using the stored procedure
    const { data, error } = await supabase.rpc(
      'process_contribution',
      {
        p_user_id: user.id,
        p_community_id: communityId,
        p_amount: amount,
        p_cycle_id: cycleId || null,
      }
    );
    
    if (error) {
      console.error("Error processing contribution:", error);
      throw error;
    }
    
    // Log the transaction
    await supabase
      .from('wallet_transactions' as any)
      .insert({
        user_id: user.id,
        amount: amount,
        type: 'contribution',
        description: `Contribution to ${community.name}`,
        community_id: communityId
      });
    
    toast.success(`Successfully contributed €${amount.toFixed(2)} to ${community.name}`);
    return data;
  } catch (error: any) {
    console.error("Failed to process contribution:", error);
    toast.error(`Error processing contribution: ${error.message}`);
    throw error;
  }
};

/**
 * Records a payout to a user's wallet
 * (This would typically be called by an admin function or automated process)
 */
export const recordPayout = async (userId: string, communityId: string, amount: number) => {
  try {
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
    
    // Process payout using the stored procedure
    const { data, error } = await supabase.rpc(
      'process_payout',
      {
        p_user_id: userId,
        p_community_id: communityId,
        p_amount: amount,
      }
    );
    
    if (error) {
      console.error("Error processing payout:", error);
      throw error;
    }
    
    // Log the transaction
    await supabase
      .from('wallet_transactions' as any)
      .insert({
        user_id: userId,
        amount: amount,
        type: 'payout',
        description: `Payout from ${community.name}`,
        community_id: communityId
      });
    
    return data;
  } catch (error: any) {
    console.error("Failed to process payout:", error);
    throw error;
  }
};
