import { confirmMessage } from "../core/confirmActions.js";
import { budget } from "../data/budget.js";
import { showNotif } from "../notifs/notifications.js";
import { renderBudget } from "../ui/renderBudget.js";

export function initSetBudgetModal () {
 
  const showButton  = document.getElementById('js-set-budget');
  const closeButton  = document.querySelector('.js-close-budget-modal');
  const modal  = document.querySelector('.js-set-budget-modal');

  showButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
  })
  closeButton.addEventListener('click', () => {
    modal.classList.add('hidden');
  })

}

export function hideBudgetModal () {
  document.querySelector('.js-set-budget-modal').classList.add('hidden');

    
}

export function initAddEditBudget() {
  const addButton = document.getElementById('js-add-budget');
  const editButton = document.getElementById('js-edit-budget');
  const input = document.getElementById('budget-amount');
  const currentBudget = document.querySelector('.currentBudget');
  

  addButton.addEventListener('click', () => {
    const amount = Number(input.value);

    if(!amount) {
      return alert('Please enter an amount!');
    }

    confirmMessage(`Are you sure you want to add <strong>${amount}</strong> for today's budget?`, () =>  {

    budget.addBudget(amount);
    renderBudget();
    showNotif('greetings');
    budget.checkBudgetStatus();
    input.value = '';
    hideBudgetModal();
  })

})

  editButton.addEventListener('click', () => {
    const amount = Number(input.value);
  
   
  if (isNaN(amount) || amount < 0) {
    return alert('Please enter a valid amount!');
  }
  
    confirmMessage(`Are you sure you want to save <strong> ${amount}</strong> for today's budget?`, () =>  {
    budget.editBudget(amount);
    renderBudget();
    budget.checkBudgetStatus();
    input.value = '';
    hideBudgetModal();
  })

})
}
