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
import { initAnalytics } from "../analytics/analytics.js";
import { checkBudgetData } from "../../budget/budgetActions.js";



export function initEditExpense () {
   const containers =  document.querySelectorAll('.expenses-container, .expenses-container-b ');
   containers.forEach(c => {
    c.addEventListener('click', (e) => {
    const button = e.target.closest('.js-edit-button');

    if(!button) return;

      const id =  Number(button.dataset.id);
      openEditForm(id);
  
   })
   })
}

async function openEditForm(id) {
  
  const expense = getExpensesFromCache(id);
  document.getElementById('edit-expense-description').value = expense.description;
  document.getElementById('edit-expense-amount').value = expense.amount
  document.getElementById('edit-category').value = expense.category_id;
  
  const modal = document.querySelector('.edit-expense-option-container');
  const closeBtn = document.querySelector('.js-close-edit-expense');
  
  closeBtn.onclick = () => {
  modal.classList.add('hidden');
  }
 
  modal.classList.remove("hidden");
  modal.classList.add("flex");
   
  const saveButton = document.getElementById('js-save-edit');
  const editExpenseInnerContainer = document.querySelector('.edit-expense-inner-container');
 saveButton.onclick = async () => {
    modal.classList.add('hidden');
  confirmMessage('green',`Do you wish to save this changes to <strong>${expense.description}</strong>?`, async() => {
  modal.classList.remove("flex");
  
  const {expense_id} = expense;
  const updatedDescription = document.getElementById('edit-expense-description').value.trim();
  const updatedAmount = Number(document.getElementById('edit-expense-amount').value)
  const updatedCategory = document.getElementById('edit-category').value
  
  console.log(updatedCategory);
  if(!updatedDescription ){
    return;
  }

  if(isNaN(updatedAmount) || updatedAmount <=0) {
    return;
  }

  if(!updatedCategory) {
    return;
  }

  const data = await editExpense(expense_id,updatedAmount, updatedCategory, updatedDescription);

  if(!data) {
    return;
  }

  const expenses = await getCurrentExpenses();
  renderExpensesHTML(expenses, "home");
  renderExpensesHTML(expenses,"expenses")

 await Promise.all([
  updateTotalExpenses(),
  updateRecentExpenses(),
  updateExpensesChart(),
  renderBudget()
  ])
  
  await checkBudgetData()
  
  })
 };
}

