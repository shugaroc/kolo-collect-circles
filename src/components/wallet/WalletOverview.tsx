
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
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
  AlertCircle,
  CreditCard
} from "lucide-react";
import { WalletBalance, WalletTransaction } from "@/lib/walletService";

interface WalletBalanceCardsProps {
  walletBalance: WalletBalance;
}

const WalletBalanceCards = ({ walletBalance }: WalletBalanceCardsProps) => {
  return (
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
  );
}

interface FrozenWalletAlertProps {
  isFrozen: boolean;
}

const FrozenWalletAlert = ({ isFrozen }: FrozenWalletAlertProps) => {
  if (!isFrozen) return null;
  
  return (
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
  );
};

interface TransactionIconsProps {
  type: string;
}

export const TransactionIcon = ({ type }: TransactionIconsProps) => {
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
    case 'transfer':
      return <CreditCard className="h-4 w-4 text-purple-500" />;
    default:
      return <CircleDollarSign className="h-4 w-4 text-gray-500" />;
  }
};

export const TransactionBadge = ({ type }: TransactionIconsProps) => {
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
    case 'transfer':
      return <Badge className="bg-indigo-100 text-indigo-600 font-normal">Transfer</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

interface TransactionsTableProps {
  transactions: WalletTransaction[];
}

const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  return (
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
                    <TransactionIcon type={transaction.type} />
                    <TransactionBadge type={transaction.type} />
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
  );
};

interface WalletOverviewProps {
  walletBalance: WalletBalance;
  transactions: WalletTransaction[];
}

const WalletOverview = ({ walletBalance, transactions }: WalletOverviewProps) => {
  return (
    <Card className="md:col-span-2 shadow-md">
      <CardHeader>
        <CardTitle>Wallet Overview</CardTitle>
        <CardDescription>Manage your KoloCollect balance</CardDescription>
      </CardHeader>
      <CardContent>
        <WalletBalanceCards walletBalance={walletBalance} />
        <FrozenWalletAlert isFrozen={walletBalance.isFrozen} />
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recent Transactions</h3>
          <TransactionsTable transactions={transactions} />
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletOverview;
