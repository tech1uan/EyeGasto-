import { budget } from "../data/budget.js";
import { currentView } from "../ui/renderBudget.js";

export async function openSetBudgetModal(mode) {
    

    const closeBtn = document.getElementById('js-close-budget');
    const saveBtn = document.getElementById('js-save-budget');
    if(!closeBtn || !saveBtn) return;

    closeBtn.onclick = async () => {
        document.querySelector('.edit-budget-container').classList.add('hidden');
    }
    
    if(mode === 'add-daily') {
        saveBtn.dataset.mode = 'add-daily';
        document.querySelector('.edit-budget-container').classList.remove('hidden');
        document.querySelector('.budget-mode-title').textContent = 'Add Budget';;
        document.querySelector('.budget-mode-description').textContent = 'Set your budget for today and stay on track with your spending.';
    }

    if(mode === 'add-monthly') {
        saveBtn.dataset.mode = 'add-monthly';
        document.querySelector('.edit-budget-container').classList.remove('hidden');
        document.querySelector('.budget-mode-title').textContent = 'Add Budget';;
        document.querySelector('.budget-mode-description').textContent = 'Set your budget for this month and stay on track with your spending.';
    }


    
    const userBudget = await budget.getBudget(currentView)
   

    if(mode === 'edit-daily') {
        document.getElementById('budget-amount').value = await userBudget.originalBudget.toFixed(2);
        saveBtn.dataset.mode = 'edit-daily';
        document.querySelector('.edit-budget-container').classList.remove('hidden');
        document.querySelector('.budget-mode-title').textContent = 'Edit Budget';;
        document.querySelector('.budget-mode-description').textContent =
        'Update your budget amount to better match your spending goals and financial plans.';
    }

    if(mode === 'edit-monthly') {
        document.getElementById('budget-amount').value = await userBudget.originalBudget.toFixed(2);
        saveBtn.dataset.mode = 'edit-monthly';
        document.querySelector('.edit-budget-container').classList.remove('hidden');
        document.querySelector('.budget-mode-title').textContent = 'Edit Budget';;
        document.querySelector('.budget-mode-description').textContent =
        'Update your budget amount to better match your spending goals and financial plans.';
    }
    
}