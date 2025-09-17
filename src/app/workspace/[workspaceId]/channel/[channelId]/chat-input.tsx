import dynamic from 'next/dynamic';
import Quill from 'quill';
import { useRef, useState } from 'react';

import { useCreateMessage } from '@/features/messages/api/use-create-message';
import { useChannelId } from '@/hooks/use-channel-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { toast } from 'sonner';

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const { mutate: createMessage } = useCreateMessage();

  const handleSubmit = async ({
    body,
    // image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);

      await createMessage(
        {
          body,
          workspaceId,
          channelId,
        },
        { throwError: true }
      );

      setEditorKey((prev) => prev + 1); // reset editor
    } catch (error) {
      console.error('Error createMessage: ', error);
      toast.error('Failed to send message');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
};

export default ChatInput;
