
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface JoinDialogProps {
  communityName: string;
  minContribution: number;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  isJoining: boolean;
  onConfirm: () => Promise<void>;
}

const JoinDialog = ({
  communityName,
  minContribution,
  showDialog,
  setShowDialog,
  isJoining,
  onConfirm
}: JoinDialogProps) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join {communityName}?</DialogTitle>
          <DialogDescription>
            By joining this circle, you agree to contribute at least €{minContribution?.toFixed(2)} according to the circle's schedule.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
          <Button onClick={onConfirm} disabled={isJoining}>
            {isJoining ? "Joining..." : "Confirm Join"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinDialog;
