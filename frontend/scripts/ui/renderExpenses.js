import { addJustifyCenter, formatToPeso, removeJustifyCenter } from "../core/utils.js";
import { getCurrentExpenses } from "../features/expenses/viewExpense.js"

export function renderExpensesHTML() {
  const container = document.querySelector('.expenses-container');

  let expenses = getCurrentExpenses();

  if (expenses.length === 0) {
    container.innerHTML = `
      <h1 class = "font-['DM_Sans'] text-center">No expenses today yet. Start tracking now 💸.</h1>
    `;
    addJustifyCenter(container);
    return;
  }
  
  
   removeJustifyCenter(container);

container.innerHTML = expenses.map(expense => `
  <div class="group expense-card relative flex w-full items-center rounded-xl p-2 py-3 bg-white gap-2.5 shadow-[0_4px_4px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_6px_rgba(0,0,0,0.3)] transition-all">
    
    <h1 class="font-bold flex-1 min-w-0 truncate">${expense.description}</h1>

    <div class="rounded-full flex py-1 px-4 gap-2 items-center flex-shrink-0" style="background-color: ${expense.color}">
      <img class="w-5" src="${expense.logo}" alt="${expense.category}">
      <p class="text-white font-bold text-xs whitespace-nowrap">${expense.category}</p>
    </div>

    <span class = "absolute left-1/2 -translate-x-1/2  top-full mt-2 w-40 p-2 bg-black text-white text-sm rounded shadow-lg z-50 
    group-hover:block transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none sm:pointer-events-auto">
     Description: ${expense.description}<br>
     Date: ${expense.date}<br>
     Category: ${expense.category}<br>
     Amount: ${formatToPeso(expense.amount)}
    </span>
    
    <h1 class="text-[#079F9F] font-['DM_Sans'] flex-shrink-0 font-bold text-sm sm:text-lg whitespace-nowrap">
      ${formatToPeso(expense.amount)}
    </h1>
    
    <i class="fa-solid fa-trash js-trash-button cursor-pointer flex-shrink-0 hover:text-red-600 transition-colors" data-id="${expense.id}" data-name ="${expense.description}"></i>

    <i class="fa-solid fa-pen js-edit-button cursor-pointer flex-shrink-0 hover:text-blue-600 transition-colors" data-id="${expense.id}" data-name ="${expense.description}"></i>

  </div>
`).join('');

}

export function initExpensesTooltip() {
  const container = document.querySelector('.expenses-container');

  container.addEventListener('click', (e) => {
    const card = e.target.closest('.expense-card');
    if(!card) 
      return;

    const tooltip = card.querySelector('span');

    tooltip.style.opacity = tooltip.style.opacity === "1" ? "0": "1";
  })

}
  
