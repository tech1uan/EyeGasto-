
import { addMoneyInSavings, withdrawMoneyInSavings } from './data/savings.js';
import { renderSavingsHTML } from './ui/renderSavings.js';
import { showReceipts } from './ui/renderReceipts.js';
import {initAddExpenseOption, initAddExpense} from './features/expenses/addExpense.js';
import {initAddWithdrawOption} from './withdrawals/addWithdraw.js';
import { renderDateTodayHTML } from './ui/renderDateToday.js';
import { initDeleteExpense } from './ui/renderExpenses.js';
import { renderDefaultExpensesHTML } from './ui/renderDefault.js';
import { updateTotalExpenses } from './features/expenses/totalExpenses.js';
import { updateRecentExpenses } from './features/expenses/recentExpenses.js';
import { updateBiggestExpense } from './features/expenses/biggestExpense.js';
import { updateExpensesChart } from './charts/expensesChart.js';
import { expenses } from './data/expenses.js';
import { initDateFilter } from './features/expenses/expenseVIew.js';



function initApp() {
renderSavingsHTML();
renderDateTodayHTML();
renderDefaultExpensesHTML();
addMoneyInSavings();
withdrawMoneyInSavings();
initAddWithdrawOption();
initAddExpenseOption();
showReceipts();
initAddExpense();
initDeleteExpense();
updateTotalExpenses();
updateRecentExpenses();
updateBiggestExpense();
initDateFilter();

if (expenses.length > 0) {
  setTimeout(() => {
    updateExpensesChart(expenses);
  }, 100);
}

}


document.addEventListener('DOMContentLoaded', initApp);