
import { savingsMoney } from "../data/savings.js";



export function renderSavingsHTML () {

  const savingsBalance = document.querySelector('.savings-balance');

  savingsBalance.textContent = savingsMoney.getCurrentMoney();
}