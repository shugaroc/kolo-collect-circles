
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BasicInfoTabProps {
  formData: {
    name: string;
    description: string;
    contributionFrequency: string;
    minContribution: number;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const BasicInfoTab = ({ formData, handleInputChange, handleSelectChange }: BasicInfoTabProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default BasicInfoTab;
