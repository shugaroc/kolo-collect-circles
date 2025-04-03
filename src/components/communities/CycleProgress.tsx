
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarDays } from "lucide-react";

interface CycleProgressProps {
  cycleNumber: number;
  startDate: string;
  endDate: string;
  progress: number;
  midCycles: {
    id: number;
    isComplete: boolean;
    payoutDate: string;
  }[];
}

const CycleProgress = ({ cycleNumber, startDate, endDate, progress, midCycles }: CycleProgressProps) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gray-700">Cycle #{cycleNumber} Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Overall Progress</span>
              <span className="text-kolo-purple font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1" />
              <span>Started: {startDate}</span>
            </div>
            <span>Ends: {endDate}</span>
          </div>
          
          <div className="pt-2">
            <p className="text-sm font-medium mb-2">Mid-Cycles</p>
            <div className="grid grid-cols-5 gap-2">
              {midCycles.map((midCycle) => (
                <div 
                  key={midCycle.id}
                  className={`aspect-square rounded-full flex items-center justify-center text-xs ${
                    midCycle.isComplete ? 'bg-kolo-teal text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                  title={`Mid-Cycle ${midCycle.id}: ${midCycle.isComplete ? 'Completed' : 'Pending'}\nPayout Date: ${midCycle.payoutDate}`}
                >
                  {midCycle.id}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CycleProgress;
