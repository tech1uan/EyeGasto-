
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
    const isMobile = window.innerWidth < 640;
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
        backgroundColor: 'rgba(0,0,0,0.85)',
        padding: isMobile ? 8 : 12,
        cornerRadius: 8,
        displayColors: true,

        titleFont: {
          size: isMobile ? 10 : 13,
          family: "'DM Sans', sans-serif",
          weight: 'bold'
        },

        bodyFont: {
          size: isMobile ? 9 : 12,
          family: "'DM Sans', sans-serif"
        },

  callbacks: {
    label(context) {
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
     <div class="flex flex-col gap-2 py-1">

  <div class="flex items-center justify-between gap-2">

    <div class="flex items-center gap-2 min-w-0 font-['DM_Sans']">

      <img
        src="${item.logo ?? '💰'}"
        class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
      />

      <span class="text-[10px] sm:text-xs md:text-sm font-medium text-[#c5e8e2] truncate">
        ${category}
      </span>

    </div>

    <span class="flex-shrink-0 text-[10px] sm:text-xs md:text-sm font-semibold font-['DM_Sans'] text-[#e0f5f0]">
      ₱${amount.toLocaleString('en-PH', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })}
    </span>

  </div>

  <div class="h-[3px] sm:h-1 bg-[#1f4040] rounded-full">
    <div
      class="h-full rounded-full transition-all duration-500"
      style="width:${percent}%; background:${item.color}"
    ></div>
  </div>

</div>
      `;
    }).join('');
}