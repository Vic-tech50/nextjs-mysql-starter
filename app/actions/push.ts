// app/actions/push.ts
"use server";

import webpush from "web-push"; //npm install web-push
//npm install -D @types/web-push

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// ⚠️ Replace with your DB — in-memory storage is just for demo purposes
// and will NOT persist across server restarts or serverless invocations.
const subscriptions: PushSubscriptionJSON[] = [];

export async function saveSubscription(subscription: PushSubscriptionJSON) {
  const exists = subscriptions.some((s) => s.endpoint === subscription.endpoint);
  if (!exists) subscriptions.push(subscription);

  // ✅ TODO: persist to DB, linked to the logged-in user
  // await db.pushSubscription.upsert({ where: { endpoint: subscription.endpoint }, ... })

  return { success: true };
}

export async function removeSubscription(endpoint: string) {
  const index = subscriptions.findIndex((s) => s.endpoint === endpoint);
  if (index > -1) subscriptions.splice(index, 1);

  // ✅ TODO: delete from DB

  return { success: true };
}

export async function sendNotificationToAll(payload: {
  title: string;
  body: string;
  url?: string;
}) {
  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        sub as webpush.PushSubscription,
        JSON.stringify(payload)
      )
    )
  );

  // clean up subscriptions that are no longer valid (410 Gone / 404)
  results.forEach((result, i) => {
    if (
      result.status === "rejected" &&
      (result.reason?.statusCode === 410 || result.reason?.statusCode === 404)
    ) {
      subscriptions.splice(i, 1);
    }
  });

  return { sent: results.filter((r) => r.status === "fulfilled").length };
}