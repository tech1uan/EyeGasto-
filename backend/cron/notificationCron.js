import cron from "node-cron";
import { getAllUsers } from "../database/models/users.js";
import { getDailyStats } from "../database/models/expenses.js";
import { notifyUser } from "../services/pushNotification.js";

export async function startNotificationCron() {
   

    cron.schedule("0 19 * * *", async () => {
       
        const users = await getAllUsers();

        for(const user of users) {
            const stats = await getDailyStats(user.id);

            if(stats.todayExpenseCount === 0) {

                await notifyUser(user.id, "Dont forget to log!", "You haven't added any expenses today.");
            }
        }
            }, {
                timezone: "Asia/Manila"
            })


     const tips = [
            "Small daily expenses add up fast — log everything, even ₱20 snacks.",
            "Try the 24-hour rule before any non-essential purchase.",
            "Reviewing last week's expenses takes 2 minutes and saves a lot.",
            "A small daily budget is easier to stick to than a large monthly one.",
            "Gastoo tip: savings grow fastest when you pay yourself first.",
            "Try to beat yesterday's spending total — even by ₱10.",
            "Tracking expenses is the first step. The habit makes the difference."
        ];

    cron.schedule("0 8 * * *", async() => {
        const users = await getAllUsers();
        
        const randomTip = tips[Math.floor(Math.random() * tips.length)];

        for(const user of users) {
            await notifyUser(user.id,  "💡 Gastoo's Daily Tip", randomTip)
        }
    }, {
        timezone: "Asia/Manila"
    })
}