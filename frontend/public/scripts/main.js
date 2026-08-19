
import { initLogoutBtn } from './auth/logout.js';
import { initBudgetModal, initSaveBudget } from './budget/budgetActions.js';
import { updateExpensesChart } from './charts/expensesChart.js';
import { API_BASE } from './config.js';
import { getUserExpenses } from './data/expenses.js';
import { userSavings } from './data/savings.js';
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

function showAppLoader() {
    document.querySelector(".app-loader").classList.remove("hidden");
    document.querySelector(".app-container").classList.add("hidden");
}

function hideAppLoader() {

    const loader = document.querySelector(".app-loader");

    loader.classList.add("fade-out");

    setTimeout(() => {

        loader.classList.add("hidden");
        loader.classList.remove("fade-out");

        document.querySelector(".app-container").classList.remove("hidden");

    },350);

}

let isRefreshing = false;
let refreshPromise = null;

export async function authFetch(url, options = {}) {

  let res = await fetch(url, {
    ...options,
    credentials: 'include',
  })

  if (res.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = (async () => {
        try {
          let refresh = await fetch(`${API_BASE}/auth/token`, {
            method: 'POST',
            credentials: 'include',
          });
          return refresh.ok;
        } catch {
          return false;
        } finally {
          isRefreshing = false;
        }
      })();
    }

    const refreshOk = await refreshPromise;

    if (!refreshOk) {
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

  const reloadKey = 'gastoo_init_attempts';
  const now = Date.now();
  let attempts = JSON.parse(sessionStorage.getItem(reloadKey) || '{"count":0,"first":0}');

  if (now - attempts.first > 10000) {
    attempts = { count: 1, first: now };
  } else {
    attempts.count++;
  }
  sessionStorage.setItem(reloadKey, JSON.stringify(attempts));

  if (attempts.count > 3) {
    console.error('🛑 Reload loop detected. Clearing state and redirecting to login.');
    sessionStorage.removeItem(reloadKey);
    window.location.replace('/login');
    return;
  }

  showAppLoader()
try {
  let res = await authFetch(`${API_BASE}/app/auth`, {
  method: 'GET',
})

if (!res.ok) {
       console.error('🛑 Authentication failed completely. Exiting initialization.');
       sessionStorage.removeItem(reloadKey);
       window.location.replace('/login.html');
       return; 
    }

sessionStorage.removeItem(reloadKey);


await initUser();
showNotif('existingUser');


await Promise.all([
renderSavingsHTML(),
renderBudget(),
renderTotalExpensesHTML(),
initExpensesPage()
        ]);

hideAppLoader()

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

       await loadSecondaryFeatures()


       
} catch (error) {
  console.error("Initialization crash:", error);
  sessionStorage.removeItem(reloadKey);
  return window.location.replace('/login.html');
}

}


async function loadSecondaryFeatures() {

    await Promise.all([

        updateExpensesChart(),

        updateBudgetComparisonChart(),

        updateExpenseHeatMap(),

        initAnalyticsFilter(),

        initReceipts()

    ]);

    initToolTipForHeatmap();

   await loadBackgroundFeatures()

}


async function loadBackgroundFeatures() {
  console.log('Load backround features called');

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



