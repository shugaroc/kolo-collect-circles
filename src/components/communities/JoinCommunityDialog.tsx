
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface JoinCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isJoining: boolean;
}

const JoinCommunityDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isJoining
}: JoinCommunityDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join this Circle?</DialogTitle>
          <DialogDescription>
            Are you sure you want to join this savings circle? You'll be expected to contribute regularly according to the circle's rules.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onConfirm} disabled={isJoining}>
            {isJoining ? "Joining..." : "Confirm Join"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinCommunityDialog;
