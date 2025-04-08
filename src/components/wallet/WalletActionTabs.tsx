
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletBalance } from "@/lib/walletService";
import DepositFundsForm from "./DepositFundsForm";
import WithdrawFundsForm from "./WithdrawFundsForm";
import TransferFundsForm from "./TransferFundsForm";
import FixFundsForm from "./FixFundsForm";

interface WalletActionTabsProps {
  walletBalance: WalletBalance;
  onDepositFunds: (amount: number) => Promise<void>;
  onWithdrawFunds: (amount: number) => Promise<void>;
  onWalletAction: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const WalletActionTabs = ({
  walletBalance,
  onDepositFunds,
  onWithdrawFunds,
  onWalletAction,
  activeTab,
  setActiveTab
}: WalletActionTabsProps) => {
  return (
    <Tabs defaultValue="deposit" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="deposit">Deposit</TabsTrigger>
        <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        <TabsTrigger value="transfer">Transfer</TabsTrigger>
        <TabsTrigger value="lock">Lock</TabsTrigger>
      </TabsList>
      
      <TabsContent value="deposit">
        <DepositFundsForm 
          onDeposit={onDepositFunds}
          isFrozen={walletBalance.isFrozen} 
        />
      </TabsContent>
      
      <TabsContent value="withdraw">
        <WithdrawFundsForm 
          onWithdraw={onWithdrawFunds}
          isFrozen={walletBalance.isFrozen}
          availableBalance={walletBalance.availableBalance}
        />
      </TabsContent>
      
      <TabsContent value="transfer">
        <TransferFundsForm 
          availableBalance={walletBalance.availableBalance} 
          onTransferComplete={onWalletAction} 
        />
      </TabsContent>
      
      <TabsContent value="lock">
        <FixFundsForm 
          availableBalance={walletBalance.availableBalance} 
          onFixComplete={onWalletAction} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default WalletActionTabs;
