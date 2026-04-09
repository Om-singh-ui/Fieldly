// lib/pusher/client.ts
import Pusher from "pusher-js";

let pusherClient: Pusher | null = null;

export const getPusherClient = () => {
  if (!pusherClient) {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!key || !cluster) {
      throw new Error("Pusher credentials not configured");
    }

    pusherClient = new Pusher(key, {
      cluster,
      forceTLS: true,
      authEndpoint: "/api/pusher/auth", // Add this line
      auth: {
        headers: {
          // Clerk will automatically add auth headers
        },
      },
    });
  }

  return pusherClient;
};
