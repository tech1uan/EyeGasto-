import { formatToPeso } from "../../core/utils.js";
import { budget } from "../../data/budget.js";
import { getComparisonStats, getExpensesByRange, getMonthlyStats, getMonthStats } from "../../data/expenses.js";
import { groupExpensesByCategory } from "../expenses/groupExpensesByCategory.js";
import { fetchTotalExpenses } from "../expenses/totalExpenses.js";
import { updateAnalyticsDonut } from "./analyticsExpensesByCategoryChart.js";
import { updateSmartInsights } from "./analyticsSmartInsights.js";
import { updateBudgetComparisonChart } from "./budgetComparisonChart.js";

export let currentView = "last7";

function resetTipClasses(...elements) {
  const colorClasses = [
    "text-[#e06a6a]",
    "text-[#1dc49a]",
    "text-[#e0f5f0]",
    "text-[#22C55E]",
    "text-[#EF4444]",
    "text-[#F59E0B]",
  ];
   elements.forEach((el) => {
    if (el) {
      el.classList.remove(...colorClasses);
      el.classList.add("text-[#7FA39B]"); 
      el.textContent = "—";
    }
  });
}

function getRangeLabel(range) {
  const labels = {
    last7: "last 7 days",
    "1month": "last month",
    "6months": "last 6 months",
    alltime: "all time",
  };
  return labels[range] || range;
}

export async function updateAnalytics(range) {
  const totalSpentContainer = document.querySelector(".total-spent");
  const tipMessage = document.querySelector(".total-tip-message");
  const averageContainer = document.querySelector(".average");
  const averageTipContainer = document.querySelector(".avg-tip-message");
  const savedThisMonthContainer = document.querySelector(".saved-this-month");
  const savedTipContainer = document.querySelector(".saved-tip-message");
  const budgetLeftContainer = document.querySelector(".budget-left");
  const budgetTip = document.querySelector(".budget-tip-message");

  resetTipClasses(
    tipMessage,
    averageTipContainer,
    savedTipContainer,
    budgetTip
  );

  const [totalSpentAmount, comparisonStats, monthlyStats, thisMonthSpent] = await Promise.all([
    fetchTotalExpenses(range),
    getComparisonStats(range), 
    getMonthlyStats(range),
    getMonthStats()
]);

  const data = await budget.getBudget('monthly')

  const monthlyBudget = data.originalBudget || 0

  const daysLogged = monthlyStats?.stats?.days_logged || 0
  const totalSpent = monthlyStats?.stats?.total_spent || 0
  const totalSpentLastPeriod = comparisonStats?.stats?.previous || 0;

  totalSpentContainer.textContent = formatToPeso(totalSpentAmount);

  if (totalSpentLastPeriod > 0) {
    const spentPercent =
      ((totalSpentAmount - totalSpentLastPeriod) / totalSpentLastPeriod) * 100;
     
      const previous = getRangeLabel(range);

    tipMessage.classList.remove("text-[#7FA39B]")

    if (spentPercent > 0) {
      tipMessage.textContent = `↑ ${spentPercent.toFixed(0)}% vs ${previous}`;
      tipMessage.classList.add("text-[#e06a6a]");
    } else if (spentPercent < 0) {
      tipMessage.textContent = `↓ ${Math.abs(spentPercent).toFixed(0)}% vs ${previous}`;
      tipMessage.classList.add("text-[#1dc49a]");
    } else {
      tipMessage.textContent = `— same as ${previous}`;
      tipMessage.classList.add("text-[#e0f5f0]");
    }

}  
  const avgPerDay = daysLogged > 0 ? totalSpent / daysLogged : 0;

  averageContainer.textContent = formatToPeso(avgPerDay);
  averageTipContainer.textContent = `${daysLogged} days logged`;
  averageTipContainer.classList.add("text-[#e0f5f0]");

  const savedThisMonth = monthlyBudget - thisMonthSpent.totalSpent;

  savedThisMonthContainer.textContent = formatToPeso(savedThisMonth);

  if (savedThisMonth >= 0) {
    savedTipContainer.textContent = `↗ +${formatToPeso(savedThisMonth)}`;
    savedTipContainer.classList.add("text-[#22C55E]");
  } else {
    savedTipContainer.textContent = `↘ ${formatToPeso(savedThisMonth)}`;
    savedTipContainer.classList.add("text-[#EF4444]");
  }


  const totalSpentThisMonth = await fetchTotalExpenses('1month')
  
  const budgetLeft = monthlyBudget - totalSpentThisMonth

  budgetLeftContainer.textContent = formatToPeso(budgetLeft || 0);

  if (!monthlyBudget || monthlyBudget <= 0) {
    budgetTip.textContent = "Set a budget";
    budgetTip.classList.add("text-[#e0f5f0]");
  
  } else {

  const budgetPercent = totalSpentThisMonth / monthlyBudget;

  if (budgetPercent <= 0.8) {
    budgetTip.textContent = "↗ On Track";
    budgetTip.classList.add("text-[#22C55E]");
  } else if (budgetPercent <= 1) {
    budgetTip.textContent = "↘ Watch Spending";
    budgetTip.classList.add("text-[#F59E0B]");
  } else {
    budgetTip.textContent = "↙ Over Budget";
    budgetTip.classList.add("text-[#EF4444]");
  }
}

  const expenses = await getExpensesByRange(range);
  const expenseArray = Array.isArray(expenses) 
      ? expenses 
      : expenses.expenses || [];

  const grouped = groupExpensesByCategory(expenseArray);
  const categoryBreakdown = {};

   Object.entries(grouped).forEach(([cat,item]) => {
    categoryBreakdown[cat] = item.total
   })

    
  await updateSmartInsights(totalSpentAmount, monthlyBudget, categoryBreakdown, daysLogged, range)

}
export async function initAnalytics() {
  setActiveBtn(document.querySelector(`button[value="${currentView}"]`));

  showAnalyticsLoader();

await Promise.all([
    updateAnalyticsDonut(currentView),
    updateAnalytics(currentView),
    updateBudgetComparisonChart()
]);

hideAnalyticsLoader();
}

export async function initAnalyticsFilter() {
  const navContainer = document.querySelector(".analytics-nav-container");
  navContainer.addEventListener("click", async (e) => {
      
    const button = e.target.closest("button");
    if (!button) return;

    currentView = button.value;
    setActiveBtn(document.querySelector(`button[value="${currentView}"]`));
    
    showAnalyticsLoader();

    await Promise.all([
     updateAnalyticsDonut(currentView),
     updateAnalytics(currentView)
     ])

     hideAnalyticsLoader();
   
  });
}

function setActiveBtn(activeBtn) {
  const indicator = document.querySelector(".analytics-nav-indicator");

  document.querySelectorAll(".analytics-btn").forEach((btn) => {
    btn.classList.remove("text-[#e0f5f0]");
    btn.classList.add("text-[#7FA39B]");
  });

  if (activeBtn) {
    activeBtn.classList.add("text-[#e0f5f0]");
    activeBtn.classList.remove("text-[#7FA39B]");

    const container = document.querySelector(".analytics-nav-container");
    const containerRect = container.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    indicator.style.left = `${btnRect.left - containerRect.left}px`;
    indicator.style.width = `${btnRect.width}px`;
  }
}


export function showAnalyticsLoader() {

    document
        .getElementById("analytics-loader")
        .classList.remove("hidden");

    document
        .querySelector(".analytics-content")
        .classList.add("hidden");

}

export function hideAnalyticsLoader() {

    document
        .getElementById("analytics-loader")
        .classList.add("hidden");

    document
        .querySelector(".analytics-content")
        .classList.remove("hidden");

}