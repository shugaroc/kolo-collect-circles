
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getAuthenticatedUser } from "./baseService";

// Type definitions for wallet operations
export interface WalletBalance {
  availableBalance: number;
  fixedBalance: number;
  totalBalance: number;
  isFrozen: boolean;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: "deposit" | "withdrawal" | "contribution" | "penalty" | "transfer" | "payout" | "fixed";
  description: string;
  date: string;
  community_id?: string;
  community_name?: string;
  recipient_id?: string;
  recipient_name?: string;
}

/**
 * Fetches the current user's wallet balance
 */
export const fetchWalletBalance = async (): Promise<WalletBalance> => {
  try {
    const user = await getAuthenticatedUser();
    
    const { data, error } = await supabase
      .from('user_wallets')
      .select('available_balance, fixed_balance, is_frozen')
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      console.error("Error fetching wallet balance:", error);
      // If the wallet doesn't exist yet, return default values
      if (error.code === 'PGRST116') { // "No rows returned" PostgreSQL error
        return {
          availableBalance: 0,
          fixedBalance: 0,
          totalBalance: 0,
          isFrozen: false
        };
      }
      throw error;
    }
    
    // Calculate total balance
    const totalBalance = (data.available_balance || 0) + (data.fixed_balance || 0);
    
    return {
      availableBalance: data.available_balance || 0,
      fixedBalance: data.fixed_balance || 0,
      totalBalance,
      isFrozen: data.is_frozen || false
    };
  } catch (error) {
    console.error("Failed to fetch wallet balance:", error);
    // Return default values if there's an error
    return {
      availableBalance: 0,
      fixedBalance: 0,
      totalBalance: 0,
      isFrozen: false
    };
  }
};

/**
 * Fetches transaction history for the current user
 */
export const fetchTransactionHistory = async (): Promise<WalletTransaction[]> => {
  try {
    const user = await getAuthenticatedUser();
    
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select(`
        id,
        amount,
        type,
        description,
        created_at,
        community_id,
        communities(name),
        recipient_id
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching transaction history:", error);
      throw error;
    }
    
    // Transform the data to match our interface
    return (data || []).map((transaction: any) => ({
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      date: new Date(transaction.created_at).toLocaleDateString(),
      community_id: transaction.community_id,
      community_name: transaction.communities?.name,
      recipient_id: transaction.recipient_id,
      recipient_name: "Unknown" // We would need to join with users table to get this
    }));
  } catch (error) {
    console.error("Failed to fetch transaction history:", error);
    return [];
  }
};
