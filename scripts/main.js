import '../scripts/savings.js'
import { renderAddWithdrawHTML } from './renderAddWithdraw.js';
import { addMoneyInSavingsHTML } from '../scripts/savings.js';
import { renderSavingsHTML } from './renderSavings.js';



function showAddWithdrawOption () {
  const addWithdrawBtn = document.querySelector('.add-withdraw-money');
  const addWithdrawContainer = document.querySelector('.add-withdraw-option-container');

  addWithdrawBtn.addEventListener('click', () => {
   addWithdrawContainer.classList.remove("hidden");
  })
  
}

export function hideAddWithdrawOption () {
  const addWithdrawContainer = document.querySelector('.add-withdraw-option-container');

 addWithdrawContainer.classList.add("hidden");

 addWithdrawContainer.addEventListener('click', (e) => {
  if(e.target === addWithdrawContainer) {
    addWithdrawContainer.classList.add("hidden");
  }
 })
}

renderSavingsHTML();
renderAddWithdrawHTML();
addMoneyInSavingsHTML();
showAddWithdrawOption();
hideAddWithdrawOption();

