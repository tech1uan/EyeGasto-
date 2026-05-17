import { formatToPeso } from "../core/utils.js";
import {  budget } from "../data/budget.js";

export async function renderBudget() {

  let el = document.querySelector('.currentBudget');
  const data = await budget.getBudget();
  if(!data) {
    return;
  }
    el.textContent = formatToPeso(data.budget);

  if (data.budget < 0) {
    el.classList.add("text-red-600"); 
    el.classList.remove("text-[#079F9F]"); 
  } else {
    el.classList.remove("text-red-600");
    el.classList.add("text-[#079F9F]");
  }
} 
