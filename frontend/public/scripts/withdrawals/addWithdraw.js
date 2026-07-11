import { addSavings, deductSavings, userSavings } from "../data/savings.js";
import { renderSavingsHTML } from "../ui/renderSavings.js";
import { confirmMessage } from "../core/confirmActions.js";
import { addTransaction } from "../data/transactions.js";
import { initGoal } from "../features/savings_goal/goal.js";
import { checkSavingsMilestone } from "../notifs/pushNotifications.js";


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

  const budgetBtn = document.getElementById('js-budget-button');
  const descriptionInput = document.getElementById('description');
  const amountInput = document.getElementById('amount');
  const error = document.getElementById('error');
  const success = document.getElementById('success');


  budgetBtn.addEventListener('click', async () => {
    const type = budgetBtn.dataset.type;

    if(type === 'add') {
    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);

    if(!description) {
      showMessage(error, 'Please enter a description');
      return;
    }

    if(!amountInput.value || Number(amountInput.value) < 1) {
      showMessage(error, 'Please enter a valid amount');
      return
    }

    confirmMessage('green',`Are you sure you want to add <strong>₱${amount}?</strong>`, async () => {
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
      await renderSavingsHTML();
      await initGoal();
      checkSavingsMilestone();
      descriptionInput.value = '';
      amountInput.value = '';
      hideAddWithdrawModal();
      } catch (error) {
       console.log(error)
      }
    });
  } else if (type === 'withdraw') {
    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const currentSavings = await userSavings();

    if(!description) {
      showMessage(error, 'Please enter a description');
      return;
    }

     if (!amountInput.value || amountInput.value.trim() === '') {
          showMessage(error, 'Please enter an amount');
          return;
        }

      if (amount < 1) {
      showMessage(error, 'Amount must be greater than 0');
      return;
      }

      if(amount > currentSavings.money) {
        showMessage(error, 'Insufficient funds!')
        return;
      }


    confirmMessage('green',`Are you sure you want to withdraw <strong>₱${amount}</strong>?`, async () => {
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
      if (!result.success) {
        const msg =
          result.error?.errors[0].msg ||
          'Something went wrong';
    
        showMessage(error, msg);
        return;
      }

      await addTransaction(amount,description,type);
      await renderSavingsHTML();
      await initGoal();
      descriptionInput.value = '';
      amountInput.value = '';
      hideAddWithdrawModal();
      } catch (error) {
      alert('Failed to deduct savings. Check console. ')
      }
    });
  }
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


