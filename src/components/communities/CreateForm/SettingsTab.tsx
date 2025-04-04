
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SettingsTabProps {
  formData: {
    maxMembers: number;
    backupFundPercentage: number;
    positioningMode: string;
    isPrivate: boolean;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const SettingsTab = ({ formData, handleInputChange, handleSelectChange }: SettingsTabProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default SettingsTab;
