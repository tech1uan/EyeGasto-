import { updateExpensesChart } from "../../charts/expensesChart.js";

import { updateBiggestExpense } from "./biggestExpense.js";
import { updateRecentExpenses } from "./recentExpenses.js";
import { updateTotalExpenses } from "./totalExpenses.js";
import { renderExpensesHTML } from "../../ui/renderExpenses.js";
import { confirmMessage } from "../../core/confirmActions.js";
import { getCurrentExpenses, getExpensesFromCache } from "./viewExpense.js";
import { editExpense } from "../../data/expenses.js";
import { renderBudget } from "../../ui/renderBudget.js";
import { budget } from "../../data/budget.js";



export function initEditExpense () {
   const container =  document.querySelector('.expenses-container');
   container.addEventListener('click', (e) => {
    if (e.target.classList.contains("js-edit-button")) {
      const id = Number(e.target.dataset.id);
      openEditForm(id);
    }
   })
}

async function openEditForm(id) {
  
  const expense = getExpensesFromCache(id);
  console.log(expense.category);
  document.getElementById('edit-expense-description').value = expense.description;
  document.getElementById('edit-expense-amount').value = expense.amount
  document.getElementById('edit-category').value = expense.category_id;
  
  const modal = document.querySelector('.edit-expense-option-container');
  const closeBtn = document.querySelector('.js-close-edit-expense');
  
  closeBtn.onclick = () => {
  modal.classList.add('hidden');
  }
 
  modal.classList.remove("hidden");
   
  const saveButton = document.getElementById('js-save-edit');

 saveButton.onclick = async () => {
  confirmMessage(`Do you wish to save this changes to <strong>${expense.description}</strong>?`, async() => {
  modal.classList.add('hidden');
  
  const {expense_id} = expense;
  const updatedDescription = document.getElementById('edit-expense-description').value.trim();
  const updatedAmount = Number(document.getElementById('edit-expense-amount').value)
  const updatedCategory = document.getElementById('edit-category').value
  
  console.log(updatedCategory);
  if(!updatedDescription ){
    alert('Description is required!');
    return;
  }

  if(isNaN(updatedAmount) || updatedAmount <=0) {
    alert('Amount must be a valid number!')
    return;
  }

  if(!updatedCategory) {
    alert('Please select a category!');
    return;
  }

  const data = await editExpense(expense_id,updatedAmount, updatedCategory, updatedDescription);

  if(!data) {
    alert('Failed to update expense!');
    return;
  }

  const expenses = await getCurrentExpenses();
  renderExpensesHTML(expenses);

  await Promise.all([
  updateTotalExpenses(),
  updateRecentExpenses(),
  updateExpensesChart(),
  renderBudget()
  ])

  budget.checkBudgetStatus();
  })
 };
}
