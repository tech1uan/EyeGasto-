
import { addMoneyInSavings, withdrawMoneyInSavings } from '../scripts/savings.js';
import { renderSavingsHTML } from './renderSavings.js';
import { showReceipts } from './renderReceipts.js';
import {initAddExpenseOption} from './modals/addExpense.js';
import {initAddWithdrawOption} from './modals/addWithdraw.js';
import { initAddExpense } from './modals/addExpense.js';
import { renderDateTodayHTML } from '.renderDateToday.js';
import { initDeleteExpense } from './renderExpenses.js';
import { renderDefaultExpensesHTML } from './renderDefault.js';
import { updateTotalExpenses } from './totalExpenses.js';
import { updateRecentExpenses } from './recentExpenses.js';
import { updateBiggestExpense } from './biggestExpense.js';
import { updateExpensesChart } from './charts/expensesChart.js';
import { expenses } from './expenses.js';


function initApp() {
renderSavingsHTML();
renderDefaultExpensesHTML();
addMoneyInSavings();
withdrawMoneyInSavings();
initAddWithdrawOption();
initAddExpenseOption();
showReceipts();
initAddExpense();
initDeleteExpense();
renderDateTodayHTML();
updateTotalExpenses();
updateRecentExpenses();
updateBiggestExpense();
 

if (expenses.length > 0) {
  setTimeout(() => {
    updateExpensesChart(expenses);
  }, 100);
}

}


document.addEventListener('DOMContentLoaded', initApp);