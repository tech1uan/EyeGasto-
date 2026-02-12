import '../scripts/savings.js'
import { addMoneyInSavingsHTML, withdrawMoneyInSavingsHTML } from '../scripts/savings.js';
import { renderSavingsHTML } from './renderSavings.js';



function showAddWithdrawOption () {
  const addWithdrawBtn = document.querySelector('.add-withdraw-money');
  const addWithdrawContainer = document.querySelector('.add-withdraw-option-container');

  addWithdrawBtn.addEventListener('click', () => {
   addWithdrawContainer.classList.remove("hidden");
   addWithdrawContainer.classList.add("flex");
  })
  
}

export function hideAddWithdrawOption () {
  const addWithdrawContainer = document.querySelector('.add-withdraw-option-container');

 addWithdrawContainer.classList.add("hidden");
 addWithdrawContainer.classList.remove("flex");

 addWithdrawContainer.addEventListener('click', (e) => {
  if(e.target === addWithdrawContainer) {
    addWithdrawContainer.classList.add("hidden");
    addWithdrawContainer.classList.remove("flex");
  }
 })
}

renderSavingsHTML();
addMoneyInSavingsHTML();
withdrawMoneyInSavingsHTML();
showAddWithdrawOption();
hideAddWithdrawOption();

