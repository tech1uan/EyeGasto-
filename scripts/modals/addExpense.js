import { expenses, addExpense } from "../expenses.js";
import { renderExpensesHTML } from "../renderExpenses.js";
import { removeJustifyCenter } from "../utils.js";



export function initAddExpenseOption() {
  const button = document.querySelector('.js-show-add-expense');
  const container = document.querySelector('.add-expense-option-container');

  button.addEventListener('click', () => {

    container.classList.remove("hidden");
  })

  const closeButton = document.querySelector('.js-close-add-expense');

   closeButton.addEventListener('click', () => {
    container.classList.add("hidden");

  });
   
}

export function hideAddExpense() {
  const container = document.querySelector('.add-expense-option-container');
  
  container.classList.add("hidden");

}


export function handleAddExpense () {
  const descriptionInput = document.getElementById('expense-description');
  const amountInput = document.getElementById('expense-amount');
  const categorySelect = document.getElementById('category');
  const container = document.querySelector('.expenses-container');

 const description = descriptionInput.value.trim();
 const amount =  Number(amountInput.value);
 const categoryValue = categorySelect.value;

 

  if (!description || !amount || !categoryValue) 
  return alert("Please fill all fields!");

  addExpense(description,amount,categoryValue);

  descriptionInput.value = '';
  amountInput.value = '';
  categorySelect.value = '';

  renderExpensesHTML();
  hideAddExpense();
  console.log(expenses);

}



export function initAddExpense() {
  const addExpenseBtn = document.getElementById('js-add-expense');
  addExpenseBtn.addEventListener('click', handleAddExpense);
}

