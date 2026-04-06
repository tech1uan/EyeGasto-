import { expenses, addExpense } from "../../data/expenses.js";
import { renderExpensesHTML } from "../../ui/renderExpenses.js";
import { removeJustifyCenter } from "../../core/utils.js";
import { confirmMessage } from "../../core/confirmActions.js";
import { renderBudget } from "../../ui/renderBudget.js";



export function initAddExpenseOption() {
  const showButton = document.querySelector('.js-show-add-expense');
  const modal = document.querySelector('.add-expense-option-container');
  const closeButton = document.querySelector('.js-close-add-expense');

  showButton.addEventListener('click', () => modal.classList.remove('hidden'));
  closeButton.addEventListener('click', () => modal.classList.add('hidden'));
   
}

export function hideAddExpense() {
  document.querySelector('.add-expense-option-container').classList.add('hidden');
}


export function handleAddExpense () {
  const descriptionInput = document.getElementById('expense-description');
  const amountInput = document.getElementById('expense-amount');
  const categorySelect = document.getElementById('category');


 const description = descriptionInput.value.trim();
 const amount =  Number(amountInput.value);
 const categoryValue = categorySelect.value;


  if (!description || !amount || !categoryValue) 
  return alert("Please fill all fields!");
  
  confirmMessage(`Are you sure you want to add <strong>${description}</strong> as your expense?`, () => {
  addExpense(description,amount,categoryValue);

  descriptionInput.value = '';
  amountInput.value = '';
  categorySelect.value = '';

  renderExpensesHTML();
  hideAddExpense();
  renderBudget();

})
}

/*
export function handleAddExpenseDesktop () {
  const descriptionInput = document.getElementById('expense-description-desktop');
  const amountInput = document.getElementById('expense-amount-desktop');
  const categorySelect = document.getElementById('category-desktop');


 const description = descriptionInput.value.trim();
 const amount =  Number(amountInput.value);
 const categoryValue = categorySelect.value;

 

  if (!description || !amount || !categoryValue) 
  return alert("Please fill all fields!");


  confirmMessage(`Are you sure you want to add <strong>${description}</strong> as your expense?`, () => {
  addExpense(description,amount,categoryValue);
  descriptionInput.value = '';
  amountInput.value = '';
  categorySelect.value = '';

  renderExpensesHTML();
  hideAddExpense();

})
}
*/

export function initAddExpense() {
  const addExpenseBtn = document.getElementById('js-add-expense');
  addExpenseBtn.addEventListener('click', handleAddExpense);

  /*
  const addExpenseDesktop = document.getElementById('js-add-expense-desktop');
  addExpenseDesktop.addEventListener('click', handleAddExpenseDesktop)
  */
}

