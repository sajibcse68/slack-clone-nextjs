import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Loader, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

// features
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [, setOpen] = useCreateWorkspaceModal();

  const { data: workspaces } = useGetWorkspaces();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const filteredWorkspaces = workspaces?.filter((ws) => ws._id !== workspaceId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-80 font-semibold text-xl">
          {workspaceLoading ? (
            <Loader className="size-5 animate-spin shrink-0" />
          ) : (
            workspace?.name?.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          className="cursor-pointer flex-col justify-start items-start capitalize"
          onClick={() => router.push(`/workspace/${workspaceId}`)}
        >
          {workspace?.name}

          <span className="text-xs text-muted-foreground">
            Active workspace
          </span>
        </DropdownMenuItem>

        {filteredWorkspaces?.map((ws) => {
          return (
            <DropdownMenuItem
              key={ws._id}
              className="cursor-pointer capitalize overflow-hidden"
              onClick={() => router.push(`/workspace/${ws._id}`)}
            >
              <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md flex justify-center items-center">
                {workspace?.name.charAt(0).toUpperCase()}
              </div>
              <p className="truncate">{ws.name}</p>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="size-9 relative overflow-hidden bg-[#F2F2F2] text-slate-800 font-semibold text-lg rounded-md flex justify-center items-center">
            <Plus />
          </div>
          Create a new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
