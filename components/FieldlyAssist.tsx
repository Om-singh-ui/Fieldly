'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    chatbase?: (...args: unknown[]) => unknown;
    chatbaseUserConfig?: unknown;
  }
}

export default function FieldlyAssist() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.chatbaseUserConfig = {
      user_id: 'guest-user',
      user_hash: '',
      user_metadata: {
        name: 'Guest User',
        email: '',
        company: '',
      },
    };

    if (!document.getElementById('BF4npzUpG00nQ5KuVg-15')) {
      const script = document.createElement('script');
      script.src = 'https://www.chatbase.co/embed.min.js';
      script.id = 'BF4npzUpG00nQ5KuVg-15';
      script.setAttribute('domain', 'www.chatbase.co');
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  return null;
}