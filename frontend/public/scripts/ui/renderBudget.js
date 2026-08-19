import { getRelativeTime } from "../core/utils.js";
import {  budget } from "../data/budget.js";
import { openSetBudgetModal } from "../budget/budgetModal.js";

export let currentView = 'daily';

export async function renderBudget(data = null) {
   if (!data) {
    data = await budget.getBudget(currentView);
  }

  const isDaily = currentView === 'daily';

  const el = isDaily
    ? document.querySelector('.dailyBudgetAmounts')
    : document.querySelector('.monthlyBudgetAmounts');

  const bar = isDaily
    ? document.getElementById('dailyBudgetBar')
    : document.getElementById('budgetBar');

  const editBtn = isDaily
    ? document.getElementById('edit-daily-budget-btn')
    : document.getElementById('edit-monthly-budget-btn');

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

 if (!el || !bar) return;
  bar.style.width = '0%';
  

  const today = new Date();
  
  const dayNameToday = days[today.getDay()];
  
  const pulseDays = document.querySelectorAll('.pulse-day');

  pulseDays.forEach(day => {
  const isToday = day.dataset.day === dayNameToday;

  day.classList.toggle("active-day", isToday);
});


  const original = Number(data.originalBudget) || 0;
  const remaining = Number(data.budget) || 0;
  const spent = original - remaining;

  if (original <= 0) {
    const hintId = isDaily ? 'set-daily-budget-hint' : 'set-monthly-budget-hint';
    el.innerHTML = `
      <p class="text-[15px] sm:text-[16px] font-['DM_Sans'] text-black/30">No budget set</p>
      <p class="text-[10px] sm:text-[11px] font-['DM_Sans'] font-bold text-[#079F9F] cursor-pointer hover:underline" id="${hintId}">
        Set ${isDaily ? 'daily' : 'monthly'} budget →
      </p>
    `;
    el.classList.remove("text-red-600");
    el.classList.add("text-[#079F9F]");
    bar.style.width = '0%';
    bar.style.background = '#e5e7eb';

    if (editBtn) editBtn.classList.add('hidden');

    const hint = document.getElementById(hintId);
    if (hint) {
      hint.addEventListener('click', () => {
        openSetBudgetModal(isDaily ? 'add-daily' : 'add-monthly');
      });
    }
    return;
  }

  if (editBtn) editBtn.classList.remove('hidden');

  el.innerHTML = `
    <p class="text-2xl sm:text-[26px] md:text-[28px] font-['DM_Sans']">
      ${remaining.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
    </p>
    <p class="font-['DM_Sans'] text-[11px] sm:text-xs text-black/50">
      Spent: ${spent.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })} of ${original.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
    </p>
  `;

  const percent = Math.min(((spent / original) * 100), 100);
  bar.style.width = percent + '%';

  if (remaining < 0) {
    el.classList.add("text-red-600");
    el.classList.remove("text-[#079F9F]");
    bar.style.background = '#ef4444';
  } else if (percent >= 100 || remaining <= 0) {
    el.classList.remove("text-red-600");
    el.classList.add("text-[#d97706]");
    bar.style.background = '#f59e0b';
  } else {
    el.classList.remove("text-red-600");
    el.classList.remove("text-[#d97706]");
    el.classList.add("text-[#079F9F]");
    bar.style.background = '#22c55e';
  }
}

export async function initBudgetTabFilter() {
  const budgetTabDaily = document.getElementById('budget-tab-daily');
  const budgetTabMonthly = document.getElementById('budget-tab-monthly');

 setActiveBtn(budgetTabDaily, budgetTabMonthly)

  budgetTabDaily.addEventListener('click', async () => {
    currentView = 'daily'
      setActiveBtn(budgetTabDaily, budgetTabMonthly)
      document.getElementById('daily-budget-panel').classList.remove('hidden');
       document.getElementById('monthly-budget-panel').classList.add('hidden');
       renderBudget();
  })

  budgetTabMonthly.addEventListener('click', async () => {
    currentView = 'monthly'
          document.getElementById('daily-budget-panel').classList.add('hidden');
       document.getElementById('monthly-budget-panel').classList.remove('hidden');
      setActiveBtn(budgetTabMonthly, budgetTabDaily)
       renderBudget();
  })
}


function moveSlider(button) {
  const slider = document.getElementById('tab-slider');
  slider.style.width = `${button.offsetWidth}px`;
  slider.style.transform = `translateX(${button.offsetLeft}px)`;
}

function setActiveBtn(activeBtn, inactiveBtn) {
 moveSlider(activeBtn);
 
 activeBtn.classList.add("text-white");
 activeBtn.classList.remove("text-black/50");

 inactiveBtn.classList.remove("text-white");
 inactiveBtn.classList.add("text-black/50");

}
