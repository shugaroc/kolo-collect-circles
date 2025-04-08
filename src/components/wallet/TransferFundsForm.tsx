
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
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TransferFundsFormProps {
  availableBalance: number;
  onTransferComplete: () => void;
}

const TransferFundsForm = ({ availableBalance, onTransferComplete }: TransferFundsFormProps) => {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransfer = async () => {
    // Validation
    const transferAmount = parseFloat(amount);
    if (!transferAmount || isNaN(transferAmount) || transferAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (transferAmount > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    if (!recipient.trim()) {
      toast.error("Please enter a recipient email");
      return;
    }

    setIsTransferring(true);
    try {
      // First, lookup the recipient user by email using auth.users
      // Since we can't query auth.users directly, we'll query users via their profiles
      const { data: authUser } = await supabase.auth.getUser();
      
      if (!authUser?.user) {
        toast.error("You must be logged in to transfer funds");
        setIsTransferring(false);
        return;
      }
      
      // Get recipient's user ID by email - we'll use a custom function or view here
      // For now, we'll simulate this with a mock delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, we would:
      // 1. Check if recipient exists (via a Supabase function)
      // 2. Reduce sender's balance
      // 3. Increase recipient's balance
      // 4. Create transaction records for both parties
      
      toast.success(`Successfully transferred €${transferAmount.toFixed(2)} to ${recipient}`);
      setAmount("");
      setRecipient("");
      onTransferComplete();
    } catch (error) {
      toast.error("Failed to transfer funds");
      console.error("Transfer error:", error);
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Transfer Funds</CardTitle>
        <CardDescription>
          Send funds to another user's wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Email</Label>
            <Input
              id="recipient"
              placeholder="user@example.com"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="transfer-amount">Amount (€)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
              <Input
                id="transfer-amount"
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
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleTransfer}
          disabled={isTransferring || !amount || !recipient || availableBalance <= 0}
        >
          {isTransferring ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Transferring...
            </>
          ) : (
            <>
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Transfer
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TransferFundsForm;
