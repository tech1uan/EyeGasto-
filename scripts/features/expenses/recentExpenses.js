import { expenses } from "../../data/expenses.js";
import { loadSavingsFromStorage, saveToLocalStorage } from "./storage.js";
import { formatToPeso } from "./utils.js";


const savedData = loadSavingsFromStorage("recentExpenses");

let recentExpenses = savedData || [];

export function updateRecentExpenses () {
    
    recentExpenses = expenses.slice(-2);

    saveToLocalStorage("recentExpenses", recentExpenses);

    renderRecentExpensesHTML(recentExpenses)

    console.log(recentExpenses)
}


function renderRecentExpensesHTML(recentExpenses) {
    const container = document.querySelector('.recent-expenses-container');

     if(!container)
       return;

if(recentExpenses.length === 0) {
   container.innerHTML =
   `
    <h1 class = "text-center">No expenses today.</h1>
   `
   return;
  }

   container.innerHTML = recentExpenses.map(expense =>
    `<div class="flex bg-white w-[80%] rounded-xl mb-2 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">

  <!-- LEFT: colored, shrinkable -->
  <div class="flex items-center gap-3 p-3 rounded-l-xl min-w-0 flex-1 flex-shrink" 
       style="background-color:${expense.color}">
    <img src="${expense.logo}" class="w-5 h-5 flex-shrink-0"/>
    <h1 class="text-white text-sm font-bold font-[DM_Sans] truncate">
      ${expense.description}
    </h1>
  </div>

  <!-- RIGHT: amount, fixed -->
  <div class="flex items-center px-3 ">
    <h1 class="text-[#079F9F] font-bold text-md font-[DM_Sans] whitespace-nowrap">
      ${formatToPeso(expense.amount)}
    </h1>
  </div>

</div>


    `).join('');

}