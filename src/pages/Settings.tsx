
import { useState } from "react";
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [contributionReminders, setContributionReminders] = useState(true);
  const [payoutNotifications, setPayoutNotifications] = useState(true);

  const handleSaveNotificationSettings = () => {
    setIsLoadingNotifications(true);
    // Simulate saving notification settings
    setTimeout(() => {
      setIsLoadingNotifications(false);
      toast.success("Notification settings updated successfully");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how KoloCollect notifies you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive email notifications</p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="contribution-reminders">Contribution Reminders</Label>
                    <p className="text-sm text-gray-500">Get reminded before contribution due dates</p>
                  </div>
                  <Switch 
                    id="contribution-reminders" 
                    checked={contributionReminders}
                    onCheckedChange={setContributionReminders}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="payout-notifications">Payout Notifications</Label>
                    <p className="text-sm text-gray-500">Get notified when it's your payout time</p>
                  </div>
                  <Switch 
                    id="payout-notifications" 
                    checked={payoutNotifications}
                    onCheckedChange={setPayoutNotifications}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={handleSaveNotificationSettings} 
                  disabled={isLoadingNotifications}
                >
                  {isLoadingNotifications ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                To update your account information like name, email, and phone number, please visit the Profile page.
              </p>
              <div className="mt-4">
                <Button variant="outline" onClick={() => window.location.href = "/profile"}>
                  Go to Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-base font-medium">Change Password</h3>
                <p className="text-sm text-gray-500">
                  You can change your password by requesting a password reset email.
                </p>
                <Button className="mt-2" variant="outline">
                  Send Reset Password Email
                </Button>
              </div>
              
              <div className="pt-4">
                <h3 className="text-base font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">
                  Enhance your account security by enabling two-factor authentication.
                </p>
                <Button className="mt-2" variant="outline">
                  Set Up Two-Factor Authentication
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
