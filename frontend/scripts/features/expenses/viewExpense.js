import { updateExpensesChart } from "../../charts/expensesChart.js";
import { getAllExpenses, getExpensesForToday, getExpensesForWeek } from "../../data/expenses.js";
import { renderExpensesHTML } from "../../ui/renderExpenses.js";
import { updateBiggestExpense } from "./biggestExpense.js";
import { updateRecentExpenses } from "./recentExpenses.js";
import { updateTotalExpenses } from "./totalExpenses.js";


export let currentView = "today";


export function getCurrentExpenses() {

  if(currentView === "today") {
    return getExpensesForToday();
  } else if (currentView === "last7") {
    return getExpensesForWeek();
  } else if (currentView === "alltime") {
    return getAllExpenses();
  }

  return getExpensesForToday();
}


function updateAllUI() {
  renderExpensesHTML();
  updateTotalExpenses();
  updateRecentExpenses();
  updateBiggestExpense();
  updateExpensesChart();
}

export function initDateFilter () {
  const selectElement = document.getElementById("dateFilter");

  selectElement.addEventListener("change", (e) => {
    currentView = e.target.value;
    console.log("View changed to: ", currentView);
    updateAllUI();
  })
}

export function getCurrentView() {
  return currentView;
}
