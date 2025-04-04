
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  AlertTriangle
} from "lucide-react";
import CycleProgress from "@/components/communities/CycleProgress";
import MemberList from "@/components/communities/MemberList";
import ContributionForm from "@/components/contributions/ContributionForm";
import { getCommunityDetails, joinCommunity } from "@/lib/communityService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import SummaryCards from "@/components/communities/Detail/SummaryCards";
import AboutCircle from "@/components/communities/Detail/AboutCircle";
import JoinDialog from "@/components/communities/Detail/JoinDialog";
import CommunityHeader from "@/components/communities/Detail/CommunityHeader";

const CommunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [communityData, setCommunityData] = useState<any>(null);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const loadCommunityDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await getCommunityDetails(id);
        setCommunityData(data);
      } catch (error) {
        console.error("Failed to load community details:", error);
        toast.error("Failed to load community details");
        navigate("/communities");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCommunityDetails();
  }, [id, navigate]);
  
  const handleJoinRequest = () => {
    if (!user) {
      toast.error("Please log in to join a community");
      navigate("/auth");
      return;
    }
    
    setShowJoinDialog(true);
  };
  
  const handleJoinConfirm = async () => {
    if (!id) return;
    
    setIsJoining(true);
    try {
      await joinCommunity({ communityId: id });
      // Reload community data to update the UI
      const data = await getCommunityDetails(id);
      setCommunityData(data);
      setShowJoinDialog(false);
    } catch (error) {
      // Error handling is done in the service function
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-pulse-scale">
          <div className="bg-kolo-purple rounded-full w-16 h-16 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">K</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (!communityData) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <AlertTriangle className="h-16 w-16 text-red-500" />
        <h2 className="text-xl font-semibold text-gray-800">Community Not Found</h2>
        <p className="text-gray-600">The community you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/communities")}>
          Back to Communities
        </Button>
      </div>
    );
  }

  // Format cycle progress and dates
  const cycleProgress = {
    cycleNumber: communityData.cycle?.cycle_number || 0,
    startDate: communityData.cycle?.start_date 
      ? new Date(communityData.cycle.start_date).toLocaleDateString() 
      : "Not started",
    endDate: communityData.cycle?.end_date 
      ? new Date(communityData.cycle.end_date).toLocaleDateString() 
      : "TBD",
    progress: communityData.cycle ? 
      (communityData.status === "Completed" ? 100 : 
       communityData.status === "Locked" ? 0 : 65) : 0, // Mock progress for now
    midCycles: communityData.midCycles?.map((mc: any) => ({
      id: mc.id,
      isComplete: mc.is_complete,
      payoutDate: new Date(mc.payout_date).toLocaleDateString()
    })) || []
  };

  return (
    <div className="space-y-8">
      <div>
        <Link to="/communities" className="inline-flex items-center text-kolo-purple hover:underline mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Circles</span>
        </Link>
        
        <CommunityHeader
          name={communityData.name}
          status={communityData.status}
          adminEmail={communityData.admin?.email || "Unknown"}
          isMember={communityData.userStatus?.isMember}
          isAdmin={communityData.userStatus?.isAdmin}
          onJoinRequest={handleJoinRequest}
        />
      </div>
      
      <SummaryCards
        total_contribution={communityData.total_contribution}
        backup_fund={communityData.backup_fund}
        member_count={communityData.member_count}
        max_members={communityData.max_members}
        status={communityData.status}
      />
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          {communityData.userStatus?.isMember && (
            <TabsTrigger value="contribute">Contribute</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <CycleProgress
                cycleNumber={cycleProgress.cycleNumber}
                startDate={cycleProgress.startDate}
                endDate={cycleProgress.endDate}
                progress={cycleProgress.progress}
                midCycles={cycleProgress.midCycles}
              />
            </div>
            
            <AboutCircle
              description={communityData.description}
              min_contribution={communityData.min_contribution}
              backup_fund_percentage={communityData.backup_fund_percentage}
              positioning_mode={communityData.positioning_mode}
              is_private={communityData.is_private}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="members">
          <MemberList members={communityData.members.map((member: any) => ({
            id: member.id,
            name: `Member ${member.position}`, // We'd need to fetch user details in a real implementation
            email: "member@example.com", // Placeholder
            position: member.position,
            status: member.status,
            contributionPaid: member.contribution_paid,
            penalty: member.penalty
          }))} />
        </TabsContent>
        
        {communityData.userStatus?.isMember && (
          <TabsContent value="contribute">
            <div className="max-w-md mx-auto">
              <ContributionForm
                communityName={communityData.name}
                minContribution={communityData.min_contribution}
                currentBalance={250}
              />
            </div>
          </TabsContent>
        )}
      </Tabs>
      
      <JoinDialog
        communityName={communityData.name}
        minContribution={communityData.min_contribution}
        showDialog={showJoinDialog}
        setShowDialog={setShowJoinDialog}
        isJoining={isJoining}
        onConfirm={handleJoinConfirm}
      />
    </div>
  );
};

export default CommunityDetail;
