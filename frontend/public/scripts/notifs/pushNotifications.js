import { fetchGetUserExpenses, getExpensesByRange, getExpensesDailyStats, getTotalExpensesByRange, getUserExpenses } from "../data/expenses.js";
import { markGoalCompletedNotified, userSavings } from "../data/savings.js";
import { getNotificationStatus, markReminderShown, markTipShown } from "../data/user.js";
import { pushGastooMood } from "../ui/renderMascot.js";
import { pushNotification } from "./notifications.js";

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

  const now = new Date();

  const today = now.toLocaleDateString('sv-SE', {
    timeZone: 'Asia/Manila'
  });

  const hour = Number(
    now.toLocaleString('en-US', {
      timeZone: 'Asia/Manila',
      hour: 'numeric',
      hour12: false
    })
  );

  const getPHDate = (date) => {
    if (!date) return null;

    let utcDate;
    if (typeof date === 'string') {
      const normalized = date.includes('T')
        ? date.endsWith('Z') ? date : date + 'Z'
        : date.replace(' ', 'T') + 'Z';
      utcDate = new Date(normalized);
    } else {
      utcDate = new Date(date);
    }

    if (isNaN(utcDate.getTime())) {
      console.warn('⚠️ Invalid date:', date);
      return null;
    }

    return utcDate.toLocaleDateString('sv-SE', {
      timeZone: 'Asia/Manila'
    });
  };

  const lastTip = getPHDate(notificationStatus?.last_tip_at);
  const lastReminder = getPHDate(notificationStatus?.last_reminder_at);

  console.log({
    today,
    hour,
    lastReminder,
    lastTip,
    reminderAlreadySent: lastReminder === today,
    tipAlreadySent: lastTip === today,
  });

  // Reminder — once per day at 7PM PH, only if no expenses logged
  if (hour >= 19 && todayExpenseCount === 0 && lastReminder !== today) {
    await pushNotification(
      'happy',
      "Don't forget to log!",
      "You haven't added any expenses today. Keep your records accurate!"
    );
    pushGastooMood('happy');
    await markReminderShown();
  }

  // Daily tip — once per day after 8AM PH
  const tips = [
    "Small daily expenses add up fast — log everything, even ₱20 snacks.",
    "Try the 24-hour rule before any non-essential purchase.",
    "Reviewing last week's expenses takes 2 minutes and saves a lot.",
    "A small daily budget is easier to stick to than a large monthly one.",
    "Gastoo tip: savings grow fastest when you pay yourself first.",
    "Try to beat yesterday's spending total — even by ₱10.",
    "Tracking expenses is the first step. The habit makes the difference.",
  ];

  const dayName = now.toLocaleDateString('en-US', {
    timeZone: 'Asia/Manila',
    weekday: 'long'
  });

  const dayIndex = {
    Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
    Thursday: 4, Friday: 5, Saturday: 6
  }[dayName];

  if (lastTip !== today && hour >= 8) {
    await pushNotification('happy', "Gastoo's Tip", tips[dayIndex]);
    pushGastooMood('happy');
    await markTipShown();
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



