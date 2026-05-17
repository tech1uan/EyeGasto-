
import { formatToPeso } from "../../core/utils.js";
import { currentView, getCurrentExpenses } from "./viewExpense.js";

export async function fetchTotalExpenses(range) {
  try {
    const res = await fetch(`expenses/summary/${range}`, {
      method:'GET',
      credentials: 'include',
    })

    const data = await res.json();

    if(!res.ok) {
      console.log(data.msg);
      return null
    }

    return data.expenses;
  } catch (error) {
    console.error(error);
    return null
  }
}

let cachedTotalExpenses = 0;


export async function updateTotalExpenses() {
 const range = currentView;
 
 const total = await fetchTotalExpenses(range);

 if(total == null) return;

 cachedTotalExpenses = total;

 renderTotalExpensesHTML();
}

export function renderTotalExpensesHTML() {
   
  const totalExpense = document.querySelector('.total-expenses');
  if(totalExpense) {
  totalExpense.textContent = formatToPeso(cachedTotalExpenses);
}
}

