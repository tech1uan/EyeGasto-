import { fetchGetUserExpenses, getExpensesByRange, getExpensesDailyStats, getTotalExpensesByRange, getUserExpenses } from "../data/expenses.js";
import { markGoalCompletedNotified, userSavings } from "../data/savings.js";
import { getNotificationStatus, markFeatureTipShown, markReminderShown, markTipShown } from "../data/user.js";
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

  const lastTip = getPHDate(notificationStatus?.data?.last_tip_at);
  const lastReminder = getPHDate(notificationStatus?.data?.last_reminder_at);

  console.log("Today:", today);
  console.log("Hour:", hour);
  console.log("Expense Count:", todayExpenseCount);
  console.log("Last Tip:", lastTip);
  console.log("Last Reminder:", lastReminder);

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

  // Feature tips + trivia — once per day after 9AM PH
  const featureTips = [
    { title: "Savings Goal", body: "You can set a savings goal with a target amount. Go to the savings section and tap 'Set Goal' to start tracking your progress." },
    { title: "Dual Budgets", body: "You can set both daily and monthly budgets. Daily budgets help you control day-to-day spending while monthly budgets give the big picture." },
    { title: "Edit Expenses", body: "Tap any expense card to edit it. You can change the amount, category, or description — or delete it entirely." },
    { title: "Analytics Filters", body: "Try switching between 7D, 1M, 6M, and ALL in the analytics section to see how your spending changes over different periods." },
    { title: "PDF Export", body: "You can export your expenses as a PDF report. Go to your profile and look for the export option." },
    { title: "Category Breakdown", body: "The donut chart in analytics shows exactly where your money goes. Tap on a category to see how much you spent on it." },
    { title: "Budget Chart", body: "The bar chart in analytics compares your weekly spending against your monthly budget. Each bar represents one week." },
    { title: "Spending Heatmap", body: "The heatmap in analytics shows your spending intensity across the year. Darker squares mean higher spending." },
    { title: "Why Gastoo?", body: "Gastoo was built because Juan, the creator, struggled with managing his own finances. He built this app to help himself — and now it helps you too." },
    { title: "The Name", body: "'Gastoo' comes from the Filipino word 'gastos' meaning expenses. A fun twist on a word every Filipino knows." },
    { title: "AI Insights", body: "Gastoo uses AI to analyze your spending patterns and generate personalized tips just for you." },
    { title: "Small Expenses", body: "Tracking even small expenses like ₱20 snacks can reveal surprising patterns. Those small amounts add up fast." },
    { title: "Weekly Review", body: "Reviewing your spending weekly takes just 2 minutes but can save you thousands over time. Try checking analytics every Sunday." },
    { title: "Pay Yourself First", body: "Before spending on wants, set aside money for savings. Even ₱50 per day adds up to ₱18,250 in a year!" },
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

  // Feature tip + trivia — once per day after 9AM PH
  const lastFeatureTip = getPHDate(notificationStatus?.data?.last_feature_tip_at);
  if (lastFeatureTip !== today && hour >= 9) {
    const tipIndex = Math.floor(Math.random() * featureTips.length);
    const tip = featureTips[tipIndex];
    await pushNotification('happy', `Did you know? — ${tip.title}`, tip.body);
    pushGastooMood('happy');
    await markFeatureTipShown();
  }
}
 
export async function sendDailyNotifications() {

    console.log("===== sendDailyNotifications =====");

    const stats = await getExpensesDailyStats();
    const notificationStatus = await getNotificationStatus();

      console.log(stats);
      console.log(notificationStatus);

    if (!stats?.success || !notificationStatus.success) return;

  
    await initDailyNotifications(
        Number(stats.data.todayExpenseCount),
        notificationStatus.data
    );
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



