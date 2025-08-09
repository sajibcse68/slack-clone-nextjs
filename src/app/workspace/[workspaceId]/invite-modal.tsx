import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CopyIcon, RefreshCcw } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

// features
import { useNewJoinCode } from '@/features/workspaces/api/use-new-join-code';
import { useConfirm } from '@/hooks/use-confirm';

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode,
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'This will deactivate the current invite code and generate a new one.'
  );

  const { mutate, isPending } = useNewJoinCode();

  const handleNewCode = async () => {
    const ok = await confirm();

    if (!ok) return;

    mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success('Invite code generated!');
        },
        onError: () => {
          toast.error('Failed to generate invite code');
        },
      }
    );
  };

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    navigator.clipboard.writeText(inviteLink).then(() => {
      toast.success('Invite link copied to clipboard');
    });
  };
  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-y-4 justify-center items-center py-10">
            <p className="flex-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>

            <Button variant="ghost" size="sm" onClick={handleCopy}>
              Copy Link
              <CopyIcon className="size-4 ml-2" />
            </Button>
          </div>

          <div className="flex justify-between items-center w-full">
            <Button
              variant="outline"
              onClick={handleNewCode}
              disabled={isPending}
            >
              New code
              <RefreshCcw className="size-4 ml-2" />
            </Button>

            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
