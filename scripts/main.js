
import { renderSavingsHTML } from './ui/renderSavings.js';
import { initReceipts } from './ui/renderReceipts.js';
import {initAddExpenseOption, initAddExpense} from './features/expenses/addExpense.js';
import {initAddWithdraw, initAddWithdrawOption} from './withdrawals/addWithdraw.js';
import {renderExpensesFilter, renderTransactionsFilter } from './ui/renderDateToday.js';
import { initExpensesTooltip } from './ui/renderExpenses.js';
import { renderDefaultExpensesHTML } from './ui/renderDefault.js';
import { updateTotalExpenses } from './features/expenses/totalExpenses.js';
import { updateRecentExpenses } from './features/expenses/recentExpenses.js';
import { updateBiggestExpense } from './features/expenses/biggestExpense.js';
import { updateExpensesChart } from './charts/expensesChart.js';
import { expenses } from './data/expenses.js';
import { initDateFilter } from './features/expenses/viewExpense.js';
import { initEditExpense } from './features/expenses/editExpense.js';
import { initDeleteExpense } from './features/expenses/deleteExpense.js';
import { initTDateFilter } from './features/transactions/viewTransactions.js';
import { initAddEditBudget, initSetBudgetModal } from './budget/addBudget.js';
import { renderBudget } from './ui/renderBudget.js';



function initApp() {
renderSavingsHTML();
renderExpensesFilter();
renderTransactionsFilter();
renderDefaultExpensesHTML();
initAddWithdrawOption();
initAddWithdraw();
initAddExpenseOption();
initReceipts();
renderBudget();
initSetBudgetModal();
initAddEditBudget();
initAddExpense();
initDeleteExpense();
updateTotalExpenses();
updateRecentExpenses();
updateBiggestExpense();
initDateFilter();
initTDateFilter();
updateExpensesChart(expenses);
initExpensesTooltip();
initEditExpense();
}


document.addEventListener('DOMContentLoaded', initApp);

