
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface WalletSummaryProps {
  availableBalance: number;
  fixedBalance: number;
}

const WalletSummary = ({ availableBalance, fixedBalance }: WalletSummaryProps) => {
  const totalBalance = availableBalance + fixedBalance;
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-700">My Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Total Balance</p>
            <h3 className="text-2xl font-bold text-kolo-purple">€{totalBalance.toFixed(2)}</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Available</p>
              <p className="text-lg font-semibold">€{availableBalance.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Fixed</p>
              <p className="text-lg font-semibold">€{fixedBalance.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex justify-between gap-2">
            <Link to="/wallet" className="w-full">
              <Button className="w-full text-xs" size="sm" variant="outline">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                Deposit
              </Button>
            </Link>
            <Link to="/wallet" className="w-full">
              <Button className="w-full text-xs" size="sm" variant="outline">
                <ArrowDownLeft className="h-4 w-4 mr-1" />
                Withdraw
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletSummary;
