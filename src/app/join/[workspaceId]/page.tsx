'use client';

import { useMemo, useEffect } from 'react';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import Image from 'next/image';
import Link from 'next/link';
import { Loader } from 'lucide-react';
import VerificationInput from 'react-verification-input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { useGetWorkspaceInfo } from '@/features/workspaces/api/use-get-workspace-info';
import { useJoin } from '@/features/workspaces/api/use-join';

const JoinPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useJoin();
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });

  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.replace(`/workspace/${workspaceId}`);
    }
  }, [isMember, workspaceId, router]);

  const handleComplete = (value: string) => {
    mutate(
      { workspaceId, joinCode: value },
      {
        onSuccess: (id) => {
          router.replace(`/workspace/${id}`);
          toast.success('Workspace joined!');
        },
        onError: () => {
          toast.error('Failed to join workspace');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-center items-center gap-y-8 bg-white p-8 rounded-lg shadow-md">
      <Image src="/logo.svg" width={60} height={60} alt="logo" />
      <div className="flex flex-col justify-center items-center gap-y-4 max-w-md">
        <div className="flex flex-col justify-center items-center gap-y-2">
          <h1 className="text-2xl font-bold">Join {data?.name}</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>

        <VerificationInput
          classNames={{
            container: cn(
              'flex gap-2',
              isPending && 'opacity-50 cursor-not-allowed'
            ),
            character:
              'uppercase h-auto rounded-md border border-gray-300 flex justify-center items-center text-lg font-medium text-gray-500',
            characterInactive: 'bg-muted',
            characterSelected: 'bg-white text-black',
            characterFilled: 'bg-white text-black',
          }}
          length={6}
          autoFocus
          onComplete={handleComplete}
        />
      </div>
      <div className="flex gap-x-4">
        <Button size="lg" variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
