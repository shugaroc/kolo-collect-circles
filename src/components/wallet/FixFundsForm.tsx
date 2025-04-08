
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { fixFunds } from "@/lib/walletService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FixFundsFormProps {
  availableBalance: number;
  onFixComplete: () => void;
}

const FixFundsForm = ({ availableBalance, onFixComplete }: FixFundsFormProps) => {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("30");
  const [isFixing, setIsFixing] = useState(false);

  const handleFix = async () => {
    // Validation
    const fixAmount = parseFloat(amount);
    if (!fixAmount || isNaN(fixAmount) || fixAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (fixAmount > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    setIsFixing(true);
    try {
      // Calculate release date based on duration
      const releaseDate = new Date();
      releaseDate.setDate(releaseDate.getDate() + parseInt(duration));
      
      await fixFunds({ 
        amount: fixAmount, 
        duration: parseInt(duration),
        releaseDate: releaseDate.toISOString()
      });
      
      setAmount("");
      onFixComplete();
    } catch (error) {
      // Error is handled in the service function
      console.error("Fix funds error:", error);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Lock Funds</CardTitle>
        <CardDescription>
          Lock your funds for a specified duration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fix-amount">Amount to Lock (€)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
              <Input
                id="fix-amount"
                className="pl-8"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
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
          
          <div className="space-y-2">
            <Label htmlFor="lock-duration">Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">180 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleFix}
          disabled={isFixing || !amount || availableBalance <= 0}
        >
          {isFixing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Locking...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Lock Funds
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FixFundsForm;
