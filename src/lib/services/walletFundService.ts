
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getAuthenticatedUser } from "./baseService";

interface DepositFundsParams {
  amount: number;
}

interface WithdrawFundsParams {
  amount: number;
}

interface FixFundsParams {
  amount: number;
  duration?: number; // Duration in days
}

/**
 * Adds funds to the user's wallet
 */
export const depositFunds = async ({ amount }: DepositFundsParams) => {
  try {
    if (!amount || amount <= 0) {
      throw new Error("Please enter a valid amount");
    }

    const user = await getAuthenticatedUser();
    
    // Call the deposit_funds function using RPC
    const { data, error } = await supabase.rpc(
      'deposit_funds',
      {
        p_user_id: user.id,
        p_amount: amount,
      }
    );
    
    if (error) {
      console.error("Error depositing funds:", error);
      throw error;
    }
    
    // Log the transaction
    await supabase
      .from('wallet_transactions' as any)
      .insert({
        user_id: user.id,
        amount: amount,
        type: 'deposit',
        description: 'Funds added to wallet',
      });
    
    toast.success(`Successfully deposited €${amount.toFixed(2)}`);
    return data;
  } catch (error: any) {
    console.error("Failed to deposit funds:", error);
    toast.error(`Error depositing funds: ${error.message}`);
    throw error;
  }
};

/**
 * Withdraws funds from the user's wallet
 */
export const withdrawFunds = async ({ amount }: WithdrawFundsParams) => {
  try {
    if (!amount || amount <= 0) {
      throw new Error("Please enter a valid amount");
    }

    const user = await getAuthenticatedUser();
    
    // Check if wallet is frozen
    const { data: wallet, error: walletError } = await supabase
      .from('user_wallets' as any)
      .select('is_frozen, available_balance')
      .eq('user_id', user.id)
      .single();
    
    if (walletError) {
      console.error("Error checking wallet status:", walletError);
      throw walletError;
    }
    
    if (wallet.is_frozen) {
      throw new Error("Your wallet is currently frozen. Please contact support.");
    }
    
    if (wallet.available_balance < amount) {
      throw new Error("Insufficient available balance");
    }
    
    // Call the withdraw_funds stored procedure
    const { data, error } = await supabase.rpc(
      'withdraw_funds',
      {
        p_user_id: user.id,
        p_amount: amount,
      }
    );
    
    if (error) {
      console.error("Error withdrawing funds:", error);
      throw error;
    }
    
    // Log the transaction
    await supabase
      .from('wallet_transactions' as any)
      .insert({
        user_id: user.id,
        amount: amount,
        type: 'withdrawal',
        description: 'Funds withdrawn from wallet',
      });
    
    toast.success(`Successfully withdrew €${amount.toFixed(2)}`);
    return data;
  } catch (error: any) {
    console.error("Failed to withdraw funds:", error);
    toast.error(`Error withdrawing funds: ${error.message}`);
    throw error;
  }
};

/**
 * Moves funds from available to fixed balance
 */
export const fixFunds = async ({ amount, duration = 30 }: FixFundsParams) => {
  try {
    if (!amount || amount <= 0) {
      throw new Error("Please enter a valid amount");
    }

    const user = await getAuthenticatedUser();
    
    // Check available balance
    const { data: wallet, error: walletError } = await supabase
      .from('user_wallets' as any)
      .select('available_balance')
      .eq('user_id', user.id)
      .single();
    
    if (walletError) {
      console.error("Error checking wallet balance:", walletError);
      throw walletError;
    }
    
    if (wallet.available_balance < amount) {
      throw new Error("Insufficient available balance");
    }
    
    // Calculate release date
    const releaseDate = new Date();
    releaseDate.setDate(releaseDate.getDate() + duration);
    
    // Call the fix_funds stored procedure
    const { data, error } = await supabase.rpc(
      'fix_funds',
      {
        p_user_id: user.id,
        p_amount: amount,
        p_release_date: releaseDate.toISOString(),
      }
    );
    
    if (error) {
      console.error("Error fixing funds:", error);
      throw error;
    }
    
    // Log the transaction
    await supabase
      .from('wallet_transactions' as any)
      .insert({
        user_id: user.id,
        amount: amount,
        type: 'fixed',
        description: `Funds locked until ${releaseDate.toLocaleDateString()}`,
      });
    
    toast.success(`Successfully locked €${amount.toFixed(2)} until ${releaseDate.toLocaleDateString()}`);
    return data;
  } catch (error: any) {
    console.error("Failed to fix funds:", error);
    toast.error(`Error locking funds: ${error.message}`);
    throw error;
  }
};
