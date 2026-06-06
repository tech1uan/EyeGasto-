  import {addExpense } from "../../data/expenses.js";
  import { renderExpensesHTML } from "../../ui/renderExpenses.js";
  import { removeJustifyCenter } from "../../core/utils.js";
  import { confirmMessage } from "../../core/confirmActions.js";
  import { renderBudget } from "../../ui/renderBudget.js";
import { renderTotalExpensesHTML, updateTotalExpenses } from "./totalExpenses.js";
import { getCurrentExpenses } from "./viewExpense.js";
import { budget } from "../../data/budget.js";
import { updateExpensesChart } from "../../charts/expensesChart.js";
import { updateRecentExpenses } from "./recentExpenses.js";
import { showMessage } from "../../withdrawals/addWithdraw.js";
   

   export async function initCategoryShortcut() {
    
    const container = document.querySelector(".category-container");
    const select = document.getElementById("category");

    container.addEventListener('click', (e) => {

      const button = e.target.closest('.js-category-btn');
      
      if(!button) return;

      select.value = button.value;

      document.querySelectorAll('.js-category-btn').forEach(btn => {
        btn.classList.remove('category-active')
      })

      button.classList.add('category-active');

    });;
     
   
   }

  export async function handleAddExpense () {

    const descriptionInput = document.getElementById('expense-description');
    const amountInput = document.getElementById('expense-amount');
    const categorySelect = document.getElementById('category');
    const error = document.getElementById('error-expense');
    const success = document.getElementById('success-expense');


    const description = descriptionInput.value.trim();
    const amount =  Number(amountInput.value);
    const categoryId = Number(categorySelect.value);
  
    if (!description || !amount || !categoryId) {
      showMessage(error, 'Please fill in all fields');
      return
    }
    
    
    confirmMessage(`Are you sure you want to add <strong>${description}</strong> as your expense?`, async () => {
    const data = await addExpense(description,amount,categoryId);
    
    if(!data) {
      alert('Failed to add expense!');
      return null;
    }
     
    const expenses = await getCurrentExpenses();

    await Promise.all([
   
    updateTotalExpenses(),
    renderBudget(),
    updateRecentExpenses(),
    updateExpensesChart()
    ])
      renderExpensesHTML(expenses, "home")
      renderExpensesHTML(expenses, "expenses")
    budget.checkBudgetStatus();

    descriptionInput.value = '';
    amountInput.value = '';
    categorySelect.value = '';


  })
  }



  export function initAddExpense() {
    const addExpenseBtn = document.getElementById('js-add-expense');
    addExpenseBtn.addEventListener('click', handleAddExpense);

  }

  export function initAddExpenseNavigator  () {
    

    const button = document.getElementById('add-expense-navigator');
    const navButtons = document.querySelectorAll('.nav-btn');
    const expensesNavBtn = document.querySelector('.expenses-nav');

    
    button.addEventListener('click' , () => {
    const expensesNavigatorContainer = document.querySelector('.expenses-nav-container');
    const expensesSection = document.querySelector('.expenses-section');
    const homeSection = document.querySelector('.home-section');

   
    expensesNavigatorContainer.classList.add('hidden');
    expensesSection.classList.remove('hidden');
    homeSection.classList.add('hidden');

        navButtons.forEach(nav => {
            nav.classList.remove('active')
        })
        expensesNavBtn.classList.add('active');
    })
   
  }


