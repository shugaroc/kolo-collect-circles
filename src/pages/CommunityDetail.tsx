
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
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Settings, 
  ArrowLeft, 
  CircleDollarSign,
  Users,
  Calendar,
  Wallet,
  Clock,
  AlertTriangle
} from "lucide-react";
import CycleProgress from "@/components/communities/CycleProgress";
import MemberList from "@/components/communities/MemberList";
import ContributionForm from "@/components/contributions/ContributionForm";
import { getCommunityDetails, joinCommunity } from "@/lib/communityService";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

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
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{communityData.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(communityData.status)}
              <span className="text-sm text-gray-500">Admin: {communityData.admin?.email || "Unknown"}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {communityData.userStatus?.isMember ? (
              <>
                <Button variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Invite
                </Button>
                {communityData.userStatus?.isAdmin && (
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Settings
                  </Button>
                )}
              </>
            ) : (
              <Button size="sm" onClick={handleJoinRequest}>
                <UserPlus className="h-4 w-4 mr-1" />
                Join Circle
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <Card className="shadow-md">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <CircleDollarSign className="h-5 w-5 text-kolo-purple" />
                <h3 className="font-medium">Total Contribution</h3>
              </div>
              <p className="text-2xl font-bold text-kolo-purple">€{communityData.total_contribution?.toFixed(2) || '0.00'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="h-5 w-5 text-kolo-purple" />
                <h3 className="font-medium">Backup Fund</h3>
              </div>
              <p className="text-2xl font-bold text-kolo-purple">€{communityData.backup_fund?.toFixed(2) || '0.00'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-5 w-5 text-kolo-purple" />
                <h3 className="font-medium">Members</h3>
              </div>
              <p className="text-2xl font-bold text-kolo-purple">{communityData.member_count} / {communityData.max_members}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-5 w-5 text-kolo-purple" />
                <h3 className="font-medium">Cycle Status</h3>
              </div>
              <p className="text-2xl font-bold text-kolo-purple">{communityData.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
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
            
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-700">About This Circle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">{communityData.description || "No description provided."}</p>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div>
                      <p className="text-gray-500">Min Contribution</p>
                      <p className="font-medium">€{communityData.min_contribution}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Backup Fund</p>
                      <p className="font-medium">{communityData.backup_fund_percentage}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Positioning</p>
                      <p className="font-medium">{communityData.positioning_mode}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Privacy</p>
                      <p className="font-medium">{communityData.is_private ? "Private" : "Public"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
      
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join {communityData.name}?</DialogTitle>
            <DialogDescription>
              By joining this circle, you agree to contribute at least €{communityData.min_contribution?.toFixed(2)} according to the circle's schedule.
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

export default CommunityDetail;
