import { confirmMessage } from "../../core/confirmActions.js";
import { formatToPeso } from "../../core/utils.js";
import { invalidateSavingsCache, updateSavingsGoal, userSavings } from "../../data/savings.js";

export async function initEditGoalModal() {
    const button = document.getElementById('edit-goal-btn');
    const modal = document.querySelector('.edit-goal-option-container');
    const saveButton = document.getElementById('js-save-goal');
    const closeButton = document.getElementById('js-close-goal');


    if (!button || !modal || !saveButton || !closeButton) return;

    button.addEventListener('click', () => {
        modal.classList.remove('hidden'); 
        modal.classList.add('flex');
    });
   

    try {
      const savings = await userSavings();
       document.getElementById('edit-goal-description').value =  savings.goalDescription
       document.getElementById('edit-goal-amount').value = savings.targetAmount
    
      saveButton.onclick = async () => {
        const goalDescription = document.getElementById('edit-goal-description').value;
        const goalAmount = Number(document.getElementById('edit-goal-amount').value);
        confirmMessage('green',`Do you wish to save this change to <strong>${goalDescription}</strong>`, async () => {
            const data = await updateSavingsGoal(goalDescription, goalAmount);
            if(!data) {
                alert('Failed to update goaL!');
                return;
            }
            invalidateSavingsCache();
            await initGoal();
            modal.classList.add('hidden');
        
       })
      }

      closeButton.onclick =  () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
       
      
    } catch (error) {
     console.log(error)
    }
}

export async function initGoal() {
    const savingsGoalContainer = document.querySelector('.savings-goal');
    const currentSavingsGoalContainer = document.querySelector('.current-savings-goal');

    try {
        const savings = await userSavings();
        if(!savings) return;
        
        savingsGoalContainer.textContent = `${formatToPeso(savings.targetAmount)}`;
        currentSavingsGoalContainer.textContent = `Current goal: ₱${savings.targetAmount}`;

        const currentSavings = Number(savings.money);
        const savingsGoal = Number(savings.targetAmount);

      const percent =
            savingsGoal === 0
                ? 0
                : Math.round((currentSavings / savingsGoal) * 100);

        const budgetBar = document.getElementById('goalBudgetBar')
    
        budgetBar.style.width = percent + '%';

        if(Math.round(percent) >= 100)  {
            budgetBar.style.background = '#EF4444'
            savingsGoalContainer.innerHTML = `Goal reached!`;
        } else {
           budgetBar.style.background = 'linear-gradient(to right, #00FFCC, #00FFF5)';
        }

         document.querySelector('.goal-bar-percent').textContent = `${percent.toFixed(0)}%`

    
    } catch (error) {
        console.error("Failed to load savings goal:", error);
        savingsGoalContainer.textContent = 'Unavailable';
    }

}