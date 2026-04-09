// components/shared/notifications/NotificationFooter.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NotificationFooterProps {
  hasNextPage?: boolean;
  isLoading: boolean;
  onLoadMore?: () => void;
  totalCount: number;
  className?: string;
  viewAllHref?: string;
}

export const NotificationFooter: React.FC<NotificationFooterProps> = ({
  hasNextPage,
  isLoading,
  onLoadMore,
  totalCount,
  className,
  viewAllHref = '/notifications',
}) => {
  if (totalCount === 0) return null;

  return (
    <div className={cn('border-t border-border p-2', className)}>
      <div className="flex items-center justify-between">
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          View all
        </Link>
        
        {hasNextPage && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLoadMore}
            disabled={isLoading}
            className="h-7 text-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Loading...
              </>
            ) : (
              'Load more'
            )}
          </Button>
        )}
      </div>
    </div>
  );
};