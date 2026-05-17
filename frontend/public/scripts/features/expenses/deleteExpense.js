import { deleteExpense } from "../../data/expenses.js";
import { confirmMessage } from "../../core/confirmActions.js";
import { renderExpensesHTML } from "../../ui/renderExpenses.js";
import { getCurrentExpenses } from "./viewExpense.js";
import { updateTotalExpenses } from "./totalExpenses.js";
import { renderBudget } from "../../ui/renderBudget.js";
import { updateRecentExpenses } from "./recentExpenses.js";
import { updateExpensesChart } from "../../charts/expensesChart.js";

export async function initDeleteExpense() {
const container = document.querySelector('.expenses-container');

container.addEventListener('click', async (e) => {
  if (e.target.classList.contains('js-trash-button')) {

    const expenseId = Number(e.target.dataset.id);
    const expenseName = e.target.dataset.name;
    confirmMessage(`Do you want to delete <strong>${expenseName}?</strong>`, async () => {

    const data = await deleteExpense(expenseId);
    if(!data) {
      alert("Failed to delete expense!");
      return;
    }

    const expenses = await getCurrentExpenses();
    renderExpensesHTML(expenses);
    
    await Promise.all([
      updateTotalExpenses(),
     renderBudget(),
     updateRecentExpenses(),
     updateExpensesChart(),
    ])
   

    budget.checkBudgetStatus();
    }
  )
}});
}