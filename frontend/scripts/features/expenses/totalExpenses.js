
import { loadSavingsFromStorage } from "../../core/storage.js";
import { formatToPeso } from "../../core/utils.js";
import { getCurrentExpenses } from "./viewExpense.js";


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

  const expenses = getCurrentExpenses();
  
  totalExpenses = expenses.reduce((sum,exp) => sum + exp.amount, 0);

  loadSavingsFromStorage("totalExpenses", totalExpenses);


  renderTotalExpensesHTML(totalExpenses);
}

export function renderTotalExpensesHTML(total) {

  const totalExpense = document.querySelector('.total-expenses');
  
  if(totalExpense) {
  totalExpense.textContent = formatToPeso(total);
}
}