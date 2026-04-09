// app/(protected)/farmer/dashboard/_components/notifications/FarmerNotificationList.tsx
'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  Gavel, 
  FileText, 
  Calendar, 
  Bell, 
  CheckCircle2,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useMarkAsRead } from '@/hooks/notifications/useMarkAsRead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRelativeTime } from '@/lib/utils/timeFormatter';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Notification } from '@/types/notification.types';

export const FarmerNotificationList: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();
  
  const { 
    notifications, 
    isLoading, 
    fetchNextPage, 
    hasNextPage 
  } = useNotifications({ 
    userId: user?.id || '',
    enabled: !!user?.id,
    limit: 10
  });

  const { markAsReadAsync, markAllAsReadAsync } = useMarkAsRead(user?.id || '');

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, React.ElementType> = {
      LISTING: Home,
      BID: Gavel,
      LEASE: FileText,
      PAYMENT: TrendingUp,
      APPLICATION: FileText,
      REMINDER: Calendar,
      SYSTEM: Bell,
    };
    return icons[type] || Bell;
  };

  const getNotificationColor = (type: string) => {
    const colors: Record<string, string> = {
      LISTING: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      BID: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      LEASE: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      PAYMENT: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      APPLICATION: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      REMINDER: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      SYSTEM: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsReadAsync(notification.id);
    }

    switch (notification.type) {
      case 'LISTING':
        toast.success('Viewing land listing');
        if (notification.entityId) {
          router.push(`/marketplace/listing/${notification.entityId}`);
        }
        break;
      case 'BID':
        if (notification.entityId) {
          router.push(`/farmer/bids/${notification.entityId}`);
        }
        break;
      case 'LEASE':
        if (notification.entityId) {
          router.push(`/farmer/leases/${notification.entityId}`);
        }
        break;
      case 'PAYMENT':
        if (notification.entityId) {
          router.push(`/farmer/payments/${notification.entityId}`);
        }
        break;
      default:
        if (notification.actionUrl) {
          router.push(notification.actionUrl);
        }
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsReadAsync();
    toast.success('All notifications marked as read');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>Recent Notifications</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="secondary">{unreadCount} new</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleMarkAllRead}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 rounded-full bg-muted p-3">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-xs text-muted-foreground">
                We&apos;ll notify you when there&apos;s activity on your account
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'group cursor-pointer rounded-lg p-3 transition-colors hover:bg-muted/50',
                      !notification.isRead && 'bg-primary/5'
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'rounded-full p-2',
                        getNotificationColor(notification.type)
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            'text-sm font-medium',
                            !notification.isRead && 'font-semibold'
                          )}>
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground/70" />
                          <span className="text-[10px] text-muted-foreground/70">
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {hasNextPage && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => fetchNextPage()}
                >
                  Load more
                </Button>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};