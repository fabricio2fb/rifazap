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
        registration.pushManager.getSubscription().then((sub) => {
          setSubscription(sub);
          setIsSubscribed(!!sub);
        });
      });
    }
  }, []);

  const subscribeUser = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      
      if (!publicKey) {
        console.error('VAPID Public Key not found in environment');
        return;
      }

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      const { data: { user } } = await supabase.auth.getUser();
      
      // Armazenar subscrição (usando insert simples para evitar erro de constraint)
      const { error } = await supabase.from('push_subscriptions').insert({
        user_id: user?.id || null,
        subscription: JSON.parse(JSON.stringify(sub))
      });

      if (error) {
        console.error('Supabase error saving subscription:', error);
        throw error;
      }

      setSubscription(sub);
      setIsSubscribed(true);
      return sub;
    } catch (error) {
      console.error('Failed to subscribe to push notifications', error);
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
