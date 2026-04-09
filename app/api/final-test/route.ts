// app/api/final-test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/actions/notifications/createNotification';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: session.userId },
      select: { id: true, role: true, name: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { scenario } = body;

    const results = [];

    // Test Scenario 1: Basic Notification
    if (scenario === 'basic' || scenario === 'all') {
      const result = await createNotification({
        userId: user.id,
        type: 'SYSTEM',
        title: '✅ Test 1: Basic Notification',
        message: 'This is a basic system notification.',
        actionUrl: '/dashboard',
        priority: 'LOW',
      });
      results.push({ scenario: 'basic', result });
    }

    // Test Scenario 2: High Priority
    if (scenario === 'priority' || scenario === 'all') {
      const result = await createNotification({
        userId: user.id,
        type: 'SYSTEM',
        title: '🚨 Test 2: High Priority Alert',
        message: 'This is an important notification that requires attention!',
        actionUrl: '/dashboard',
        priority: 'HIGH',
      });
      results.push({ scenario: 'priority', result });
    }

    // Test Scenario 3: Listing Notification (if farmer)
    if ((scenario === 'listing' || scenario === 'all') && user.role === 'FARMER') {
      const result = await createNotification({
        userId: user.id,
        type: 'LISTING',
        title: '🌾 Test 3: New Land Listing',
        message: 'A new 5-acre farm land is available in your area.',
        actionUrl: '/marketplace',
        entityType: 'LISTING',
        entityId: 'test-listing-' + Date.now(),
        priority: 'MEDIUM',
      });
      results.push({ scenario: 'listing', result });
    }

    // Test Scenario 4: Application Notification (if landowner)
    if ((scenario === 'application' || scenario === 'all') && user.role === 'LANDOWNER') {
      const result = await createNotification({
        userId: user.id,
        type: 'APPLICATION',
        title: '📋 Test 4: New Application',
        message: 'A farmer has applied for your land listing.',
        actionUrl: '/landowner/applications',
        entityType: 'APPLICATION',
        entityId: 'test-app-' + Date.now(),
        priority: 'MEDIUM',
      });
      results.push({ scenario: 'application', result });
    }

    // Test Scenario 5: Bid Notification
    if (scenario === 'bid' || scenario === 'all') {
      const result = await createNotification({
        userId: user.id,
        type: 'BID',
        title: '🔨 Test 5: Bid Update',
        message: user.role === 'FARMER' 
          ? 'You have been outbid on a land listing!'
          : 'A new bid was placed on your land listing!',
        actionUrl: user.role === 'FARMER' ? '/farmer/bids' : '/landowner/listings',
        entityType: 'BID',
        entityId: 'test-bid-' + Date.now(),
        priority: 'HIGH',
      });
      results.push({ scenario: 'bid', result });
    }

    // Test Scenario 6: Payment Notification
    if (scenario === 'payment' || scenario === 'all') {
      const result = await createNotification({
        userId: user.id,
        type: 'PAYMENT',
        title: '💰 Test 6: Payment ' + (user.role === 'FARMER' ? 'Reminder' : 'Received'),
        message: user.role === 'FARMER'
          ? 'Your lease payment of ₹5,000 is due in 3 days.'
          : 'You received a payment of ₹5,000 for lease #123.',
        actionUrl: user.role === 'FARMER' ? '/farmer/payments' : '/landowner/payments',
        entityType: 'PAYMENT',
        entityId: 'test-payment-' + Date.now(),
        priority: 'MEDIUM',
      });
      results.push({ scenario: 'payment', result });
    }

    // Test Scenario 7: Reminder
    if (scenario === 'reminder' || scenario === 'all') {
      const result = await createNotification({
        userId: user.id,
        type: 'REMINDER',
        title: '⏰ Test 7: Reminder',
        message: 'Your lease agreement needs to be signed by tomorrow.',
        actionUrl: '/dashboard',
        priority: 'MEDIUM',
      });
      results.push({ scenario: 'reminder', result });
    }

    return NextResponse.json({
      success: true,
      user: { id: user.id, role: user.role, name: user.name },
      testsRun: results.length,
      results,
      message: `✅ Final test complete! ${results.length} notifications created. Check your notification bell!`,
    });
  } catch (error) {
    console.error('Final test error:', error);
    return NextResponse.json(
      { error: 'Test failed', details: String(error) },
      { status: 500 }
    );
  }
}