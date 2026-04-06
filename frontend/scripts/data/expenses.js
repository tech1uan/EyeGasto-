import { updateBiggestExpense } from "../features/expenses/biggestExpense.js";
import { updateRecentExpenses } from "../features/expenses/recentExpenses.js";
import { renderExpensesHTML } from "../ui/renderExpenses.js";
import { loadSavingsFromStorage, saveToLocalStorage } from "../core/storage.js";
import {updateTotalExpenses} from "../features/expenses/totalExpenses.js";
import { updateExpensesChart } from "../charts/expensesChart.js";
import { getCurrentExpenses } from "../features/expenses/viewExpense.js";
import { budget } from "./budget.js";
import { renderBudget } from "../ui/renderBudget.js";


const savedData = loadSavingsFromStorage("expenses");

export let expenses = savedData || []; 


export function addExpense(description, amount, category, date = dayjs().format('YYYY-MM-DD')) {
  const expense = {
    id: Date.now(),
    date,
    description,
    category,
    amount: Number(amount),
    color: getCategoryColor(category),
    logo: getCategoryLogo(category),
  };


   
  expenses.push(expense);
  saveToLocalStorage("expenses", expenses);
  
  budget.deduct(amount);

  renderBudget();
  renderExpensesHTML();
  updateTotalExpenses();
  updateRecentExpenses();
  updateBiggestExpense();
  updateExpensesChart(getCurrentExpenses());
   
}

export function deleteExpense(id) {


  const expenseToDelete = expenses.find(exp => exp.id === id);
   
  if(expenseToDelete) {
  budget.refund(expenseToDelete.amount);
  }

 expenses = expenses.filter((expense) => 
  expense.id !== id)

 saveToLocalStorage("expenses", expenses);
  renderBudget();
 renderExpensesHTML();
 updateTotalExpenses();
 updateRecentExpenses();
 updateBiggestExpense();
 updateExpensesChart(getCurrentExpenses());
 
 }


export function getExpensesForToday() {
  const today = dayjs().format('YYYY-MM-DD');
  return expenses.filter(e => e.date === today);
}

export function getExpensesForWeek() {
  const weekAgo = dayjs().subtract(7, 'day');
  const today = dayjs();

  return expenses.filter(e => {
    const expenseDate = dayjs(e.date);

    return expenseDate.valueOf() >= weekAgo.valueOf() &&
           expenseDate.valueOf() <= today.valueOf();
  });
}

export function getAllExpenses () {
  return expenses;
}



export function getCategoryColor(category) {
   
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

export function getCategoryLogo(category) {
   
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

