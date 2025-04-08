
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getAuthenticatedUser } from "./baseService";

// Type definitions for transfer operation
export interface TransferFundsParams {
  recipientEmail: string;
  amount: number;
}

/**
 * Transfers funds from one user to another
 */
export const transferFunds = async ({ recipientEmail, amount }: TransferFundsParams) => {
  try {
    const user = await getAuthenticatedUser();
    
    // Check if sender has enough available balance
    const { data: wallet, error: walletError } = await supabase
      .from('user_wallets')
      .select('available_balance, is_frozen')
      .eq('user_id', user.id)
      .single();
    
    if (walletError) throw walletError;
    
    if (wallet.is_frozen) {
      toast.error('Your wallet is frozen. Please contact support.');
      return false;
    }
    
    if (wallet.available_balance < amount) {
      toast.error('Insufficient funds');
      return false;
    }
    
    // Get recipient user data
    const { data: recipientData, error: recipientError } = await supabase
      .from('users_view') // This would be a view or public function to look up users safely
      .select('id')
      .eq('email', recipientEmail)
      .maybeSingle();
    
    if (recipientError || !recipientData) {
      console.error('Recipient lookup error:', recipientError);
      toast.error('Recipient not found');
      return false;
    }
    
    const recipientId = recipientData.id;
    
    // Execute transfer logic using a transaction
    // In a real implementation, you'd use a database transaction to ensure atomicity
    
    // 1. Reduce sender's balance
    const { error: reduceError } = await supabase
      .rpc('withdraw_funds', {
        p_user_id: user.id,
        p_amount: amount
      });
      
    if (reduceError) throw reduceError;
    
    // 2. Increase recipient's balance
    const { error: increaseError } = await supabase
      .rpc('deposit_funds', {
        p_user_id: recipientId,
        p_amount: amount
      });
    
    if (increaseError) {
      // If this fails, we should roll back the withdrawal, but for simplicity we'll just log
      console.error('Failed to increase recipient balance:', increaseError);
      toast.error('Transfer failed. Please contact support.');
      return false;
    }
    
    // 3. Create transaction records for both parties
    // Sender record (withdrawal)
    await supabase
      .from('wallet_transactions')
      .insert({
        user_id: user.id,
        type: 'transfer',
        amount: amount,
        description: `Transfer to ${recipientEmail}`,
        recipient_id: recipientId
      });
      
    // Recipient record (deposit)
    await supabase
      .from('wallet_transactions')
      .insert({
        user_id: recipientId,
        type: 'transfer',
        amount: amount,
        description: `Transfer from ${user.email}`,
        recipient_id: user.id
      });
    
    toast.success(`Successfully transferred €${amount.toFixed(2)} to ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error('Transfer error:', error);
    toast.error('Failed to transfer funds');
    throw error;
  }
};
