
import { userSavings } from "../data/savings.js";



export async function renderSavingsHTML () {

  const savingsBalance = document.querySelector('.savings-balance');

  const savings = await userSavings();
  if(!savings) {
    savingsBalance.textContent = '₱0.00';
    return;
  }
  savingsBalance.textContent = savings.getCurrentMoney();
}


