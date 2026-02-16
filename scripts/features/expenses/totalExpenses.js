import { expenses } from "./expenses.js";
import { loadSavingsFromStorage } from "./storage.js";
import { formatToPeso } from "./utils.js";


const savedData = loadSavingsFromStorage("totalExpenses");

let totalExpenses = savedData || 0;

export function getTotalExpenses() {
  return totalExpenses;
}

export function setTotalExpenses(value) {
  totalExpenses = value;
  saveSavingsToStorage("totalExpenses", value);
}


export function updateTotalExpenses() {
  
  totalExpenses = expenses.reduce((sum,exp) => sum + exp.amount, 0);

  loadSavingsFromStorage("totalExpenses", totalExpenses);

  console.log(totalExpenses);

  renderTotalExpensesHTML(totalExpenses);
}

export function renderTotalExpensesHTML(total) {

  const totalExpense = document.querySelector('.total-expenses');
  
  if(totalExpense) {
  totalExpense.textContent = formatToPeso(total);
}
}