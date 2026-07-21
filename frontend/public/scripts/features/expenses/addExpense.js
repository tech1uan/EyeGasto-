  import {addExpense, invalidateProfileStats } from "../../data/expenses.js";
  import { renderExpensesHTML } from "../../ui/renderExpenses.js";
  import { removeJustifyCenter } from "../../core/utils.js";
  import { confirmMessage } from "../../core/confirmActions.js";
  import { renderBudget } from "../../ui/renderBudget.js";
import { renderTotalExpensesHTML, updateTotalExpenses } from "./totalExpenses.js";
import { getCurrentExpenses } from "./viewExpense.js";
import { budget } from "../../data/budget.js";
import { updateExpensesChart } from "../../charts/expensesChart.js";
import { showMessage } from "../../withdrawals/addWithdraw.js";
import { hideLoading, showLoading } from "../../ui/loading.js";
import { initAnalytics } from "../analytics/analytics.js";
import { checkBudgetData } from "../../budget/budgetActions.js";
import { checkSpendingTrend } from "../../notifs/pushNotifications.js";
import { refreshProfileStats } from "../../data/user.js";
   

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

    confirmMessage('green',`Are you sure you want to add <strong>${description}</strong> as your expense?`, async () => {
         const addExpenseBtn = document.getElementById('js-add-expense');
          addExpenseBtn.disabled = true;
         showLoading(addExpenseBtn);
          try {
            await addExpense(description,amount,categoryId);
            
              const expenses = await getCurrentExpenses();

              renderExpensesHTML(expenses, "home")
              renderExpensesHTML(expenses, "expenses")
              await invalidateProfileStats()
              
              await Promise.all([
              updateTotalExpenses(),
              updateExpensesChart(),
              renderBudget(),
              refreshProfileStats()
              ])

              await checkBudgetData()
              await checkSpendingTrend();

        
            } finally {
              hideLoading(addExpenseBtn);
              addExpenseBtn.disabled = false;    
              descriptionInput.value = '';
              amountInput.value = '';
              categorySelect.value = '';
            }
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
    const analyticsSection = document.querySelector('.analytics-section');
    const profileSection = document.querySelector('.profile-section');

    expensesNavigatorContainer.classList.add('hidden');
    expensesSection.classList.remove('hidden');
    homeSection.classList.add('hidden');
    analyticsSection.classList.add('hidden');
    profileSection.classList.add('hidden');

        navButtons.forEach(nav => {
            nav.classList.remove('active')
        })
        expensesNavBtn.classList.add('active');
    })
   
  }


