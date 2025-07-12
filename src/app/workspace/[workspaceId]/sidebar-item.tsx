import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons/lib';
import { cva, VariantProps } from 'class-variance-authority';

// hooks
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const sidebarItemVariants = cva(
  'flex justify-start items-center gap-1.5 font-normal h-7 px-[16px] text-sm overflow-hidden',
  {
    variants: {
      variant: {
        default: 'text-[#f9edffcc]',
        active: 'text-[#481349] bg-white/90 hover:bg-white/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface SidebarItemProps {
  label: string;
  id: string;
  icon: LucideIcon | IconType;
  variant?: VariantProps<typeof sidebarItemVariants>['variant'];
}

export const SidebarItem = ({
  label,
  id,
  icon: Icon,
  variant,
}: SidebarItemProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <Button
      variant="transparent"
      className={cn(sidebarItemVariants({ variant }))}
      size="sm"
      asChild
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="size-3.5 mr-1 shrink-0" />

        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};
