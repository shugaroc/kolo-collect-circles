
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, Settings } from "lucide-react";

interface CommunityHeaderProps {
  name: string;
  status: string;
  adminEmail: string;
  isMember: boolean;
  isAdmin: boolean;
  onJoinRequest: () => void;
}

const CommunityHeader = ({
  name,
  status,
  adminEmail,
  isMember,
  isAdmin,
  onJoinRequest
}: CommunityHeaderProps) => {
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

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
        <div className="flex items-center gap-2 mt-1">
          {getStatusBadge(status)}
          <span className="text-sm text-gray-500">Admin: {adminEmail}</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        {isMember ? (
          <>
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-1" />
              Invite
            </Button>
            {isAdmin && (
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
            )}
          </>
        ) : (
          <Button size="sm" onClick={onJoinRequest}>
            <UserPlus className="h-4 w-4 mr-1" />
            Join Circle
          </Button>
        )}
      </div>
    </div>
  );
};

export default CommunityHeader;
