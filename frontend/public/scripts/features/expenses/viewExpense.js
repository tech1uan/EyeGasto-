import { updateExpensesChart } from "../../charts/expensesChart.js";
import { fetchGetUserExpenses } from "../../data/expenses.js";
import { renderExpensesHTML } from "../../ui/renderExpenses.js";
import { updateBiggestExpense } from "./biggestExpense.js";
import { updateRecentExpenses } from "./recentExpenses.js";
import {updateTotalExpenses } from "./totalExpenses.js";


export let currentView = "today";


export let cachedExpenses = [];

export async function getCurrentExpenses() {
 const data = await fetchGetUserExpenses(currentView);
  
 if(!data || !data.expenses) return [];

 cachedExpenses = data.expenses;
 return data.expenses;
}

export async function initExpensesFilter() {
  const selectElement = document.getElementById('filter-expenses');
    selectElement.addEventListener("change", async (e) => {
    currentView = e.target.value;

    const expenses = await getCurrentExpenses();

    await Promise.all([
      updateTotalExpenses(currentView),
      updateRecentExpenses(),
      updateExpensesChart()
  ])

   renderExpensesHTML(expenses);
  
    
  })
}

export async function initExpensesPage() {
  const selectElement = document.getElementById('filter-expenses');

  if(selectElement) {
    selectElement.value = currentView;
  }

  const expenses = await getCurrentExpenses();

  await Promise.all([
      updateTotalExpenses(currentView),
      updateRecentExpenses(),
      updateExpensesChart()
  ])

 renderExpensesHTML(expenses);
}

export function getExpensesFromCache(id) {
  return cachedExpenses.find(e => e.expense_id == id);
}

