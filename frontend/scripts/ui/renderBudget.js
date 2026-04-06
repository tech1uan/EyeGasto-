import { budget } from "../data/budget.js";

export function renderBudget() {

  const el = document.querySelector('.currentBudget');

  el.textContent = budget.getCurrentBudget()

  if (budget.isbelowZero) {
    el.classList.add("text-red-600"); 
    el.classList.remove("text-[#079F9F]"); 
  } else {
    el.classList.remove("text-red-600");
    el.classList.add("text-[#079F9F]");
  }

}

