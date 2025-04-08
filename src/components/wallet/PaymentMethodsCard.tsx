
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleDollarSign, CreditCard, Wallet as WalletIcon } from "lucide-react";

const PaymentMethodsCard = () => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-md p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-kolo-purple" />
              <span>Card Payments</span>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>
          
          <div className="border rounded-md p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <WalletIcon className="h-5 w-5 text-kolo-purple" />
              <span>Bank Transfer</span>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>
          
          <div className="border rounded-md p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CircleDollarSign className="h-5 w-5 text-kolo-purple" />
              <span>Crypto</span>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsCard;
