import { budget } from "../data/budget.js";

export function renderBudget() {

  const currentBudget = document.querySelector('.currentBudget');

  currentBudget.textContent = budget.getCurrentBudget();

}

