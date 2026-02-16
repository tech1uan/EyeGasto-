import "../data/savings.js"
import { savingsMoney } from "../data/savings.js";
import { formatToPeso } from "./utils.js";




export function showReceipts() {
  const receiptBtn = document.querySelector('.js-receipt-btn');
  const transactionsContainer = document.querySelector('.transactions-container');

  receiptBtn.addEventListener('click', () => {
  transactionsContainer.classList.remove("hidden");
  updateReceiptHTML();
  console.log(transactionsContainer)
});

closeReceipts();

}


function updateReceiptHTML() {

  const receiptContainer = document.querySelector('.receipts-container');
   let html = "";


  savingsMoney.transactions.forEach((tx)=> {

  html+= 
  `
  <div class="receipt-item p-2 border-b border-gray-300 grid grid-cols-4 py-1">
  <div class = "text-center">${formatToPeso(tx.amount)}</div>
  <div class = "text-center">${tx.description}</div>
  <div class = "text-center">${tx.type}</div>
  <div class = "text-center">${tx.date}</div>
  </div >
  
  `

  });

  receiptContainer.innerHTML = html;
}


function closeReceipts() {

  const transactionsContainer = document.querySelector('.transactions-container');
  if (!transactionsContainer) return;

  document.addEventListener('click', (e) => {
   
    if(e.target === transactionsContainer) {
      transactionsContainer.classList.add("hidden");
    }
  })

  }

