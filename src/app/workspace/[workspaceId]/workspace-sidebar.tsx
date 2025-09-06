'use client';

import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from 'lucide-react';
import { WorkspaceHeader } from './workspace-header';
import { SidebarItem } from './sidebar-item';

import { useChannelId } from '@/hooks/use-channel-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

// features
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';

import { WorkspaceSection } from './workspace-section';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { UserItem } from './user-item';

const WorkspaceSidebar = () => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const [, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels } = useGetChannels({
    workspaceId,
  });
  const { data: members } = useGetMembers({
    workspaceId,
  });

  if (memberLoading || workspaceLoading) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full justify-center items-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!member || !workspace) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5E2C5F] h-full justify-center items-center">
        <AlertTriangle className="size-5 text-white" />

        <p className="text-white text-sm"> Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === 'admin'}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem
          label="Threads"
          icon={MessageSquareText}
          id="threads"
        />
        <SidebarItem label="Drafts & Sent" icon={SendHorizonal} id="drafts" />
      </div>

      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={member.role === 'admin' ? () => setOpen(true) : undefined}
      >
        {channels?.map((ch) => (
          <SidebarItem
            key={ch._id}
            id={ch._id}
            icon={HashIcon}
            label={ch.name}
            variant={channelId === ch._id ? 'active' : 'default'}
          />
        ))}
      </WorkspaceSection>

      <WorkspaceSection
        label="Direct Messages"
        hint="New direct message"
        onNew={() => {}}
      >
        {members?.map((m) => {
          return (
            <UserItem
              key={m._id}
              id={m._id}
              image={m.user.image}
              label={m.user.name || ''}
            />
          );
        })}
      </WorkspaceSection>
    </div>
  );
};
export default WorkspaceSidebar;
