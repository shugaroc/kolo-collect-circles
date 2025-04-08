
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet as WalletIcon, 
  Lock,
  CircleDollarSign,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { fetchWalletBalance, fetchTransactionHistory, WalletBalance, WalletTransaction } from "@/lib/walletService";
import { depositFunds, withdrawFunds } from "@/lib/walletService";

const Wallet = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [walletBalance, setWalletBalance] = useState<WalletBalance>({
    availableBalance: 0,
    fixedBalance: 0,
    totalBalance: 0,
    isFrozen: false
  });
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  
  useEffect(() => {
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
          toast.error("Failed to load wallet data");
        }
      }
      
      setIsLoading(false);
    };
    
    loadWalletData();
  }, [user]);

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    try {
      await depositFunds({ amount });
      
      // Refresh wallet data
      const balance = await fetchWalletBalance();
      setWalletBalance(balance);
      
      const history = await fetchTransactionHistory();
      setTransactions(history);
      
      setDepositAmount("");
    } catch (error) {
      // Error is handled by the service function
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    try {
      await withdrawFunds({ amount });
      
      // Refresh wallet data
      const balance = await fetchWalletBalance();
      setWalletBalance(balance);
      
      const history = await fetchTransactionHistory();
      setTransactions(history);
      
      setWithdrawAmount("");
    } catch (error) {
      // Error is handled by the service function
    }
  };
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowDownLeft className="h-4 w-4 text-red-500" />;
      case 'contribution':
        return <CircleDollarSign className="h-4 w-4 text-blue-500" />;
      case 'penalty':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'payout':
        return <WalletIcon className="h-4 w-4 text-green-500" />;
      case 'fixed':
        return <Lock className="h-4 w-4 text-gray-500" />;
      default:
        return <CircleDollarSign className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'deposit':
        return <Badge className="bg-green-100 text-green-600 font-normal">Deposit</Badge>;
      case 'withdrawal':
        return <Badge className="bg-red-100 text-red-600 font-normal">Withdrawal</Badge>;
      case 'contribution':
        return <Badge className="bg-blue-100 text-blue-600 font-normal">Contribution</Badge>;
      case 'penalty':
        return <Badge className="bg-orange-100 text-orange-600 font-normal">Penalty</Badge>;
      case 'payout':
        return <Badge className="bg-purple-100 text-purple-600 font-normal">Payout</Badge>;
      case 'fixed':
        return <Badge className="bg-gray-100 text-gray-600 font-normal">Fixed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-pulse-scale">
          <div className="bg-kolo-purple rounded-full w-16 h-16 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">K</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">My Wallet</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle>Wallet Overview</CardTitle>
            <CardDescription>Manage your KoloCollect balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Card className="bg-kolo-purple text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <WalletIcon className="h-5 w-5" />
                    <p className="text-sm opacity-80">Total Balance</p>
                  </div>
                  <h3 className="text-2xl font-bold mt-2">€{walletBalance.totalBalance.toFixed(2)}</h3>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <ArrowUpRight className="h-5 w-5 text-kolo-purple" />
                    <p className="text-sm text-gray-500">Available</p>
                  </div>
                  <h3 className="text-2xl font-bold mt-2 text-kolo-purple">€{walletBalance.availableBalance.toFixed(2)}</h3>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Lock className="h-5 w-5 text-kolo-purple" />
                    <p className="text-sm text-gray-500">Fixed</p>
                  </div>
                  <h3 className="text-2xl font-bold mt-2 text-kolo-purple">€{walletBalance.fixedBalance.toFixed(2)}</h3>
                </CardContent>
              </Card>
            </div>
            
            {walletBalance.isFrozen && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">Account Frozen</h4>
                    <p className="text-red-600 text-sm">
                      Your wallet is currently frozen. Please contact support for assistance.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Recent Transactions</h3>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                          No transactions yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTransactionIcon(transaction.type)}
                              {getTransactionBadge(transaction.type)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              {transaction.community_name && (
                                <p className="text-xs text-gray-500">{transaction.community_name}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className={`font-medium ${
                            ['deposit', 'payout'].includes(transaction.type) 
                              ? 'text-green-600' 
                              : ['withdrawal', 'contribution', 'penalty'].includes(transaction.type) 
                                ? 'text-red-600' 
                                : ''
                          }`}>
                            {['deposit', 'payout'].includes(transaction.type) ? '+' : '-'}
                            €{transaction.amount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-gray-500">{transaction.date}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Deposit Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deposit-amount">Amount (€)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    <Input
                      id="deposit-amount"
                      className="pl-8"
                      placeholder="0.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      type="number"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleDeposit}
                  disabled={walletBalance.isFrozen}
                >
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Deposit
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Withdraw Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdraw-amount">Amount (€)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    <Input
                      id="withdraw-amount"
                      className="pl-8"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      type="number"
                      step="0.01"
                      min="0"
                      max={walletBalance.availableBalance}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Available: €{walletBalance.availableBalance.toFixed(2)}
                  </p>
                </div>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={handleWithdraw}
                  disabled={walletBalance.isFrozen || walletBalance.availableBalance <= 0}
                >
                  <ArrowDownLeft className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
