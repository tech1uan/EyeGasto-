
import { initEditExpense } from "./editExpense.js";
import { initDeleteExpense } from './deleteExpense.js';

export function initEditExpensesTools() {

    initEditExpense();
    initDeleteExpense();
    
    const containers = document.querySelectorAll('.expenses-container, .expenses-container-b');
    if(!containers) return;

    containers.forEach(c => {
    c.addEventListener('click', (e) => {
       const btn = e.target.closest('.js-show-button');

       if(btn) {
        const dropdown = btn.querySelector('.js-dropdown');
        if(dropdown) {
            dropdown.classList.toggle('hidden');
        }
       }
    });

    document.addEventListener('click', (e) => {
         if(!e.target.closest('.js-show-button')) {
            document.querySelectorAll('.js-dropdown').forEach(d => {
                d.classList.add('hidden');
            })
         }
    })
    })
}