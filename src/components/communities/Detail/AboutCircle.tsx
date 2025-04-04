
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AboutCircleProps {
  description: string | null;
  min_contribution: number;
  backup_fund_percentage: number;
  positioning_mode: string;
  is_private: boolean;
}

const AboutCircle = ({
  description,
  min_contribution,
  backup_fund_percentage,
  positioning_mode,
  is_private
}: AboutCircleProps) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-700">About This Circle</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600">{description || "No description provided."}</p>
          
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div>
              <p className="text-gray-500">Min Contribution</p>
              <p className="font-medium">€{min_contribution}</p>
            </div>
            <div>
              <p className="text-gray-500">Backup Fund</p>
              <p className="font-medium">{backup_fund_percentage}%</p>
            </div>
            <div>
              <p className="text-gray-500">Positioning</p>
              <p className="font-medium">{positioning_mode}</p>
            </div>
            <div>
              <p className="text-gray-500">Privacy</p>
              <p className="font-medium">{is_private ? "Private" : "Public"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutCircle;
