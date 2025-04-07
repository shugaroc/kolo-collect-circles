
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { createCommunity } from "@/lib/services/communityCreateService";
import { useAuth } from "@/contexts/AuthContext";
import BasicInfoTab from "@/components/communities/CreateForm/BasicInfoTab";
import SettingsTab from "@/components/communities/CreateForm/SettingsTab";

const CommunityCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contributionFrequency: "Monthly",
    minContribution: 30,
    maxMembers: 10,
    backupFundPercentage: 10,
    positioningMode: "Random",
    isPrivate: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    // For boolean values like isPrivate, we need to convert the string to boolean
    if (name === "isPrivate") {
      setFormData((prev) => ({ ...prev, [name]: value === "private" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Check if user is authenticated
    if (!user) {
      toast.error("You must be logged in to create a community");
      navigate("/auth");
      return;
    }
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Circle name is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const communityId = await createCommunity({
        name: formData.name,
        description: formData.description,
        contributionFrequency: formData.contributionFrequency,
        minContribution: formData.minContribution,
        maxMembers: formData.maxMembers,
        backupFundPercentage: formData.backupFundPercentage,
        positioningMode: formData.positioningMode as "Random" | "Fixed",
        isPrivate: formData.isPrivate
      });
      
      // Navigate to the new community detail page
      navigate(`/communities/${communityId}`);
    } catch (error: any) {
      console.error("Community creation error:", error);
      let errorMessage = error.message || "Failed to create community";
      
      // Handle specific known errors
      if (errorMessage.includes("infinite recursion detected in policy")) {
        errorMessage = "There's a database permission issue. Please try again or contact support.";
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link to="/communities" className="inline-flex items-center text-kolo-purple hover:underline mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Circles</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Create New Circle</h1>
      </div>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Circle Details</CardTitle>
          <CardDescription>
            Set up your new savings circle with the details below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic">
                <BasicInfoTab 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                  handleSelectChange={handleSelectChange} 
                />
              </TabsContent>
              
              <TabsContent value="settings">
                <SettingsTab 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                  handleSelectChange={handleSelectChange} 
                />
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => navigate("/communities")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Circle"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityCreate;
