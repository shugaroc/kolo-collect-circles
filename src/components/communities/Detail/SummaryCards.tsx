
import { Card, CardContent } from "@/components/ui/card";
import { CircleDollarSign, Wallet, Users, Clock } from "lucide-react";

interface SummaryCardsProps {
  total_contribution: number;
  backup_fund: number;
  member_count: number;
  max_members: number;
  status: string;
}

const SummaryCards = ({
  total_contribution,
  backup_fund,
  member_count,
  max_members,
  status
}: SummaryCardsProps) => {
  return (
    <Card className="shadow-md">
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CircleDollarSign className="h-5 w-5 text-kolo-purple" />
              <h3 className="font-medium">Total Contribution</h3>
            </div>
            <p className="text-2xl font-bold text-kolo-purple">€{total_contribution?.toFixed(2) || '0.00'}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="h-5 w-5 text-kolo-purple" />
              <h3 className="font-medium">Backup Fund</h3>
            </div>
            <p className="text-2xl font-bold text-kolo-purple">€{backup_fund?.toFixed(2) || '0.00'}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-5 w-5 text-kolo-purple" />
              <h3 className="font-medium">Members</h3>
            </div>
            <p className="text-2xl font-bold text-kolo-purple">{member_count} / {max_members}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-5 w-5 text-kolo-purple" />
              <h3 className="font-medium">Cycle Status</h3>
            </div>
            <p className="text-2xl font-bold text-kolo-purple">{status}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCards;
