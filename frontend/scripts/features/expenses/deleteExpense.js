import { deleteExpense } from "../../data/expenses.js";
import { confirmMessage } from "../../core/confirmActions.js";

export function initDeleteExpense() {
const container = document.querySelector('.expenses-container');

container.addEventListener('click', (e) => {
  if (e.target.classList.contains('js-trash-button')) {

    const expenseId = Number(e.target.dataset.id);
    const expenseName = e.target.dataset.name;
    confirmMessage(`Do you want to delete <strong>${expenseName}?</strong>`, () => {
    deleteExpense(expenseId);
    }
  )
}});
}