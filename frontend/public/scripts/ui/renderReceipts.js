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


export async function  updateReceiptHTML() {
  const receiptsContainer = document.querySelector('.receipts-container');

   let html = "";
  
   let transactions = await getCurrentTransactions();
  
   if(transactions.length === 0) {
    receiptsContainer.innerHTML =
    `
    <p class = "text-center pt-4 text-white">No transactions yet.</p>
    `
    return;
   }

  transactions.forEach((tx)=> {
   
  const amountColor = tx.type === 'add' ? 'text-teal-300' : 'text-red-400';
  html+= 


  `
  <div class="receipt-item p-2 bg-white/[0.06] border border-white/10 backdrop-blur-sm rounded-xl grid grid-cols-4 py-1">
  <div class = "text-center ${amountColor} font-bold">${formatToPeso(tx.amount)}</div>
  <div class = "text-center text-white/75 font-bold">${tx.description}</div>
  <div class = "text-center text-white/75 font-bold">${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</div>
  <div class = "text-center text-white/60">${dayjs(tx.date_time).format('MMMM D, YYYY')}</div>
  </div >
  
  `
  });

  receiptsContainer.innerHTML = html;
}

