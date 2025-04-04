
import { useState, useEffect } from "react";
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
import { fetchCommunities } from "@/lib/communityService";
import { useAuth } from "@/contexts/AuthContext";

interface Community {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  total_contribution: number;
  min_contribution: number;
  status: "Active" | "Locked" | "Completed";
}

const Communities = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [communities, setCommunities] = useState<Community[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    const loadCommunities = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCommunities('my');
        setCommunities(data as Community[]);
      } catch (error) {
        console.error("Failed to load communities:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      loadCommunities();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (community.description && community.description.toLowerCase().includes(searchQuery.toLowerCase()))
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
  
  const formatNextCycleDate = (status: string) => {
    if (status === "Completed") return "Completed";
    if (status === "Locked") return "Locked";
    
    // In a real implementation, we would get this from the actual cycle data
    // For now, return a simple date
    return "Next: " + new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();
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

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse-scale">
            <div className="bg-kolo-purple rounded-full w-12 h-12 flex items-center justify-center">
              <span className="text-white text-xl font-bold">K</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!user ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Please log in to view your circles.</p>
              <Link to="/auth" className="mt-4 inline-block">
                <Button>Log In</Button>
              </Link>
            </div>
          ) : filteredCommunities.length === 0 ? (
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
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{community.description || "No description provided."}</p>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-kolo-purple" />
                      <span>{community.member_count} Members</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-kolo-purple" />
                      <span>{formatNextCycleDate(community.status)}</span>
                    </div>
                    <div className="flex items-center col-span-2">
                      <CircleDollarSign className="h-4 w-4 mr-1 text-kolo-purple" />
                      <span>€{community.total_contribution?.toFixed(2) || '0.00'} Contributed</span>
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
      )}
    </div>
  );
};

export default Communities;
