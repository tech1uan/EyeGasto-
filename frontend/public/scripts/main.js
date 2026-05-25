
import { initLogoutBtn } from './auth/logout.js';
import { initSetBudgetModal } from './budget/addBudget.js';
import { updateExpensesChart } from './charts/expensesChart.js';
import { getUserExpenses } from './data/expenses.js';
import { getUser, loadUser } from './data/user.js';
import {initAddExpense, initAddExpenseOption } from './features/expenses/addExpense.js';

import { initEditExpensesTools } from './features/expenses/initEditExpensesTools.js';
import { renderTotalExpensesHTML } from './features/expenses/totalExpenses.js';
import { getCurrentExpenses, initExpensesFilter, initExpensesPage } from './features/expenses/viewExpense.js';
import {initTransactionsFilter } from './features/transactions/viewTransactions.js';
import { initUser, showNotif } from './notifs/notifications.js';
import { initDLReportBtn } from './saveData/saveToPDF.js';
import { initNavbar } from './ui/navbar.js';
import { renderBudget } from './ui/renderBudget.js';
import { initDateFilter } from './ui/renderDateToday.js';
import { initExpensesTooltip, renderExpensesHTML } from './ui/renderExpenses.js';
import { initGastooMessages, initGreetings } from './ui/renderMascot.js';

import { initReceipts } from './ui/renderReceipts.js';
import { renderSavingsHTML } from './ui/renderSavings.js'
import {initAddWithdraw, initAddWithdrawOption } from './withdrawals/addWithdraw.js';
 

export async function authFetch(url, options = {}) {
  console.log(`[AUTH FETCH] → ${options.method || 'GET'} ${url}`);

  let res = await fetch(url, {
    ...options,
    credentials:'include',
  })
 
if(res.status === 401) {
    console.warn(`[AUTH ERROR] 401 from → ${url}`);
  let refresh = await fetch('/auth/token', {
    method: 'POST',
    credentials:'include',
  });

  if(!refresh.ok) {
    window.location.href = '/login'
    return;
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
  let res = await authFetch('/app/auth', {
  method: 'GET',
})

if(!res.ok) {
   console.log('Token not refreshed!')
  return window.location.href = '/login'
}

await initUser();
showNotif('existingUser');
renderSavingsHTML();
initExpensesPage();
renderExpensesHTML();
updateExpensesChart();
renderBudget();
renderTotalExpensesHTML();
initReceipts();
initDateFilter();
initEditExpensesTools();
initExpensesTooltip();
initNavbar();
/* initLogoutBtn();
initTransactionsFilter();
initSetBudgetModal();
initAddExpenseOption()
initAddExpense();
initExpensesFilter();
initDLReportBtn();
*/
initGreetings();
initGastooMessages();
} catch (error) {
  console.error(error);
  return window.location.href = '/login'
}

}


document.addEventListener('DOMContentLoaded', initApp);
