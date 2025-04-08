
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
import { ArrowUpRight } from "lucide-react";

interface DepositFundsFormProps {
  onDeposit: (amount: number) => Promise<void>;
  isFrozen: boolean;
}

const DepositFundsForm = ({ onDeposit, isFrozen }: DepositFundsFormProps) => {
  const [depositAmount, setDepositAmount] = useState("");

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      return;
    }
    
    await onDeposit(amount);
    setDepositAmount("");
  };

  return (
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
            disabled={isFrozen}
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Deposit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepositFundsForm;
