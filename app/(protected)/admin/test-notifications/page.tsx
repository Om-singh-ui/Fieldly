// app/(protected)/admin/test-notifications/page.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { 
  Bell, 
  Users, 
  Sprout, 
  Home, 
  Send,
  Loader2,
  CheckCircle2
} from 'lucide-react';

const NOTIFICATION_TYPES = [
  { value: 'SYSTEM', label: 'System' },
  { value: 'LISTING', label: 'Listing' },
  { value: 'BID', label: 'Bid' },
  { value: 'LEASE', label: 'Lease' },
  { value: 'PAYMENT', label: 'Payment' },
  { value: 'APPLICATION', label: 'Application' },
  { value: 'MESSAGE', label: 'Message' },
  { value: 'REMINDER', label: 'Reminder' },
  { value: 'REVIEW', label: 'Review' },
] as const;

interface NotificationResult {
  success: boolean;
  count: number;
  usersNotified: number;
  message: string;
}

export default function TestNotificationsPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    target: 'all' as 'all' | 'farmers' | 'landowners' | 'single',
    title: '🚀 New Feature Alert!',
    message: 'We\'ve just launched real-time notifications. Stay updated with instant alerts!',
    type: 'SYSTEM',
    actionUrl: '/dashboard',
    userId: '',
  });
  const [result, setResult] = useState<NotificationResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test/send-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        toast.success(data.message);
      } else {
        toast.error(data.error || 'Failed to send notifications');
      }
    } catch {
      toast.error('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTest = async (target: 'all' | 'farmers' | 'landowners') => {
    setFormData(prev => ({ ...prev, target }));
    
    const testData = {
      target,
      title: `🧪 Test Notification - ${target}`,
      message: `This is a test notification sent to ${target}. Real-time notifications are working perfectly!`,
      type: 'SYSTEM',
      actionUrl: '/dashboard',
    };

    setLoading(true);
    
    try {
      const response = await fetch('/api/test/send-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        toast.success(data.message);
      } else {
        toast.error(data.error || 'Failed to send notifications');
      }
    } catch {
      toast.error('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Test Notification System</h1>
      </div>

      {/* Quick Test Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleQuickTest('all')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">All Users</p>
                <p className="text-sm text-muted-foreground">Send to everyone</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleQuickTest('farmers')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <Sprout className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold">Farmers Only</p>
                <p className="text-sm text-muted-foreground">Send to all farmers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleQuickTest('landowners')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-full">
                <Home className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold">Landowners Only</p>
                <p className="text-sm text-muted-foreground">Send to all landowners</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Test Form */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Notification Test</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Target Audience</Label>
                <RadioGroup
                  value={formData.target}
                  onValueChange={(value: 'all' | 'farmers' | 'landowners' | 'single') => 
                    setFormData(prev => ({ ...prev, target: value }))
                  }
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All Users</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="farmers" id="farmers" />
                    <Label htmlFor="farmers">Farmers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="landowners" id="landowners" />
                    <Label htmlFor="landowners">Landowners</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="single" id="single" />
                    <Label htmlFor="single">Single User</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.target === 'single' && (
                <div>
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    placeholder="Enter user ID"
                    value={formData.userId}
                    onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="type">Notification Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTIFICATION_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Notification title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Notification message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="actionUrl">Action URL (optional)</Label>
                <Input
                  id="actionUrl"
                  placeholder="/dashboard or /marketplace"
                  value={formData.actionUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, actionUrl: e.target.value }))}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Test Notification
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">Notification Sent Successfully!</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Users Notified:</strong> {result.usersNotified}</p>
              <p><strong>Notifications Created:</strong> {result.count}</p>
              <p><strong>Message:</strong> {result.message}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}