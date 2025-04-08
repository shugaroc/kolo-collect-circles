
import { useState, useEffect } from "react";
import WalletOverview from "@/components/wallet/WalletOverview";
import WalletActionTabs from "@/components/wallet/WalletActionTabs";
import PaymentMethodsCard from "@/components/wallet/PaymentMethodsCard";
import LoadingWallet from "@/components/wallet/LoadingWallet";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchWalletBalance,
  fetchTransactionHistory,
  WalletBalance,
  WalletTransaction,
} from "@/lib/walletService";
import { depositFunds, withdrawFunds } from "@/lib/walletService";

const Wallet = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("deposit");
  const [walletBalance, setWalletBalance] = useState<WalletBalance>({
    availableBalance: 0,
    fixedBalance: 0,
    totalBalance: 0,
    isFrozen: false
  });
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  
  const loadWalletData = async () => {
    setIsLoading(true);
    
    if (user) {
      try {
        // Fetch wallet balance
        const balance = await fetchWalletBalance();
        setWalletBalance(balance);
        
        // Fetch transaction history
        const history = await fetchTransactionHistory();
        setTransactions(history);
      } catch (error) {
        console.error("Error loading wallet data:", error);
      }
    }
    
    setIsLoading(false);
  };
  
  useEffect(() => {
    loadWalletData();
  }, [user]);

  const handleDeposit = async (amount: number) => {
    try {
      await depositFunds({ amount });
      await loadWalletData();
    } catch (error) {
      // Error is handled by the service function
    }
  };

  const handleWithdraw = async (amount: number) => {
    try {
      await withdrawFunds({ amount });
      await loadWalletData();
    } catch (error) {
      // Error is handled by the service function
    }
  };

  if (isLoading) {
    return <LoadingWallet />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">My Wallet</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Overview Component (left side) */}
        <WalletOverview 
          walletBalance={walletBalance}
          transactions={transactions}
        />
        
        {/* Wallet Actions Components (right side) */}
        <div className="space-y-6">
          {/* Action Tabs Component */}
          <WalletActionTabs
            walletBalance={walletBalance}
            onDepositFunds={handleDeposit}
            onWithdrawFunds={handleWithdraw}
            onWalletAction={loadWalletData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          
          {/* Payment Methods Component */}
          <PaymentMethodsCard />
        </div>
      </div>
    </div>
  );
};

export default Wallet;
