// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// Define the webhook secret
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  try {
    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error: Missing Svix headers', {
        status: 400,
      });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret
    const wh = new Webhook(webhookSecret);

    let evt: WebhookEvent;

    try {
      // Verify the webhook payload
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response('Error: Invalid signature', {
        status: 400,
      });
    }

    const eventType = evt.type;

    // Handle different webhook events
    switch (eventType) {
      case 'user.created':
        const { id, email_addresses, first_name, last_name, image_url, created_at } = evt.data;
        
        const primaryEmail = email_addresses.find(email => email.id === evt.data.primary_email_address_id)?.email_address ||
                            email_addresses[0]?.email_address;

        // Create a combined name from first_name and last_name
        const fullName = [first_name, last_name].filter(Boolean).join(' ').trim() || 'User';

        // Create user in your database
        await prisma.user.create({
          data: {
            id: id,
            clerkUserId: id, // Store Clerk user ID
            email: primaryEmail || '',
            name: fullName, // Using name field from your schema
            imageUrl: image_url,
            role: undefined, // Set role as undefined initially
            isOnboarded: false,
            onboardingStep: 0,
            createdAt: new Date(created_at),
            updatedAt: new Date(),
          },
        });

        console.log(`User created: ${id} (${primaryEmail})`);
        break;

      case 'user.updated':
        // Update user in your database
        const { id: userId, first_name: updatedFirstName, last_name: updatedLastName, image_url: updatedImageUrl } = evt.data;

        // Create a combined name from updated first_name and last_name
        const updatedFullName = [updatedFirstName, updatedLastName].filter(Boolean).join(' ').trim() || 'User';

        await prisma.user.update({
          where: { id: userId },
          data: {
            name: updatedFullName, // Using name field from your schema
            imageUrl: updatedImageUrl,
            updatedAt: new Date(),
          },
        });

        console.log(`User updated: ${userId}`);
        break;

      case 'user.deleted':
        // Delete user from your database
        const deletedUserId = evt.data.id;
        
        await prisma.user.delete({
          where: { id: deletedUserId },
        });

        console.log(`User deleted: ${deletedUserId}`);
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return new Response('Webhook received', { status: 200 });
  } catch (error) {
    console.error('Error in webhook handler:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

// Add a GET method for testing (optional)
export async function GET() {
  return new Response('Clerk webhook endpoint is active', { status: 200 });
}