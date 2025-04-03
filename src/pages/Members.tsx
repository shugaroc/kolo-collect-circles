
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";

const Members = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Members</h1>
        <Button className="bg-kolo-purple hover:bg-kolo-purple/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Community Members</CardTitle>
          <CardDescription>Manage members across all your communities.</CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search members..." className="pl-8" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No members to display yet.</p>
            <p className="text-sm">Add members to see them listed here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Members;
