// components/shared/notifications/NotificationPreferences.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  MessageSquare, 
  ArrowLeft,
  Save,
  BellRing,
  Home,
  Gavel,
  CreditCard,
  FileText,
  User,
  Calendar
} from 'lucide-react';
import { useNotificationPreferences } from '@/hooks/notifications/useNotificationPreferences';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { NotificationType } from '@/types/notification.types';

interface NotificationPreferencesProps {
  userId: string;
  userRole: 'FARMER' | 'LANDOWNER' | 'ADMIN';
  onClose: () => void;
}

const notificationTypes: Array<{
  id: NotificationType;
  label: string;
  icon: React.ElementType;
  color: string;
}> = [
  { id: 'LISTING', label: 'Land Listings', icon: Home, color: 'text-green-500' },
  { id: 'BID', label: 'Bids & Auctions', icon: Gavel, color: 'text-amber-500' },
  { id: 'PAYMENT', label: 'Payments', icon: CreditCard, color: 'text-blue-500' },
  { id: 'LEASE', label: 'Lease Updates', icon: FileText, color: 'text-purple-500' },
  { id: 'APPLICATION', label: 'Applications', icon: User, color: 'text-orange-500' },
  { id: 'MESSAGE', label: 'Messages', icon: MessageSquare, color: 'text-cyan-500' },
  { id: 'REMINDER', label: 'Reminders', icon: Calendar, color: 'text-pink-500' },
  { id: 'SYSTEM', label: 'System', icon: Bell, color: 'text-gray-500' },
];

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  userId,
  onClose,
}) => {
  const { preferences, updatePreferences, isLoading } = useNotificationPreferences(userId);
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChannelToggle = (channel: 'email' | 'push' | 'sms') => {
    setLocalPreferences(prev => ({
      ...prev,
      [channel]: !prev[channel],
    }));
    setHasChanges(true);
  };

  const handleTypeToggle = (type: NotificationType, channel: 'email' | 'push' | 'sms') => {
    setLocalPreferences(prev => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: {
          ...prev.types[type],
          [channel]: !prev.types[type][channel],
        },
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await updatePreferences(localPreferences);
      toast.success('Notification preferences saved');
      setHasChanges(false);
    } catch {
      toast.error('Failed to save preferences');
    }
  };

  return (
    <div className="flex h-full flex-col bg-background rounded-lg overflow-hidden">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h3 className="text-sm font-semibold">Notification Preferences</h3>
            <p className="text-xs text-muted-foreground">
              Customize how you receive notifications
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Tabs defaultValue="channels" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="types">Notification Types</TabsTrigger>
          </TabsList>

          <TabsContent value="channels" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Label className="font-medium">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                </div>
                <Switch
                  checked={localPreferences.email}
                  onCheckedChange={() => handleChannelToggle('email')}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BellRing className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Label className="font-medium">Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive real-time push notifications
                    </p>
                  </div>
                </div>
                <Switch
                  checked={localPreferences.push}
                  onCheckedChange={() => handleChannelToggle('push')}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <Label className="font-medium">SMS Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive important updates via SMS
                    </p>
                  </div>
                </div>
                <Switch
                  checked={localPreferences.sms}
                  onCheckedChange={() => handleChannelToggle('sms')}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="types" className="mt-4">
            <div className="space-y-2">
              {notificationTypes.map((type) => (
                <div key={type.id} className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <type.icon className={cn('h-4 w-4', type.color)} />
                    <span className="text-sm font-medium">{type.label}</span>
                  </div>
                  <div className="flex items-center gap-4 ml-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={localPreferences.types[type.id]?.email ?? true}
                        onCheckedChange={() => handleTypeToggle(type.id, 'email')}
                      />
                      <Label className="text-xs">Email</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={localPreferences.types[type.id]?.push ?? true}
                        onCheckedChange={() => handleTypeToggle(type.id, 'push')}
                      />
                      <Label className="text-xs">Push</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={localPreferences.types[type.id]?.sms ?? false}
                        onCheckedChange={() => handleTypeToggle(type.id, 'sms')}
                      />
                      <Label className="text-xs">SMS</Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};