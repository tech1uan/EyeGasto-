import { addJustifyCenter, formatToPeso, removeJustifyCenter } from "../core/utils.js";

export async function renderExpensesHTML(expenses, variant = "home") {
  const selector = variant === "home" ? ".expenses-container" : ".expenses-container-b";
  const container = document.querySelector(selector);

  if (!expenses || expenses.length === 0) {
     container.classList.add(
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'h-full'
  );
    container.innerHTML = `
      <h1 class=" font-['DM_Sans'] text-center">No expenses today yet. Start tracking now 💸.</h1>
    `;
    addJustifyCenter(container);
    return;
  }
  
  removeJustifyCenter(container);

  container.innerHTML = expenses.map(expense => {

    const categoryBadge = `
      <div class="rounded-full flex py-1 px-4 gap-2 items-center flex-shrink-0"  style="background-color: ${expense.color}">
        <img class="w-5" src="${expense.logo}" alt="${expense.category}">
        <p class="text-white font-bold text-[11px] sm:text-[12px] md:text-[14px] whitespace-nowrap">${expense.category}</p>
      </div>
    `;

    const tooltip = `
      <span class="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-40 p-2 bg-black text-white text-sm rounded shadow-lg z-50 
      group-hover:block transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none sm:pointer-events-auto font-['DM_Sans']">
        Description: ${expense.description}<br>
        Date: ${dayjs(expense.date_time).format('MM-DD-YYYY')}<br>
        Category: ${expense.category}<br>
        Amount: ${formatToPeso(expense.amount)}
      </span>
    `;

    const actions = `
      <div class="relative js-show-button cursor-pointer">
        <i class="fas fa-ellipsis-h pointer-events-none"></i>
        <div class="hidden bg-white rounded-sm absolute top-0 right-0 shadow-md z-10 js-dropdown flex">
          <i class="fa-solid fa-trash js-trash-button cursor-pointer p-2 hover:text-red-600 transition-colors" 
            data-id="${expense.expense_id}" data-name="${expense.description}"></i>
          <i class="fa-solid fa-pen js-edit-button cursor-pointer p-2 hover:text-blue-600 transition-colors" 
            data-id="${expense.expense_id}" data-name="${expense.description}"></i>
        </div>
      </div>
    `;

    if (variant === "home") {
      return `
          <div class="font-['DM_Sans']  group expense-card relative
          flex items-center gap-2
          w-full
          rounded-xl
          p-3 sm:p-4
          bg-white
          shadow-[0_4px_4px_rgba(0,0,0,0.25)]
          hover:shadow-[0_6px_6px_rgba(0,0,0,0.3)]
          transition-all">
          <h1 class=" flex-1 min-w-0 truncate font-bold text-sm sm:text-base lg:text-lg">${expense.description}</h1>
          ${categoryBadge}
          ${tooltip}
          <h1 class=" flex-shrink-0 whitespace-nowrap font-bold text-[#079F9F] text-sm sm:text-base lg:text-[18px]">${formatToPeso(expense.amount)}</h1>
          ${actions}
        </div>
      `;
    }

    if (variant === "expenses") {
      return `
        <div class="font-['DM_Sans'] group expense-card relative
        flex items-center gap-2
        w-full
        rounded-xl
        p-3 sm:p-4
        bg-white
        shadow-[0_4px_4px_rgba(0,0,0,0.25)]
        hover:shadow-[0_6px_6px_rgba(0,0,0,0.3)]
        transition-all">
          <h1 class="flex-1 min-w-0 truncate font-bold text-sm sm:text-base lg:text-lg">${expense.description}</h1>
          ${categoryBadge}
          ${tooltip}
          <h1 class="flex-shrink-0 whitespace-nowrap font-bold text-[#079F9F] text-sm sm:text-base lg:text-[18px]">${formatToPeso(expense.amount)}</h1>
          <p class = "text-[10px] sm:text-xs">[${dayjs(expense.date_time).format('h:mm A')}]</p>
          ${actions}
        </div>
      `;
    }

  }).join('');
}

export function initExpensesTooltip() {
  const containers = document.querySelectorAll('.expenses-container, .expenses-container-b');
 
  containers.forEach(container => {
    container.addEventListener('click', (e) => {
    const card = e.target.closest('.expense-card');
    if(!card) 
      return;

    const tooltip = card.querySelector('span');

    tooltip.style.opacity = tooltip.style.opacity === "1" ? "0": "1";
  })
  })


}
  
