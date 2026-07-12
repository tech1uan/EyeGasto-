import { API_BASE } from "../config.js";
import { authFetch } from "../main.js";

// Backend routes
const VAPID_PUBLIC_KEY_URL = "/subscriptions/vapid-public-key";
const SUBSCRIBE_URL = "/subscriptions/subscribe";


// Call this after the user logs in
export async function initializePushNotifications() {

    // Browser doesn't support Service Workers
    if (!("serviceWorker" in navigator)) {
        console.log("Service Workers are not supported.");
        return;
    }

    // Browser doesn't support Push API
    if (!("PushManager" in window)) {
        console.log("Push Notifications are not supported.");
        return;
    }

    try {

        // Register the Service Worker
        const registration = await navigator.serviceWorker.register("/serviceWorker.js");

        console.log("Service Worker registered.");

        // Already subscribed?
        let subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            console.log("Already subscribed.");
            return;
        }

        // Ask permission
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {

            console.log("Notification permission denied.");

            return;

        }

        // Get public key from Express
        const res = await authFetch(`${API_BASE}/VAPID_PUBLIC_KEY_URL`, {
        });
        const result = await res.json();
        // Create browser subscription
        subscription = await registration.pushManager.subscribe({

            userVisibleOnly: true,

            applicationServerKey: urlBase64ToUint8Array(result.key)

        });

    
        await authFetch(`${API_BASE}SUBSCRIBE_URL`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(subscription)

        });

        console.log("Browser subscribed successfully.");

    } catch (err) {

        console.error(err);

    }

}


// Converts VAPID key into Uint8Array
function urlBase64ToUint8Array(base64String) {

    const padding = "=".repeat((4 - base64String.length % 4) % 4);

    const base64 = (base64String + padding)

        .replace(/-/g, "+")

        .replace(/_/g, "/");

    const rawData = window.atob(base64);

    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {

        outputArray[i] = rawData.charCodeAt(i);

    }

    return outputArray;

}

export function initNotificationPermissionStatus() {

    const status = document.getElementById("notification-status");
    const helper = document.getElementById("notification-helper");

    if (!status || !helper) return;

    switch (Notification.permission) {

        case "granted":

            status.textContent = "Allowed";

            status.className =
                "text-xs px-2 py-1 rounded-full bg-green-500/15 text-green-400";

            helper.classList.add("hidden");

            break;

        case "default":

            status.textContent = "Not Configured";

            status.className =
                "text-xs px-2 py-1 rounded-full bg-yellow-500/15 text-yellow-400";

            helper.classList.add("hidden");

            break;

        case "denied":

            status.textContent = "Blocked";

            status.className =
                "text-xs px-2 py-1 rounded-full bg-red-500/15 text-red-400";

            helper.classList.remove("hidden");

            break;

    }

}

export async function unsubscribePushNotifications() {

        const registration = await navigator.serviceWorker.getRegistration();

        if (!registration) {
            console.log("No service worker registration found.");
            return;
        }

    const subscription =
        await registration.pushManager.getSubscription();

    if (!subscription) {
    
        return;
    }

    const res = await authFetch(`${API_BASE}/subscriptions/unsubscribe`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            endpoint: subscription.endpoint
        })
    });


    await subscription.unsubscribe();

}