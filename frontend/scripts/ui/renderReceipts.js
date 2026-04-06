import "../data/savings.js"
import { formatToPeso } from "../core/utils.js";
import { getCurrentTransactions } from "../features/transactions/viewTransactions.js";




export function initReceipts() {

  
const receiptBtn = document.querySelector('.js-receipt-btn');
const transactionsContainer = document.querySelector('.transactions-container');
const closeBtn = document.querySelector('.js-close-transactions');


receiptBtn.addEventListener('click', () => {
transactionsContainer.classList.remove('hidden');
updateReceiptHTML();
})

if(closeBtn)
closeBtn.addEventListener('click', () => {
transactionsContainer.classList.add('hidden')
});

transactionsContainer.addEventListener('click', (e) => {
  if(e.target === transactionsContainer) {
    transactionsContainer.classList.add('hidden');
  }
})
}


export function updateReceiptHTML() {
  const receiptsContainer = document.querySelector('.receipts-container');

   let html = "";
  
   let transactions = getCurrentTransactions();

   if(transactions.length === 0) {
    receiptsContainer.innerHTML =
    `
    <p class = "text-center pt-4">No transactions yet.</p>
    `
    return;
   }

  transactions.forEach((tx)=> {

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

  receiptsContainer.innerHTML = html;
}

