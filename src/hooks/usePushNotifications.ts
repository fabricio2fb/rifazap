'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function usePushNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then(async (sub) => {
          if (sub) {
            setSubscription(sub);
            setIsSubscribed(true);
            // Sync with DB on load to ensure the current user is linked
            await syncWithDatabase(sub);
          }
        });
      });
    }
  }, []);

  const syncWithDatabase = async (sub: PushSubscription) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Upsert based on the endpoint to avoid duplicates but update user_id
      const { error } = await supabase.from('push_subscriptions').upsert({
        user_id: user.id,
        subscription: JSON.parse(JSON.stringify(sub))
      }, { onConflict: 'subscription' });
      // Note: We'll use insert if upsert fails again, but ideally they ran the SQL for the index

      if (error) {
        console.warn('Sync error (probably constraint missing, trying insert):', error);
        await supabase.from('push_subscriptions').insert({
          user_id: user.id,
          subscription: JSON.parse(JSON.stringify(sub))
        });
      }
    } catch (e) {
      console.error('Error syncing subscription with DB:', e);
    }
  };

  const subscribeUser = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error('VAPID Public Key not found in environment');
      }

      let sub = await registration.pushManager.getSubscription();

      if (!sub) {
        sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey)
        });
      }

      await syncWithDatabase(sub);

      setSubscription(sub);
      setIsSubscribed(true);
      return sub;
    } catch (error) {
      console.error('Failed to subscribe to push notifications', error);
      throw error;
    }
  };

  return { isSubscribed, subscription, subscribeUser };
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
