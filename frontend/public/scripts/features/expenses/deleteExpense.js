import { deleteExpense } from "../../data/expenses.js";
import { confirmMessage } from "../../core/confirmActions.js";
import { renderExpensesHTML } from "../../ui/renderExpenses.js";
import { getCurrentExpenses } from "./viewExpense.js";
import { updateTotalExpenses } from "./totalExpenses.js";
import { renderBudget } from "../../ui/renderBudget.js";
import { updateRecentExpenses } from "./recentExpenses.js";
import { updateExpensesChart } from "../../charts/expensesChart.js";

export async function initDeleteExpense() {
const containers = document.querySelectorAll('.expenses-container, .expenses-container-b');

containers.forEach(container => {
container.addEventListener('click', async (e) => {

  const btn = e.target.closest('.js-trash-button')

    const expenseId = Number(btn.dataset.id);
    const expenseName = btn.dataset.name;
    confirmMessage(`Do you want to delete <strong>${expenseName}?</strong>`, async () => {

    const data = await deleteExpense(expenseId);
    if(!data) {
      alert("Failed to delete expense!");
      return;
    }

    const expenses = await getCurrentExpenses();
    renderExpensesHTML(expenses, "home");
    renderExpensesHTML(expenses, "expenses")
    
    await Promise.all([
      updateTotalExpenses(),
     renderBudget(),
     updateRecentExpenses(),
     updateExpensesChart(),
    ])
   

    budget.checkBudgetStatus();
    }
  )
});
})

}