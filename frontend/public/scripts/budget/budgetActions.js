
import { confirmMessage } from "../core/confirmActions.js";
import { budget } from "../data/budget.js";
import { initAnalytics } from "../features/analytics/analytics.js";
import { recalculateBudget } from "../notifs/pushNotifications.js";
import { hideLoading, showLoading } from "../ui/loading.js";
import { renderBudget } from "../ui/renderBudget.js";
import { showMessage } from "../withdrawals/addWithdraw.js";
import { openSetBudgetModal } from "./budgetModal.js";


export function initBudgetModal () {
  
  const showAddDailyBudgetBtn  = document.getElementById('add-daily-budget-navigator');
  const showAddMonthlyBudgetBtn = document.getElementById('add-monthly-budget-navigator');

  showAddDailyBudgetBtn.addEventListener('click', () => {
   openSetBudgetModal('add-daily');
  })

  showAddMonthlyBudgetBtn.addEventListener('click', () => {
   openSetBudgetModal('add-monthly');
  })

  const showEditDailyBudgetBtn = document.getElementById('edit-daily-budget-btn');
  showEditDailyBudgetBtn.addEventListener('click', () => {
    openSetBudgetModal('edit-daily');
 
  })

  const showEditMonthlyBudgetBtn = document.getElementById('edit-monthly-budget-btn');
  showEditMonthlyBudgetBtn.addEventListener('click', () => {
    openSetBudgetModal('edit-monthly');
 
  })

}

export function initSaveBudget() {
  
  const saveBtn = document.getElementById('js-save-budget');
  const successMessage = document.getElementById('success-budget');
  const errorMessage = document.getElementById('error-budget');

  if(!saveBtn) return;
 
  saveBtn.onclick = async () => {
    const mode = saveBtn.dataset.mode;
    const amount = Number(document.getElementById('budget-amount').value);

    if(!amount) {
      showMessage(errorMessage, 'Please enter an amount!');
      return;
    }

    if(amount < 0) {
      showMessage(errorMessage, 'Please enter a valid amount!');
      return;
    }

    if(mode == 'add-daily') {
    confirmMessage('green', `Do you want to add this amount?`, async () => {
    saveBtn.disabled = true;
    showLoading(saveBtn);
    try {
    const success = await budget.addBudget(amount,'daily');
      showMessage(successMessage, 'Budget added successfully!');
      document.querySelector('.edit-budget-container').classList.add('hidden');
       document.querySelector('.expenses-nav-container').classList.add('hidden');
      document.getElementById('budget-amount').value = '';
      
      await renderBudget();
      await checkBudgetData();

    } finally {
  
    saveBtn.disabled = false
    hideLoading(saveBtn);
    } 
  })
    } else if (mode == 'add-monthly') {
    confirmMessage('green', `Do you want to add this amount?`, async () => {
    saveBtn.disabled = true;
    showLoading(saveBtn);
    try {
    const success = await budget.addBudget(amount,'monthly');

      showMessage(successMessage, 'Budget added successfully!');
      document.querySelector('.edit-budget-container').classList.add('hidden');
          document.querySelector('.expenses-nav-container').classList.add('hidden');
      document.getElementById('budget-amount').value = '';

        await renderBudget();
      await checkBudgetData();
   
    } finally {
    saveBtn.disabled = false
    hideLoading(saveBtn);
    }
  })
  
    } else if (mode == 'edit-daily') {
    
    if(amount < 0) {
      showMessage(errorMessage, 'Please enter a valid amount!')
      return;
    }

    confirmMessage('green',`Do you want to set this amount?`, async () => {
    saveBtn.disabled = true;
    showLoading(saveBtn);
    
    try {
      await budget.editBudget(amount,'daily');
      showMessage(successMessage, 'Budget edited successfully!');
      document.querySelector('.edit-budget-container').classList.add('hidden');
      document.getElementById('budget-amount').value = '';
      
      await renderBudget();
      await checkBudgetData();

    } finally {
    saveBtn.disabled = false;
    hideLoading(saveBtn);
    }
  })

    } else if (mode == 'edit-monthly') {
    
    if(amount < 0) {
      showMessage(errorMessage, 'Please enter a valid amount!')
      return;
    }

    confirmMessage('green',`Do you want to set this amount?`, async () => {
    saveBtn.disabled = true;
    showLoading(saveBtn);
    
    try {
      await budget.editBudget(amount,'monthly');
      showMessage(successMessage, 'Budget edited successfully!');
      document.querySelector('.edit-budget-container').classList.add('hidden');
      document.getElementById('budget-amount').value = '';
     
    await renderBudget();
     await checkBudgetData();

    } finally {
    saveBtn.disabled = false;
    hideLoading(saveBtn);
    }
  })
}
  }
}


export async function checkBudgetData() {
  const [dataDaily, dataMonthly] = await Promise.all([
    budget.getBudget('daily'),
    budget.getBudget('monthly')
  ]);
  
  const dailySpent = dataDaily?.totalSpent ?? 0;
  const dailyBudget = dataDaily?.originalBudget ?? 0;

  const monthlySpent = dataMonthly?.totalSpent ?? 0;
  const monthlyBudget = dataMonthly?.originalBudget ?? 0;

await Promise.all([
  recalculateBudget(
    dailySpent,
    dailyBudget,
    monthlySpent,
    monthlyBudget
  ),
]);
}
