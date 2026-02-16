import { updateBiggestExpense } from "./biggestExpense.js";
import { updateRecentExpenses } from "./recentExpenses.js";
import { renderExpensesHTML } from "./renderExpenses.js";
import { loadSavingsFromStorage, saveToLocalStorage } from "./storage.js";
import {updateTotalExpenses} from "./totalExpenses.js";
import { updateExpensesChart } from "./charts/expensesChart.js";

const savedData = loadSavingsFromStorage("expenses");

export let expenses = savedData || []; 


export function addExpense(description, amount, category) {
  const expense = {
    id: Date.now(),
    description,
    category,
    amount: Number(amount),
    color: getCategoryColor(category),
    logo: getCategoryLogo(category),
  };
   
  expenses.push(expense);
  saveToLocalStorage("expenses", expenses);
  updateTotalExpenses();
  setTimeout(updateRecentExpenses, 2000);
  setTimeout(updateBiggestExpense,3000);
  setTimeout(() => {
    updateExpensesChart(expenses);
  }, 4000 );
}

export function deleteExpense(id) {
 expenses = expenses.filter((expense) => 
  expense.id != id)
 saveToLocalStorage("expenses", expenses);
 renderExpensesHTML();
 updateTotalExpenses();
 updateRecentExpenses();
 updateBiggestExpense();
 updateExpensesChart(expenses);
 }



function getCategoryColor(category) {
   
  const categoryColors = {
    Foods: "#FF6B6B",
    Transport: "#44C2B9",
    Shoppings: "#FFB142",
    Bills: "#556270",
    Health: "#00B894",
    Entertainment: "#A29BFE",
    Education:"#0984E3",
    Savings:"#6C5CE7",
    Debt: "#FF7675",
    Others:"#636E72",
  }

  return categoryColors[category] || "black";
}

function getCategoryLogo(category) {
   
  const categoryLogo = {
    Foods: "../images/category/foods-drinks.png",
    Transport: "../images/category/transport.png",
    Shoppings: "../images/category/shopping.png",
    Bills: "../images/category/bills-utilities.png",
     Health: "../images/category/health.png",
    Entertainment: "../images/category/entertainment.png",
    Education:"../images/category/education.png",
    Savings:"../images/category/savings.png",
    Debt: "../images/category/debt.png",
    Others:"../images/category/belongings.png",
  }
  
  return categoryLogo[category] || null;
}

