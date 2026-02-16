import { deleteExpense } from "../data/expenses.js";
import { addJustifyCenter, formatToPeso, removeJustifyCenter } from "../core/utils.js";
import { getCurrentExpenses } from "../features/expenses/expenseVIew.js";

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
  <div class="group flex w-full items-center rounded-xl p-2 py-3 bg-white gap-2.5 shadow-[0_4px_4px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_6px_rgba(0,0,0,0.3)] transition-all">
    
    <h1 class="font-bold flex-1 min-w-0 truncate">${expense.description}</h1>

       
    <!-- Date appears here on hover -->
    <span class="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap flex-shrink-0">
      ${dayjs(expense.date).format('MMM D')}
    </span>

    <div class="rounded-full flex py-1 px-4 gap-2 items-center flex-shrink-0" style="background-color: ${expense.color}">
      <img class="w-5" src="${expense.logo}" alt="${expense.category}">
      <span class="text-white font-bold text-xs whitespace-nowrap">${expense.category}</span>
    </div>
    
    <h1 class="text-[#079F9F] font-['DM_Sans'] flex-shrink-0 font-bold text-sm sm:text-lg whitespace-nowrap">
      ${formatToPeso(expense.amount)}
    </h1>
    
    <i class="fa-solid fa-trash js-trash-button cursor-pointer flex-shrink-0 hover:text-red-600 transition-colors" data-id="${expense.id}"></i>
  </div>
`).join('');

console.log(expenses);
}



  
