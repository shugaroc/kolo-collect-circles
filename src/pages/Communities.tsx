import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Users, Calendar, CircleDollarSign } from "lucide-react";
import CommunityMenu from "@/components/navigation/CommunityMenu";

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  totalContribution: number;
  nextCycle: string;
  status: "Active" | "Locked" | "Completed";
}

const Communities = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const communities: Community[] = [
    {
      id: "1",
      name: "Family Savings Circle",
      description: "A circle for our family to save together for emergencies and celebrations",
      memberCount: 8,
      totalContribution: 1200,
      nextCycle: "Feb 15",
      status: "Active",
    },
    {
      id: "2",
      name: "Friends Investment Group",
      description: "Collective saving for our annual vacation fund",
      memberCount: 5,
      totalContribution: 800,
      nextCycle: "Mar 1",
      status: "Active",
    },
    {
      id: "3",
      name: "Neighborhood Fund",
      description: "Community savings for local improvement projects",
      memberCount: 12,
      totalContribution: 3000,
      nextCycle: "Completed",
      status: "Completed",
    },
    {
      id: "4",
      name: "Work Colleagues Circle",
      description: "Office savings circle for team building events",
      memberCount: 6,
      totalContribution: 600,
      nextCycle: "Apr 5",
      status: "Active",
    },
    {
      id: "5",
      name: "School Parents Group",
      description: "Saving for end of year school trip",
      memberCount: 10,
      totalContribution: 1500,
      nextCycle: "Locked",
      status: "Locked",
    },
  ];

  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="space-y-8">
      <CommunityMenu />
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">My Circles</h1>
        <div className="flex gap-2">
          <Link to="/communities/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Circle
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search circles..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No circles found. Try a different search or create a new one.</p>
          </div>
        ) : (
          filteredCommunities.map((community) => (
            <Card key={community.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-gray-700">{community.name}</CardTitle>
                  {getStatusBadge(community.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{community.description}</p>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-kolo-purple" />
                    <span>{community.memberCount} Members</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-kolo-purple" />
                    <span>{community.nextCycle}</span>
                  </div>
                  <div className="flex items-center col-span-2">
                    <CircleDollarSign className="h-4 w-4 mr-1 text-kolo-purple" />
                    <span>€{community.totalContribution.toFixed(2)} Contributed</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/communities/${community.id}`} className="w-full">
                  <Button className="w-full" variant="default">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Communities;
