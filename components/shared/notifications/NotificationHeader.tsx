// components/shared/notifications/NotificationHeader.tsx
'use client';

import React from 'react';
import { CheckCheck, Settings, X, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllRead: () => void;
  onPreferencesClick: () => void;
  onClose: () => void;
  userRole: 'FARMER' | 'LANDOWNER' | 'ADMIN';
  className?: string;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  unreadCount,
  onMarkAllRead,
  onPreferencesClick,
  onClose,
  userRole,
  className,
}) => {
  const roleColors = {
    FARMER: 'bg-gradient-to-r from-green-500/10 to-green-600/10',
    LANDOWNER: 'bg-gradient-to-r from-blue-500/10 to-blue-600/10',
    ADMIN: 'bg-gradient-to-r from-purple-500/10 to-purple-600/10',
  };

  return (
    <div className={cn('border-b border-border p-4', roleColors[userRole], className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllRead}
              className="h-8 w-8 p-0"
              title="Mark all as read"
            >
              <CheckCheck className="h-4 w-4" />
              <span className="sr-only">Mark all as read</span>
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="More options"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onPreferencesClick}>
                <Settings className="mr-2 h-4 w-4" />
                Notification settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onMarkAllRead}>
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark all as read
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            title="Close"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>
    </div>
  );
};