
import { initEditExpense } from "./editExpense.js";
import { initDeleteExpense } from './deleteExpense.js';

export function initEditExpensesTools() {

    initEditExpense();
    initDeleteExpense();
    
    const container = document.querySelector('.expenses-container');
    if(!container) return;

    container.addEventListener('click', (e) => {
       const btn = e.target.closest('.js-show-button');

       if(btn) {
        const dropdown = document.querySelector('.js-dropdown');
        dropdown.classList.toggle('hidden')
       }
    });

    document.addEventListener('click', (e) => {
         if(!e.target.closest('.js-show-button')) {
            document.querySelectorAll('.js-dropdown').forEach(d => {
                d.classList.add('hidden');
            })
         }
    })
}