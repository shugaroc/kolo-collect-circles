
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getAuthenticatedUser } from "./baseService";

/**
 * Deposits funds into user's wallet
 */
export const depositFunds = async ({ 
  amount 
} : { 
  amount: number 
}) => {
  try {
    const user = await getAuthenticatedUser();
    
    // Call database function to deposit funds
    const { data, error } = await supabase
      .rpc('deposit_funds', {
        p_user_id: user.id,
        p_amount: amount
      });
      
    if (error) {
      console.error('Deposit error:', error);
      toast.error('Failed to deposit funds');
      throw error;
    }
    
    // Create a transaction record
    await supabase
      .from('wallet_transactions')
      .insert({
        user_id: user.id,
        type: 'deposit',
        amount: amount,
        description: 'Manual deposit'
      });
    
    toast.success(`Successfully deposited €${amount.toFixed(2)}`);
    return true;
  } catch (error) {
    console.error('Deposit error:', error);
    toast.error('Failed to deposit funds');
    throw error;
  }
};

/**
 * Withdraws funds from user's wallet
 */
export const withdrawFunds = async ({
  amount
} : {
  amount: number
}) => {
  try {
    const user = await getAuthenticatedUser();
    
    // Get wallet to check if it's frozen
    const { data: wallet, error: walletError } = await supabase
      .from('user_wallets')
      .select('is_frozen, available_balance')
      .eq('user_id', user.id)
      .single();
    
    if (walletError) throw walletError;
    
    if (wallet.is_frozen) {
      toast.error('Wallet is frozen. Please contact support.');
      return false;
    }
    
    if (wallet.available_balance < amount) {
      toast.error('Insufficient funds');
      return false;
    }
    
    // Call database function to withdraw funds
    const { data, error } = await supabase
      .rpc('withdraw_funds', {
        p_user_id: user.id,
        p_amount: amount
      });
      
    if (error) {
      console.error('Withdrawal error:', error);
      toast.error(error.message || 'Failed to withdraw funds');
      throw error;
    }
    
    // Create a transaction record
    await supabase
      .from('wallet_transactions')
      .insert({
        user_id: user.id,
        type: 'withdrawal',
        amount: amount,
        description: 'Manual withdrawal'
      });
    
    toast.success(`Successfully withdrew €${amount.toFixed(2)}`);
    return true;
  } catch (error) {
    console.error('Withdrawal error:', error);
    toast.error('Failed to withdraw funds');
    throw error;
  }
};

/**
 * Lock funds for a specified duration
 */
export const fixFunds = async ({
  amount,
  duration,
  releaseDate
} : {
  amount: number,
  duration: number,
  releaseDate: string
}) => {
  try {
    const user = await getAuthenticatedUser();
    
    // Check if wallet has enough available balance
    const { data: wallet, error: walletError } = await supabase
      .from('user_wallets')
      .select('available_balance')
      .eq('user_id', user.id)
      .single();
    
    if (walletError) throw walletError;
    
    if (wallet.available_balance < amount) {
      toast.error('Insufficient funds');
      return false;
    }
    
    // Call database function to fix funds
    const { data, error } = await supabase
      .rpc('fix_funds', {
        p_user_id: user.id,
        p_amount: amount,
        p_release_date: releaseDate
      });
      
    if (error) {
      console.error('Fix funds error:', error);
      toast.error(error.message || 'Failed to lock funds');
      throw error;
    }
    
    // Create a transaction record
    await supabase
      .from('wallet_transactions')
      .insert({
        user_id: user.id,
        type: 'fixed',
        amount: amount,
        description: `Funds locked for ${duration} days`
      });
    
    toast.success(`Successfully locked €${amount.toFixed(2)} for ${duration} days`);
    return true;
  } catch (error) {
    console.error('Fix funds error:', error);
    toast.error('Failed to lock funds');
    throw error;
  }
};
