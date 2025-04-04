
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, CircleDollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CommunityCardProps {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  total_contribution: number;
  min_contribution: number;
  status: "Active" | "Locked" | "Completed";
  onJoinRequest: (id: string) => void;
}

const CommunityCard = ({
  id,
  name,
  description,
  member_count,
  total_contribution,
  min_contribution,
  status,
  onJoinRequest
}: CommunityCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-600 font-normal">Active</Badge>;
      case "Locked":
        return <Badge className="bg-orange-100 text-orange-600 font-normal">Locked</Badge>;
      case "Completed":
        return <Badge className="bg-blue-100 text-blue-600 font-normal">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const formatNextCycleDate = (status: string) => {
    if (status === "Completed") return "Completed";
    if (status === "Locked") return "Locked";
    
    // In a real implementation, we would get this from the actual cycle data
    return "Next: " + new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString();
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-gray-700">{name}</CardTitle>
          {getStatusBadge(status)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{description || "No description provided."}</p>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-kolo-purple" />
            <span>{member_count} Members</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-kolo-purple" />
            <span>{formatNextCycleDate(status)}</span>
          </div>
          <div className="flex items-center col-span-2">
            <CircleDollarSign className="h-4 w-4 mr-1 text-kolo-purple" />
            <span>€{total_contribution?.toFixed(2) || '0.00'} Contributed</span>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>Min Contribution: €{min_contribution?.toFixed(2) || '0.00'}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant="default"
          onClick={() => onJoinRequest(id)}
        >
          Request to Join
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CommunityCard;
