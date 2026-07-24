// components/PushSubscribeButton.tsx
"use client";

import { useState, useEffect } from "react";
import { registerServiceWorker, urlBase64ToUint8Array } from "@/lib/push";
import { saveSubscription, removeSubscription } from "@/app/actions/push";

export default function PushSubscribeButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setIsSupported(false);
      return;
    }

    registerServiceWorker().then(async (reg) => {
      const sub = await reg.pushManager.getSubscription();
      setIsSubscribed(!!sub);
    });
  }, []);

  const subscribe = async () => {
    setLoading(true);
    try {
      const registration = await registerServiceWorker();

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Notification permission denied");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });

      await saveSubscription(subscription.toJSON());
      setIsSubscribed(true);
    } catch (err) {
      console.error("Subscription failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await removeSubscription(subscription.endpoint);
        await subscription.unsubscribe();
      }
      setIsSubscribed(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) {
    return <p className="text-sm text-gray-500">Push notifications aren't supported on this browser.</p>;
  }

  return (
    <button
      onClick={isSubscribed ? unsubscribe : subscribe}
      disabled={loading}
      className={`px-4 py-2 rounded text-white ${
        isSubscribed ? "bg-red-500" : "bg-indigo-600"
      } disabled:opacity-50`}
    >
      {loading
        ? "Please wait..."
        : isSubscribed
        ? "Unsubscribe"
        : "Enable Notifications"}
    </button>
  );
}