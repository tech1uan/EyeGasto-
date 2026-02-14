import { expenses } from "./expenses.js";
import { handleAddExpense } from "./modals/addExpense.js";
import { formatToPeso, removeJustifyCenter } from "./utils.js";


export function renderExpensesHTML () {
  
  const container = document.querySelector('.expenses-container');
  removeJustifyCenter(container);

  let html = "";

  expenses.forEach((expense) => {
  
   
  html +=
  `
  <div class = "flex w-full justify-evenly items-center rounded-xl bg-white p-2">
   <h1 class = "font-bold">${expense.description}</h1>
   <div class = "rounded-full flex py-1 px-4 gap-2 items-center" style="background-color: ${expense.color}">
     <img class = "w-5" src = "${expense.logo}">
     <h1 class ="text-white font-bold text-[12px]">${expense.category}</h1>
   </div>
   <h1 class = " text-[#079F9F] font-['DM_Sans'] font-bold text-xl"" >${formatToPeso(expense.amount)}</h1>
  </div>
  
  `
});

container.innerHTML = html;


}