import { fetchGetUserExpenses, getExpensesByRange, getExpensesDailyStats, getTotalExpensesByRange, getUserExpenses } from "../data/expenses.js";
import { markGoalCompletedNotified, userSavings } from "../data/savings.js";
import { getNotificationStatus, markReminderShown, markTipShown } from "../data/user.js";
import { pushGastooMood } from "../ui/renderMascot.js";
import { pushNotification, webPushNotifToUser } from "./notifications.js";

export async function recalculateBudget(dailySpent,dailyBudget,monthlySpent, monthlyBudget) {
  

  const hasDailyBudget = dailyBudget > 0;
  const hasMonthlyBudget = monthlyBudget > 0;

  if (!hasDailyBudget && !hasMonthlyBudget) return;


  const dailyRatio = hasDailyBudget ? dailySpent / dailyBudget : 0;
  const monthlyRatio = hasMonthlyBudget ? monthlySpent / monthlyBudget : 0;

  if (hasDailyBudget && hasMonthlyBudget) {
  if (dailyRatio >= 1 && monthlyRatio >= 1) {
    await pushNotification(
      'worried',
      'Budget exceeded',
      "You've exceeded both your daily and monthly budgets."
    );
    pushGastooMood('bothBudgetExceeded');
    return;
  }

  if (dailyRatio >= 0.7 && monthlyRatio >= 0.7){
    await pushNotification(
    "concerned",
    "Budget warning",
    "You're close to both your daily and monthly limits."
  );
  pushGastooMood('bothBudgetConcerned');
  return;
  }
  }
  
  if (hasDailyBudget) {
   if (dailyRatio >= 1) {
    await pushNotification(
      'worried',
      'Daily budget exceeded',
      `You've gone ₱${(dailySpent - dailyBudget).toFixed(2)} over your daily budget.`
    );

    pushGastooMood('worriedDaily');
    return;
  }
}

  if (hasMonthlyBudget) {
  if (monthlyRatio >= 1) {
    await pushNotification(
      'worried',
      'Monthly budget exceeded',
      `You've gone ₱${(monthlySpent - monthlyBudget).toFixed(2)} over your monthly budget.`
    );
    pushGastooMood('worriedMonthly');
    return;
  }
  }

  
  if (hasDailyBudget) {
  if (dailyRatio >= 0.7) {
    await pushNotification(
      'concerned',
      'Daily budget alert',
      `You've used ${Math.round(dailyRatio * 100)}% of today's budget.`
    );
    pushGastooMood('concernedDaily');
    return;
  }
  }

  if (hasMonthlyBudget) {
  if (monthlyRatio >= 0.7) {
    await pushNotification(
      'concerned',
      'Monthly budget alert',
      `You've used ${Math.round(monthlyRatio * 100)}% of monthly budget.`
    );
    pushGastooMood('concernedMonthly');
    return;
  }
}
}

export async function checkSpendingTrend(){

  const expensesData = {
    last7: await getTotalExpensesByRange('previous7'),
    today: await getTotalExpensesByRange('today')
  }

  if(!expensesData?.last7?.success || !expensesData?.today?.success) return; 
  
  const totalLast7 = expensesData.last7.expenses
  const expensesToday  = expensesData.today.expenses


  if(totalLast7 == null || expensesToday == null) return;

  const rollingAvg7day = totalLast7 / 7;;

  if(rollingAvg7day === 0) return;
  calculateSpendingTrend(expensesToday, rollingAvg7day)
}

async function calculateSpendingTrend(todaySpend, rollingAvg7day) {
  const delta = (rollingAvg7day - todaySpend) / rollingAvg7day;

  if (delta >= 0.30) {
   await pushNotification('excited',"You're spending way less!",`Today's spending is ${Math.round(delta * 100)}% below your weekly average. Gastoo is proud!`,
  );
     pushGastooMood('excited')
  } else if (delta >= 0.10) {
    await pushNotification(
   'happy',
   'Spending looking good',
   `You're ${Math.round(delta * 100)}% below your usual daily spend today.`,
    );
   pushGastooMood('happy'); 
  } else if (delta <= -0.30) {
    await pushNotification(
      'worried',
       'Spending a lot today',
      `Today's spending is ${Math.round(Math.abs(delta) * 100)}% above your weekly average.`,
    );
    pushGastooMood('worriedDaily')

  } else if (delta <= -0.10) {
    await pushNotification(
      'concerned',
      'Spending a bit high',
       `You're ${Math.round(Math.abs(delta) * 100)}% above your usual daily spend. Watch it!`,
    );
    pushGastooMood('concernedDaily')
  }
}

export async function checkSavingsMilestone() {
  const savings = await userSavings();
  if (!savings?.success) return;

  if (Number(savings.goalCompleted) === 1) return;

  const currentSaved = Number(savings.money);
  const goal  = Number(savings.targetAmount);
   
  if (isNaN(currentSaved) || isNaN(goal) || goal <= 0) return;

  await calculateSavingsMilestone(currentSaved, goal)
}

async function calculateSavingsMilestone(currentSaved, goal) {

  const ratio = currentSaved / goal

  if (ratio >= 1) {
    await pushNotification(
      "excited",
      "🎉 Savings goal reached!",
      `You hit your ₱${goal.toFixed(2)} goal! Time to set a new one.`,
    );
    pushGastooMood('excited')
    await markGoalCompletedNotified()
  } else if (ratio >= 0.75) {
    await pushNotification(
      "excited",
      "75% of your goal reached!",
      `₱${currentSaved.toFixed(2)} saved so far. Keep going!`
    );
    pushGastooMood('excited');

  } else if (ratio >= 0.50) {
    await pushNotification(
      "excited",
      "50% of your goal reached!",
      `₱${currentSaved.toFixed(2)} saved so far. Keep going!`
    );
    pushGastooMood('excited')
  } else if (ratio >= 0.25) {
   await pushNotification(
      "excited",
      "25% of your goal reached!",
      `₱${currentSaved.toFixed(2)} saved so far. Keep going!`
    );
    pushGastooMood('excited')
  }
}

 async function initDailyNotifications(todayExpenseCount, notificationStatus) {
 const today = new Date().toLocaleDateString('sv');

 const hour = new Date().getHours();
 const lastReminderDate = notificationStatus?.data?.last_reminder_date;
  const rawTipDate = notificationStatus?.data?.last_tip_date; 
 
 const lastTip = rawTipDate? new Date(rawTipDate).toLocaleDateString('sv') : null;
 const lastReminder = lastReminderDate? new Date(lastReminderDate).toLocaleDateString('sv') : null;

 if(hour >= 19 && todayExpenseCount === 0 && lastReminder !== today) {
  
   await pushNotification(
      'happy',
      "Don't forget to log!",
      "You haven't added any expenses today. Keep your records accurate!",
    );
  
  await webPushNotifToUser("Don't forget to log!", "You haven't added any expenses today. Keep your records accurate!")


    pushGastooMood('happy')
   
    await markReminderShown();

  }
    const tips = [
    "Small daily expenses add up fast — log everything, even ₱20 snacks.",
    "Try the 24-hour rule before any non-essential purchase.",
    "Reviewing last week's expenses takes 2 minutes and saves a lot.",
    "A small daily budget is easier to stick to than a large monthly one.",
    "Gastoo tip: savings grow fastest when you pay yourself first.",
    "Try to beat yesterday's spending total — even by ₱10.",
    "Tracking expenses is the first step. The habit makes the difference.",
  ];
  const tip = tips[new Date().getDay()];


  if(lastTip !== today) {
    await pushNotification(
        'happy',
        "Gastoo's Tip",
        tip,
      );

    await webPushNotifToUser("Gastoo's Tip", tip);
   pushGastooMood('happy'); 
     await markTipShown()
  }
 }
 
export async function sendDailyNotifications() {
  const stats = await getExpensesDailyStats();
  const notificationStatus = await getNotificationStatus();

  if (!stats?.success || !notificationStatus.success) return;

   await initDailyNotifications(Number(stats.data.todayExpenseCount), notificationStatus.data);
}

export async function checkStreakNotifications(currentStreak) {

    if (currentStreak === 3) {
        await pushNotification(
            'excited',
            '3-day streak! 🔥',
            "You've logged expenses 3 days in a row. Gastoo loves the consistency!"
        );
        pushGastooMood('happy')
      }

    if (currentStreak === 7) {
       await pushNotification(
            'excited',
            'One full week! 🏆',
            "7 days of logging in a row. You're building a real habit!"
        );
          pushGastooMood('happy')
    }
}



