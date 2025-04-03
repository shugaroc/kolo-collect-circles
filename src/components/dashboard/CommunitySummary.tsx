
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, CalendarDays, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

interface CommunitySummaryProps {
  id: string;
  name: string;
  totalContribution: number;
  contributionGoal: number;
  memberCount: number;
  nextCycle: string;
  status: "Active" | "Locked" | "Completed";
}

const CommunitySummary = ({
  id,
  name,
  totalContribution,
  contributionGoal,
  memberCount,
  nextCycle,
  status,
}: CommunitySummaryProps) => {
  const percentage = (totalContribution / contributionGoal) * 100;
  
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600";
      case "Locked":
        return "bg-orange-100 text-orange-600";
      case "Completed":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg text-gray-700">{name}</CardTitle>
          <Badge className={`${getBadgeColor(status)} font-normal mt-1`}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Contribution</span>
              <span className="text-kolo-purple font-medium">
                €{totalContribution.toFixed(2)} / €{contributionGoal.toFixed(2)}
              </span>
            </div>
            <Progress value={percentage} className="h-2 mt-1" />
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-kolo-purple" />
              <span>{memberCount} Members</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1 text-kolo-purple" />
              <span>{nextCycle}</span>
            </div>
          </div>
          
          <Link to={`/communities/${id}`}>
            <Button className="w-full" variant="default">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunitySummary;
