import { formatToPeso } from "../core/utils.js";
import {  budget } from "../data/budget.js";

export async function renderBudget() {

  let el = document.querySelector('.budgetAmounts');
  const data = await budget.getBudget();
  if(!data) {
    return;
  }
    el.innerHTML = `
    <p class="text-sm">${formatToPeso(data.budget)}</p><p class="text-sm text-black opacity-[29%]">/${formatToPeso(data.originalBudget)}</p>
    `;
 

  if (data.budget < 0) {
    el.classList.add("text-red-600"); 
    el.classList.remove("text-[#079F9F]"); 
  } else {
    el.classList.remove("text-red-600");
    el.classList.add("text-[#079F9F]");
  }

  const spent = Number(data.originalBudget - data.budget);
  const total = Number(data.originalBudget);

  const percent  = Math.min((spent/total) * 100, 100);

  const budgetBar =  document.getElementById('budgetBar');

   budgetBar.style.width = percent + '%';

  if(percent === 100) {
    budgetBar.style.background = '#ef4444';
  } 
} 
