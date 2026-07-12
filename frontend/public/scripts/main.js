
import { initLogoutBtn } from './auth/logout.js';
import { initBudgetModal, initSaveBudget } from './budget/budgetActions.js';
import { updateExpensesChart } from './charts/expensesChart.js';
import { API_BASE } from './config.js';
import { getUserExpenses } from './data/expenses.js';
import { getUser, initChangePasswordEdit, initClearDataBtn, initEditProfileBtn, initGreetings, initSaveChangesOnProfileEdit, initSetNewPassword, loadUser } from './data/user.js';
import {initAnalytics, initAnalyticsFilter } from './features/analytics/analytics.js';
import { initToolTipForHeatmap, updateExpenseHeatMap } from './features/analytics/analyticsHeatMap.js';
import { updateBudgetComparisonChart } from './features/analytics/budgetComparisonChart.js';
import {initAddExpense, initAddExpenseNavigator, initCategoryShortcut } from './features/expenses/addExpense.js';

import { initEditExpensesTools } from './features/expenses/initEditExpensesTools.js';
import { renderTotalExpensesHTML } from './features/expenses/totalExpenses.js';
import { getCurrentExpenses, initExpensesFilter, initExpensesPage } from './features/expenses/viewExpense.js';
import { initFeedbackModal } from './features/feedback/feedback.js';
import { initEditGoalModal, initGoal } from './features/savings_goal/goal.js';

import {initTransactionsFilter } from './features/transactions/viewTransactions.js';
import { initDeleteNotification, initUser, renderNotifications, showNotif } from './notifs/notifications.js';
import { checkSpendingTrend, sendDailyNotifications } from './notifs/pushNotifications.js';
import { initDLReportBtn } from './saveData/saveToPDF.js';
import { initializePushNotifications, initNotificationPermissionStatus } from './services/notification.js';
import { loadNotificationPreference } from './settings/settings.js';

import { initNavbar } from './ui/navbar.js';
import { initBudgetTabFilter, renderBudget } from './ui/renderBudget.js';
import { initDateFilter } from './ui/renderDateToday.js';
import { initExpensesTooltip } from './ui/renderExpenses.js';
import { initGastooMessages } from './ui/renderMascot.js';

import { initReceipts } from './ui/renderReceipts.js';
import { renderSavingsHTML } from './ui/renderSavings.js'
import { initAddWithdraw } from './withdrawals/addWithdraw.js';

export async function authFetch(url, options = {}) {

  let res = await fetch(url, {
    ...options,
    credentials:'include',
  })
 
if(res.status === 401) {
  let refresh = await fetch(`${API_BASE}/auth/token`, {
    method: 'POST',
    credentials:'include',
  });

  if(!refresh.ok) {
    window.location.replace('/login.html');
    return res;
  }

    res = await fetch(url, {
      ...options,
      credentials: 'include'
    })
  } 

return res;
}


async function initApp() {
  console.log('App is initializing!')
try {
  let res = await authFetch(`${API_BASE}/app/auth`, {
  method: 'GET',
})

if (!res.ok) {
       console.error('🛑 Authentication failed completely. Exiting initialization.');
       window.location.replace('/login.html');
       return; 
    }

await initUser();
showNotif('existingUser');
await Promise.all([
renderSavingsHTML(),
renderBudget(),
renderTotalExpensesHTML(),
initExpensesPage()
        ]);

 // Navigation & Event Listeners
        initNavbar();
        initDateFilter();
        initExpensesTooltip();
        initEditExpensesTools();

        initAddExpense();
        initCategoryShortcut();
        initAddExpenseNavigator();
        initExpensesFilter();

        initAddWithdraw();

        initBudgetModal();
        initSaveBudget();
        initBudgetTabFilter();

        initTransactionsFilter();

        initGreetings();
        initGastooMessages();

        initGoal();
        initEditGoalModal();

        initLogoutBtn();
        initClearDataBtn();
        initEditProfileBtn();
        initSaveChangesOnProfileEdit();
        initChangePasswordEdit();
        initSetNewPassword();

        initDLReportBtn();

        requestAnimationFrame(loadSecondaryFeatures)

} catch (error) {
  console.error("Initialization crash:", error);
  return window.location.replace('/login.html');
}

}


async function loadSecondaryFeatures() {

    await Promise.all([

        updateExpensesChart(),

        updateBudgetComparisonChart(),

        updateExpenseHeatMap(),

        initAnalytics(),

        initAnalyticsFilter(),

        initReceipts()

    ]);

    initToolTipForHeatmap();

    requestAnimationFrame(loadBackgroundFeatures);

}


async function loadBackgroundFeatures() {

    await sendDailyNotifications();

    await renderNotifications();

    await initFeedbackModal();

    initDeleteNotification();

    const enabled = await loadNotificationPreference();

    if (enabled) {
        await initializePushNotifications();
    }

    initNotificationPermissionStatus();

  
}

initApp();



