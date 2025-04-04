
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
import { fetchCommunities, joinCommunity } from "@/lib/communityService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PublicCommunity {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  total_contribution: number;
  min_contribution: number;
  status: "Active" | "Locked" | "Completed";
  admin?: string; // We'll need to get this separately
}

const PublicCommunities = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [publicCommunities, setPublicCommunities] = useState<PublicCommunity[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadPublicCommunities = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCommunities('public');
        setPublicCommunities(data as PublicCommunity[]);
      } catch (error) {
        console.error("Failed to load public communities:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPublicCommunities();
  }, []);

  const filteredCommunities = publicCommunities.filter((community) =>
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
    return "Next: " + new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString();
  };
  
  const handleJoinRequest = (communityId: string) => {
    if (!user) {
      toast.error("Please log in to join a community");
      return;
    }
    
    setSelectedCommunity(communityId);
    setShowJoinDialog(true);
  };
  
  const handleJoinConfirm = async () => {
    if (!selectedCommunity) return;
    
    setIsJoining(true);
    try {
      await joinCommunity({ communityId: selectedCommunity });
      toast.success("You've successfully joined the circle!");
      setShowJoinDialog(false);
      
      // Reload communities to update the UI
      const data = await fetchCommunities('public');
      setPublicCommunities(data as PublicCommunity[]);
    } catch (error) {
      // Error handling is done in the service function
    } finally {
      setIsJoining(false);
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
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Min Contribution: €{community.min_contribution?.toFixed(2) || '0.00'}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant="default"
                    onClick={() => handleJoinRequest(community.id)}
                  >
                    Request to Join
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
      
      {filteredCommunities.length > 0 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join this Circle?</DialogTitle>
            <DialogDescription>
              Are you sure you want to join this savings circle? You'll be expected to contribute regularly according to the circle's rules.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJoinDialog(false)}>Cancel</Button>
            <Button onClick={handleJoinConfirm} disabled={isJoining}>
              {isJoining ? "Joining..." : "Confirm Join"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PublicCommunities;
