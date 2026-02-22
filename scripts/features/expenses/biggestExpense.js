import { loadSavingsFromStorage, saveToLocalStorage } from "../../core/storage.js";
import { formatToPeso } from "../../core/utils.js";
import { getExpensesForToday } from "../../data/expenses.js";
import { getCurrentExpenses } from "./viewExpense.js";

const savedData = loadSavingsFromStorage("biggestExpense");

let biggestExpense = savedData || [0];


export function updateBiggestExpense() {
 
const expenses = getExpensesForToday();

 biggestExpense = expenses.reduce((max, expense) => 
   expense.amount > max.amount ? expense : max , 
{amount: 0, description: "", category: "", logo: "", color: ""});

saveToLocalStorage("biggestExpense", biggestExpense);

renderBiggestExpense(biggestExpense);


function renderBiggestExpense (biggestExpense) {

  const container = document.querySelector('.biggest-expense-container');

  if(!container)
    return;

  if(biggestExpense.amount === 0) {
   container.innerHTML =
   `
    <h1 class = "font-semibold font-[DM_Sans] w-full">Biggest Expense Today:<span class ="biggestExpenseName">
    </span></h1>
          
    <p class = "text-center">No expense.</p>
   `
   return;
  }

 container.innerHTML = 
 `
<h1 class="font-semibold font-[DM_Sans] w-full">
  Biggest Expense Today: 
  <span class="biggestExpenseName text-[20px] font-['Lilita_One'] text-white text-5xl text-outline-black inline-block max-w-[200px] align-middle">
    ${biggestExpense.description}
  </span>
</h1>

<div class="flex bg-white w-[80%] rounded-xl shadow-[0_4px_4px_rgba(0,0,0,0.25)]">

  <div class="flex items-center gap-2 p-3 rounded-l-xl min-w-0 flex-shrink flex-1"
       style="background-color: ${biggestExpense.color}">
    <img class="w-5 h-5 flex-shrink-0" src="${biggestExpense.logo}" alt="${biggestExpense.category}"/>
    <h1 class="font-bold text-white truncate text-sm">
      ${biggestExpense.category}
    </h1>
  </div>

  <div class="flex items-center px-3 flex-shrink-0">
    <h1 class="text-[#079F9F] font-['DM_Sans'] font-bold text-l whitespace-nowrap">
      ${formatToPeso(biggestExpense.amount)}
    </h1>
  </div>

</div>

 `
 }

}