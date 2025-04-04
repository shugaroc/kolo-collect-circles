
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

interface JoinCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isJoining: boolean;
  communityName?: string;
  minContribution?: number;
}

const JoinCommunityDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isJoining,
  communityName = "this Circle",
  minContribution
}: JoinCommunityDialogProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleConfirmClick = async () => {
    setError(null);
    try {
      await onConfirm();
    } catch (err: any) {
      setError(err.message || "Failed to join circle");
      toast.error(err.message || "Failed to join circle");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join {communityName}?</DialogTitle>
          <DialogDescription>
            By joining this savings circle, you'll be expected to contribute 
            {minContribution ? ` at least €${minContribution.toFixed(2)}` : ' regularly'} 
            according to the circle's rules.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 p-3 rounded-md border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isJoining}>Cancel</Button>
          <Button onClick={handleConfirmClick} disabled={isJoining}>
            {isJoining ? "Joining..." : "Confirm Join"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinCommunityDialog;
