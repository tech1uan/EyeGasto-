import { deleteExpense, expenses } from "./expenses.js";
import { addJustifyCenter, formatToPeso, removeJustifyCenter } from "./utils.js";

export function initDeleteExpense() {
const container = document.querySelector('.expenses-container');

container.addEventListener('click', (e) => {
  if (e.target.classList.contains('js-trash-button')) {
    deleteExpense(e.target.dataset.id);
  }
});
}

export function renderExpensesHTML() {
  const container = document.querySelector('.expenses-container');

  if (expenses.length === 0) {
    container.innerHTML = `
      <h1 class = "font-['DM_Sans'] text-center">No expenses today yet. Start tracking now 💸.</h1>
    `;
    addJustifyCenter(container);
    return;
  }

  
   removeJustifyCenter(container);

  container.innerHTML = expenses.map(expense => `
    <div class="flex w-full items-center rounded-xl p-2 py-3 bg-white gap-2.5 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      <h1 class="font-bold flex-1 min-w-0 truncate">${expense.description}</h1>
      <div class="rounded-full flex py-1 px-4 gap-2 items-center flex-shrink-0" style="background-color: ${expense.color}">
        <img class="w-5" src="${expense.logo}">
        <span class="text-white font-bold text-xs whitespace-nowrap">${expense.category}</span>
      </div>
      <h1 class="text-[#079F9F] font-['DM_Sans'] flex-shrink-0 font-bold text-sm sm:text-lg whitespace-nowrap">
        ${formatToPeso(expense.amount)}
      </h1>
      <i class="fa-solid fa-trash js-trash-button cursor-pointer flex-shrink-0" data-id="${expense.id}"></i>
    </div>
  `).join('');
}



  
