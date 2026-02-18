import { updateExpensesChart } from "../../charts/expensesChart.js";
import { saveToLocalStorage } from "../../core/storage.js";
import { expenses, getCategoryLogo, getCategoryColor } from "../../data/expenses.js";
import { updateBiggestExpense } from "./biggestExpense.js";
import { updateRecentExpenses } from "./recentExpenses.js";
import { updateTotalExpenses } from "./totalExpenses.js";
import { renderExpensesHTML } from "../../ui/renderExpenses.js";
import { confirmMessage } from "../../core/confirmActions.js";



export function initEditExpense () {
   const container =  document.querySelector('.expenses-container');
   container.addEventListener('click', (e) => {
    if (e.target.classList.contains("js-edit-button")) {
      const description = e.target.dataset.name;
      const id = Number(e.target.dataset.id);
      openEditForm(description,id);
    }
   })
}

function openEditForm(description, id) {

  const expense = expenses.find(e => e.id === id);
  if (!expense) 
    return;

  document.getElementById('edit-expense-description').value = expense.description;
  document.getElementById('edit-expense-amount').value = expense.amount;
  document.getElementById('edit-category').value = expense.category;

  const modal = document.querySelector('.edit-expense-option-container');
  const closeBtn = document.querySelector('.js-close-edit-expense');
  
  closeBtn.onclick = () => {
  modal.classList.add('hidden');
  }
 
  modal.classList.remove("hidden");
   
  const saveButton = document.getElementById('js-save-edit');

 saveButton.onclick = () => {
  confirmMessage(`Do you wish to save this changes to <strong>${description}</strong>?`, () => {
  saveEditedExpense(id);
  modal.classList.add('hidden');

  renderExpensesHTML();
 
  })
 };

}

function saveEditedExpense(id) {
  const description = document.getElementById('edit-expense-description').value;
  const amount = Number(document.getElementById('edit-expense-amount').value);
  const category = document.getElementById('edit-category').value;

  const index = expenses.findIndex(e => e.id === id);
  if(index === -1) 
    return;

 
  expenses[index].description = description;
  expenses[index].amount = amount;
  expenses[index].category = category;

  expenses[index].color = getCategoryColor(category);
  expenses[index].logo = getCategoryLogo(category);

  saveToLocalStorage('expenses', expenses);
  updateTotalExpenses();
  updateRecentExpenses();
  updateBiggestExpense();
  updateExpensesChart();
}
