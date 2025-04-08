
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, CheckCircle, Mail, Bell, Shield, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [currency, setCurrency] = useState("EUR");
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("system");

  const handleSaveNotifications = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Notification settings saved successfully");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive emails about your account activity
                  </p>
                </div>
                <Switch 
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive push notifications in your browser
                  </p>
                </div>
                <Switch 
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="marketing-emails" className="font-medium">Marketing Emails</Label>
                  <p className="text-sm text-gray-500">
                    Receive emails about new features and offerings
                  </p>
                </div>
                <Switch 
                  id="marketing-emails"
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveNotifications}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Password</h3>
                <div className="flex items-center gap-2">
                  <div className="w-full max-w-md">
                    <p className="text-sm text-gray-500">
                      Last changed 3 months ago
                    </p>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center gap-2">
                  <div className="w-full max-w-md">
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <h3 className="font-medium text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Danger Zone
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-full max-w-md">
                    <p className="text-sm text-gray-500">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Manage your payment methods and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Payment Methods</h3>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">
                    No payment methods added yet.
                  </p>
                  <Button className="mt-4" onClick={() => navigate("/wallet")}>
                    Manage Payment Methods
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Currency</h3>
                <div className="max-w-xs">
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="GBP">British Pound (£)</SelectItem>
                      <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast.success("Payment settings saved")}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your application experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Language</h3>
                <div className="max-w-xs">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Theme</h3>
                <div className="max-w-xs">
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast.success("Preferences saved")}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
