
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface ContributionFormProps {
  communityName: string;
  minContribution: number;
  currentBalance: number;
}

const ContributionForm = ({ communityName, minContribution, currentBalance }: ContributionFormProps) => {
  const [amount, setAmount] = useState<string>("");
  const [paymentType, setPaymentType] = useState<string>("Full");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleContribute = () => {
    const numAmount = parseFloat(amount);

    if (!amount || isNaN(numAmount)) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (numAmount < minContribution) {
      toast.error(`Minimum contribution amount is €${minContribution}`);
      return;
    }

    if (numAmount > currentBalance) {
      toast.error("Amount exceeds your available balance");
      return;
    }

    setIsSubmitting(true);

    // Simulating API call
    setTimeout(() => {
      toast.success(`Successfully contributed €${numAmount} to ${communityName}`);
      setAmount("");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg text-gray-700">Make a Contribution</CardTitle>
        <CardDescription>
          Contribute to {communityName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Contribution Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                placeholder={`Minimum ${minContribution}`}
                type="number"
                min={minContribution}
              />
            </div>
            <p className="text-xs text-gray-500">Available balance: €{currentBalance.toFixed(2)}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-type">Payment Type</Label>
            <Select
              defaultValue={paymentType}
              onValueChange={setPaymentType}
            >
              <SelectTrigger id="payment-type">
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full">Full Payment</SelectItem>
                <SelectItem value="Incremental">Incremental</SelectItem>
                <SelectItem value="Shortfall">Shortfall Recovery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full" 
            onClick={handleContribute}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Contribute"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContributionForm;
