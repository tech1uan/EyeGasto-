import { addSavings, deductSavings, userSavings } from "../data/savings.js";
import { renderSavingsHTML } from "../ui/renderSavings.js";
import { confirmMessage } from "../core/confirmActions.js";
import { addTransaction } from "../data/transactions.js";


let messageTimer = null;

export function showMessage(el,text, duration = 3000) {
  clearTimeout(messageTimer);
  el.style.display = 'block';
  el.innerText = text,
  messageTimer = setTimeout(() => {
    el.style.display = 'none';
    el.innerText = '';
  }, duration);
}

function hideAddWithdrawModal() {
const expensesNavInnerContainer = document.querySelector('.expenses-nav-inner-container');
const expensesNavContainer = document.querySelector('.expenses-nav-container');
const addWithdrawOptionContainer = document.querySelector('.add-withdraw-option-container');

expensesNavInnerContainer.classList.remove('hidden');
addWithdrawOptionContainer.classList.add('hidden');
expensesNavContainer.classList.add('hidden');
}

export function initAddWithdraw() {

  const addMoneyBtn = document.getElementById('js-add-button');
  const withdrawMoneyBtn = document.getElementById('js-withdraw-button');
  const descriptionInput = document.getElementById('description');
  const amountInput = document.getElementById('amount');
  const error = document.getElementById('error');
  const success = document.getElementById('success');


  addMoneyBtn.addEventListener('click', () => {
    let type = 'add';
    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);

    if(!description) {
      showMessage(error, 'Please enter a description');
      return;
    }

    if(!amountInput.value || Number(amountInput.value) < 1 || isNaN(amountInput.value)) {
      showMessage(error, 'Please enter a valid amount');
      return
    }

    confirmMessage(`Are you sure you want to add <strong>₱${amount}?</strong>`, async () => {
      try {
      const result = await addSavings(amount);

      if(!result.success) {
        const msg = 
        result.error?.errors[0].msg ||
        'Something went wrong';

        showMessage(error, msg);
        return;
      }
      await addTransaction(amount,description,type)
      renderSavingsHTML();
      descriptionInput.value = '';
      amountInput.value = '';
      hideAddWithdrawModal();
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

    if(!description) {
      showMessage(error, 'Please enter a description');
      return;
    }

    if (!amountInput.value || amountInput.value.trim() === '') {
          showMessage(error, 'Please enter an amount');
          return;
        }


      if(isNaN(amount)) {
        showMessage(error, 'Amount must contain digits only.')
        return;
      }

      if (amount < 1) {
      showMessage(error, 'Amount must be greater than 0');
      return;
      }


    confirmMessage(`Are you sure you want to withdraw <strong>₱${amount}</strong>?`, async () => {
      try {

      const savings = await userSavings();

      if (!savings) {
          showMessage(error, 'Failed to load savings');
          return;
        }

      if(savings.money < amount) {
       showMessage(error, 'Insufficient funds!')
        return;
      }

     const result = await deductSavings(amount);
      console.log(result);
      if (!result.success) {
        const msg =
          result.error?.errors[0].msg ||
          'Something went wrong';
    
        showMessage(error, msg);
        return;
      }

      await addTransaction(amount,description,type);
      renderSavingsHTML();
       descriptionInput.value = '';
      amountInput.value = '';
      hideAddWithdrawModal();
      } catch (error) {
      alert('Failed to deduct savings. Check console. ')
      }
    });
  });

  const closeButton = document.getElementById('js-close-modal')

  closeButton.addEventListener('click', () => {
    document.querySelector('.expenses-nav-container').classList.add('hidden');
  })


  const cancelBtn = document.getElementById('js-cancel-btn');

  cancelBtn.addEventListener('click', () => {
    document.querySelector('.add-withdraw-option-container').classList.add('hidden');
    document.querySelector('.expenses-nav-inner-container').classList.remove('hidden');
  })
}


