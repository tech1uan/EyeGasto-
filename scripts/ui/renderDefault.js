import { renderExpensesHTML } from "./renderExpenses.js";
import { loadSavingsFromStorage } from "./storage.js";
import { removeJustifyCenter } from "./utils.js";


export function renderDefaultExpensesHTML() {

  const savedData = loadSavingsFromStorage('expenses');
  const container = document.querySelector('.expenses-container');

  if (!savedData || savedData.length === 0) {
    container.innerHTML = `
      <h1 class="font-['DM_Sans'] text-center">
        No expenses today yet. Start tracking now 💸
      </h1>
    `;
    return;
  }

  renderExpensesHTML();

}