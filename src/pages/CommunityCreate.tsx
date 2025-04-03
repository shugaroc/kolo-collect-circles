
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { toast } from "sonner";

const CommunityCreate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Circle name is required");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Circle created successfully!");
      navigate("/communities");
    }, 1500);
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
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Circle Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Family Savings Circle"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell members what this circle is about"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contributionFrequency">Contribution Frequency</Label>
                    <Select
                      defaultValue={formData.contributionFrequency}
                      onValueChange={(value) => handleSelectChange("contributionFrequency", value)}
                    >
                      <SelectTrigger id="contributionFrequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="minContribution">Minimum Contribution (€)</Label>
                    <Input
                      id="minContribution"
                      name="minContribution"
                      type="number"
                      value={formData.minContribution}
                      onChange={handleInputChange}
                      min={1}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxMembers">Maximum Members</Label>
                    <Input
                      id="maxMembers"
                      name="maxMembers"
                      type="number"
                      value={formData.maxMembers}
                      onChange={handleInputChange}
                      min={2}
                      max={100}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backupFundPercentage">Backup Fund (%)</Label>
                    <Input
                      id="backupFundPercentage"
                      name="backupFundPercentage"
                      type="number"
                      value={formData.backupFundPercentage}
                      onChange={handleInputChange}
                      min={0}
                      max={20}
                    />
                    <p className="text-xs text-gray-500">
                      Percentage of contributions to keep as emergency backup
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="positioningMode">Member Positioning</Label>
                  <Select
                    defaultValue={formData.positioningMode}
                    onValueChange={(value) => handleSelectChange("positioningMode", value)}
                  >
                    <SelectTrigger id="positioningMode">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Random">Random</SelectItem>
                      <SelectItem value="Fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Random: Positions assigned randomly | Fixed: Sequential order
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="privacy">Privacy</Label>
                  <Select
                    defaultValue={formData.isPrivate ? "private" : "public"}
                    onValueChange={(value) => handleSelectChange("isPrivate", value)}
                  >
                    <SelectTrigger id="privacy">
                      <SelectValue placeholder="Select privacy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private (Invite Only)</SelectItem>
                      <SelectItem value="public">Public (Anyone Can Join)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
