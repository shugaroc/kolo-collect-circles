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
import { Search, Users, Calendar, CircleDollarSign } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import CommunityMenu from "@/components/navigation/CommunityMenu";

interface PublicCommunity {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  totalContribution: number;
  nextCycle: string;
  status: "Active" | "Locked" | "Completed";
  admin: string;
}

const PublicCommunities = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - in a real app this would come from Supabase
  const publicCommunities: PublicCommunity[] = [
    {
      id: "1",
      name: "Community Savings Network",
      description: "Open savings circle for our local community members",
      memberCount: 15,
      totalContribution: 2500,
      nextCycle: "Apr 20",
      status: "Active",
      admin: "Sarah Johnson"
    },
    {
      id: "2",
      name: "Public Investment Group",
      description: "Everyone welcome! We save together for various projects",
      memberCount: 12,
      totalContribution: 1800,
      nextCycle: "May 1",
      status: "Active",
      admin: "Michael Chen"
    },
    {
      id: "3",
      name: "Neighborhood Support Circle",
      description: "Join our community-wide savings initiative",
      memberCount: 20,
      totalContribution: 3500,
      nextCycle: "Apr 25",
      status: "Active",
      admin: "Elena Rodriguez"
    },
    {
      id: "4",
      name: "Open Savings Club",
      description: "Open to all - save together, grow together",
      memberCount: 8,
      totalContribution: 1200,
      nextCycle: "May 10",
      status: "Active",
      admin: "David Smith"
    },
    {
      id: "5",
      name: "Community Growth Fund",
      description: "Public savings group with moderate contribution amounts",
      memberCount: 18,
      totalContribution: 2800,
      nextCycle: "Apr 30",
      status: "Active",
      admin: "Alex Morgan"
    },
  ];

  const filteredCommunities = publicCommunities.filter((community) =>
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
        <h1 className="text-2xl font-bold text-gray-800">Public Savings Circles</h1>
        <div className="flex gap-2">
          <Link to="/communities/new">
            <Button variant="outline">
              Create Your Own Circle
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search public circles..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No public circles found. Try a different search.</p>
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
                <div className="mt-4 text-sm text-gray-600">
                  <p>Created by: {community.admin}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="default">
                  Request to Join
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PublicCommunities;
