
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleDollarSign, UserPlus, ArrowDownToLine, BellRing, AlertTriangle } from "lucide-react";

interface Activity {
  id: string;
  type: 'contribution' | 'join' | 'payout' | 'notification' | 'penalty';
  message: string;
  timestamp: string;
  community?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contribution':
        return <CircleDollarSign className="h-4 w-4 text-green-500" />;
      case 'join':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'payout':
        return <ArrowDownToLine className="h-4 w-4 text-kolo-purple" />;
      case 'notification':
        return <BellRing className="h-4 w-4 text-amber-500" />;
      case 'penalty':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <BellRing className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-700">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
          {activities.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No recent activity</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex gap-3 pb-3 border-b border-gray-100">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    {activity.community && (
                      <Badge variant="outline" className="text-xs font-normal">
                        {activity.community}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
