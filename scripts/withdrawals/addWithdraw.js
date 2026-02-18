import { savingsMoney } from "../data/savings.js";
import { renderSavingsHTML } from "../ui/renderSavings.js";
import { confirmMessage } from "../core/confirmActions.js";
import { updateReceiptHTML } from "../ui/renderReceipts.js";

export function initAddWithdrawOption () {
  const showButton = document.querySelector('.add-withdraw-money');
  const closeButton = document.querySelector('.js-close-add-withdraw');
  const modal = document.querySelector('.add-withdraw-option-container');

 showButton.addEventListener("click", () => modal.classList.remove("hidden"));
 closeButton.addEventListener("click", () => modal.classList.add("hidden"));


}

export function hideAddWithdrawOption (button) {
  const container = document.querySelector('.add-withdraw-option-container');

   button.addEventListener('click', () => {
   container.classList.add("hidden");
  });

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
    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);

    if(!description)
      return alert('Please enter a description!');
  
    
    if(!amount)
      return alert('Please enter a valid amount!');
    

    confirmMessage(`Are you sure you want to add <strong>₱${amount}?</strong>`, () => {
      savingsMoney.addMoney(amount, description);
      renderSavingsHTML();
      updateReceiptHTML();
      descriptionInput.value = '';
      amountInput.value = '';
      hideAddWithdraw();
    });
  });



  withdrawMoneyBtn.addEventListener('click', () => {
    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);

    if(!description)
      return alert ('Please enter a description!');

    if(!amount) 
      return alert ('Please enter a valid amount!');


    confirmMessage(`Are you sure you want to withdraw <strong>₱${amount}</strong>?`, () => {
      savingsMoney.withdrawMoney(amount, description);
      renderSavingsHTML();
      updateReceiptHTML();
       descriptionInput.value = '';
      amountInput.value = '';
      hideAddWithdraw();
    });
  });
}


