// Runs whenever a push notification is received
self.addEventListener("push", (event) => {

    // If there's no data, stop.
    if (!event.data) return;

    // Convert the JSON payload sent by the server
    const data = event.data.json();

    // Keep the service worker alive until the notification is shown
    event.waitUntil(

        self.registration.showNotification(data.title, {
            body: data.body,

            // Optional
            icon: "/images/gastoo-logo.png",

            badge: "/images/gastoo-logo.png",

            tag: "gastoo-notification",

            renotify: true,

            data: {
                url: "/"
            }
        })

    );

});


// Runs when the user clicks the notification
self.addEventListener("notificationclick", (event) => {

    // Close notification
    event.notification.close();

    // Open the website
    event.waitUntil(

        clients.openWindow(event.notification.data.url)

    );

});