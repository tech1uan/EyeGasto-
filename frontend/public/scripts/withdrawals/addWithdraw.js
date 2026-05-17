import { addSavings, deductSavings, userSavings } from "../data/savings.js";
import { renderSavingsHTML } from "../ui/renderSavings.js";
import { confirmMessage } from "../core/confirmActions.js";
import { addTransaction } from "../data/transactions.js";

export function initAddWithdrawOption () {
  const showButton = document.querySelector('.add-withdraw-money');
  const closeButton = document.querySelector('.js-close-add-withdraw');
  const modal = document.querySelector('.add-withdraw-option-container');

 showButton.addEventListener("click", () => modal.classList.remove("hidden"));
 closeButton.addEventListener("click", () => modal.classList.add("hidden"));
}

export function hideAddWithdraw () {
  document.querySelector('.add-withdraw-option-container').classList.add('hidden');
}

export function initAddWithdraw() {

  const addMoneyBtn = document.querySelector('.js-add-button');
  const withdrawMoneyBtn = document.querySelector('.js-withdraw-button');
  const descriptionInput = document.getElementById('description');
  const amountInput = document.getElementById('amount');

  addMoneyBtn.addEventListener('click', () => {
    let type = 'add';
    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);

    if(!description)
      return alert('Please enter a description!');
  
    
    if(!amount)
      return alert('Please enter a valid amount!');
    

    confirmMessage(`Are you sure you want to add <strong>₱${amount}?</strong>`, async () => {
      try {
      await addSavings(amount);
      await addTransaction(amount,description,type)
      renderSavingsHTML();
      descriptionInput.value = '';
      amountInput.value = '';
      hideAddWithdraw();
      } catch (error) {
      console.error('Error updating savings: ', error);
      alert('Failed to update savings. Check console.')
      }

    });
  });

  withdrawMoneyBtn.addEventListener('click', () => {
    let type = 'withdraw';
    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);

    if(!description)
      return alert ('Please enter a description!');

    if(!amount) 
      return alert ('Please enter a valid amount!');


    confirmMessage(`Are you sure you want to withdraw <strong>₱${amount}</strong>?`, async () => {
      try {
      const savings = await userSavings();
      if(savings.money < amount) {
        alert('Insufficient funds!');
        return;
      }
      await deductSavings(amount)
      await addTransaction(amount,description,type);
      renderSavingsHTML();
       descriptionInput.value = '';
      amountInput.value = '';
      hideAddWithdraw();
      } catch (error) {
      console.error('Error deducting savings: ', error);
      alert('Failed to deduct savings. Check console. ')
      }
    });
  });
}


