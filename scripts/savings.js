import { hideAddWithdrawOption } from "./main.js";
import { formatToPeso } from "./utils.js";


export let savingsMoney = {
  money: 0,
  transactions: [],
  

  addMoney(input, description) {
   
      if(typeof input !== "number" || isNaN(input) || input<=0) return;

      this.money += input;
      
      this.transactions.push({
        amount: input,
        description: description,
        type: "deposit",
        date: new Date()
      })

  },

  getCurrentMoney() {
    return formatToPeso(this.money);
  }

}

export function addMoneyInSavingsHTML() {
    const addButton = document.querySelector('.js-add-button');
    let savingsBalanceHTML = document.querySelector('.savings-balance');

    addButton.addEventListener('click', () => {
      const newDescription = document.querySelector('.js-description').value;
      const addedAmount = Number(document.querySelector('.js-amountInput').value);

      savingsMoney.addMoney(addedAmount, newDescription);
      savingsBalanceHTML.textContent = savingsMoney.getCurrentMoney();
      hideAddWithdrawOption();
       

    });

  }
