
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
import CommunityCard from "@/components/communities/CommunityCard";
import JoinCommunityDialog from "@/components/communities/JoinCommunityDialog";

interface PublicCommunity {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  total_contribution: number;
  min_contribution: number;
  status: "Active" | "Locked" | "Completed";
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
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                description={community.description}
                member_count={community.member_count}
                total_contribution={community.total_contribution}
                min_contribution={community.min_contribution}
                status={community.status}
                onJoinRequest={handleJoinRequest}
              />
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
      
      <JoinCommunityDialog
        open={showJoinDialog}
        onOpenChange={setShowJoinDialog}
        onConfirm={handleJoinConfirm}
        isJoining={isJoining}
      />
    </div>
  );
};

export default PublicCommunities;
