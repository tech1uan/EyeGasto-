
import { getExpensesByRange } from "../../data/expenses.js";
import { groupExpensesByCategory } from "../expenses/groupExpensesByCategory.js";

let analyticsDonutChart = null;


export async function updateAnalyticsDonut(range) {
    const expenses = await getExpensesByRange(range);
  
    if(!expenses?.expenses.length) {
        document.querySelector('.analytics-no-data')?.classList.remove('hidden');
        document.querySelector('.analytics-donut-container')?.classList.add('hidden');
    
    if(analyticsDonutChart) {
        analyticsDonutChart.destroy();
        analyticsDonutChart = null;
    }

    return;
}
    document.querySelector('.analytics-no-data')?.classList.add('hidden');
    document.querySelector('.analytics-donut-container')?.classList.remove('hidden');

      const grouped = groupExpensesByCategory(expenses.expenses);
      
        const labels  = Object.keys(grouped);
        const amounts = labels.map(l => parseFloat(grouped[l].total));
        const colors  = labels.map(l => grouped[l].color);

        renderAnalyticsChart(labels, amounts, colors);
        renderAnalyticsLegend(grouped);
}       

function renderAnalyticsChart(labels,data,colors) {

    const canvas = document.getElementById('analyticsDonutChart');
    if(!canvas) return;

    const ctx = canvas.getContext('2d');

    if(analyticsDonutChart) analyticsDonutChart.destroy();

     analyticsDonutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 0,
        borderRadius: 8,
        spacing: 2
      }]
    },
options: {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  animation: { duration: 800 },
  plugins: {
    legend: { display: false },
    datalabels: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const value = Number(context.raw);

          return `${context.label}: ₱${value.toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`;
        }
      }
    }
  }
}

  });
}

function renderAnalyticsLegend(grouped) {
  const legend = document.getElementById('analyticsLegend');
  if (!legend) return;

  const total = Object.values(grouped)
    .reduce((s, i) => s + parseFloat(i.total), 0);
  const safeTotal = total || 1;

  legend.innerHTML = Object.entries(grouped)
    .map(([category, item]) => {
      const amount = parseFloat(item.total).toFixed(2);
      const percent = ((amount / safeTotal) * 100).toFixed(1);
      return `
       <div class="flex flex-col gap-1 py-1">

          <div class="flex items-center justify-between">

            <div class="flex items-center gap-2 font-['DM_Sans']">
            
              <span class="text-sm"><img src ="${item.logo ?? '💰'}"
              class = "w-3 h-3"</img></span>
              <span class="text-xs font-medium text-[#c5e8e2]">
                ${category}
              </span>
            </div>

            <span class="text-xs font-semibold font-['DM_Sans'] text-[#e0f5f0] ">
              ₱${amount.toLocaleString('en-PH', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </span>

          </div>

          <div class="h-[3px] bg-[#1f4040] rounded-full ">
            <div
              class="h-[3px] rounded-full transition-all duration-500"
              style="width:${percent}%; background:${item.color}">
            </div>
          </div>

        </div>
      `;
    }).join('');
}