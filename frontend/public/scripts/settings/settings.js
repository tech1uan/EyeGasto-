import { API_BASE } from "../config.js";
import { authFetch } from "../main.js";
import { initializePushNotifications, unsubscribePushNotifications } from "../services/notification.js";

const notificationToggle =
    document.getElementById("notification-toggle");

export async function loadNotificationPreference() {

    try {

        const res = await authFetch(
            `${API_BASE}/settings/notifications`
        );

        const data = await res.json();

        notificationToggle.checked = data.enabled;

        return data.enabled;
    }

    catch(err){

        console.error(err);

    }

}

notificationToggle.addEventListener(
    "change",
    async () => {

        try {

            if(notificationToggle.checked){

                if(Notification.permission === "default"){

                    const permission =
                        await Notification.requestPermission();

                    if(permission !== "granted"){

                        notificationToggle.checked = false;

                        return;

                    }

                }

                else if(Notification.permission === "denied"){

                    alert(
                        "Notifications are blocked in your browser."
                    );

                    notificationToggle.checked = false;
                   
                    return;

                }

                await initializePushNotifications();

            } else {
                 await unsubscribePushNotifications();
            }

            await authFetch(

                `${API_BASE}/settings/notifications`,

                {

                    method:"PATCH",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body:JSON.stringify({

                        enabled:
                            notificationToggle.checked

                    })

                }

            )

        }

        catch(err){

            console.error(err);

        }

    }
);