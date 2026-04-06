import { renderExpensesHTML } from "./renderExpenses.js";
import { loadSavingsFromStorage } from "../core/storage.js";
import { removeJustifyCenter } from "../core/utils.js";


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