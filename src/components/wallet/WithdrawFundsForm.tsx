
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowDownLeft } from "lucide-react";

interface WithdrawFundsFormProps {
  onWithdraw: (amount: number) => Promise<void>;
  isFrozen: boolean;
  availableBalance: number;
}

const WithdrawFundsForm = ({ onWithdraw, isFrozen, availableBalance }: WithdrawFundsFormProps) => {
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      return;
    }
    
    await onWithdraw(amount);
    setWithdrawAmount("");
  };

  return (
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
                max={availableBalance}
              />
            </div>
            <p className="text-xs text-gray-500">
              Available: €{availableBalance.toFixed(2)}
            </p>
          </div>
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={handleWithdraw}
            disabled={isFrozen || availableBalance <= 0}
          >
            <ArrowDownLeft className="h-4 w-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WithdrawFundsForm;
