import webpush from 'web-push';
import { deleteSubscription, getSubscriptionsByUser } from '../database/models/subscriptions.js';
import { getNotificationPreference } from '../database/models/users.js';

export const notifyUser = async (userId, title, body) => {
  const subscriptions = await getSubscriptionsByUser(userId);
  const settings = await getNotificationPreference(userId);

  console.log(subscriptions)

  try {
    console.log("Sending notification to:", subscription.endpoint);

    await webpush.sendNotification(subscription, payload);

    console.log("Success");

} catch (err) {
    console.log(err.statusCode);
    console.log(err.body);
}
  if(!settings.notifications_enabled) {
    return;
  }

  const payload = JSON.stringify({ title, body });

  for (const row of subscriptions) {
    const subscription = {
      endpoint: row.endpoint,
      keys: { p256dh: row.p256dh, auth: row.auth }
    };

    try {
      await webpush.sendNotification(subscription, payload); 
    } catch (err) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        await deleteSubscription(row.id);                     
    }
  }
}}