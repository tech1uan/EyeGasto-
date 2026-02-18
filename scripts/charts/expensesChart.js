import { getCurrentExpenses } from "../features/expenses/viewExpense.js";
import { groupExpensesByCategory } from "../features/expenses/groupExpenses.js";


export function updateExpensesChart() {

  const expenses = getCurrentExpenses();
  
  const canvasParent = document.querySelector('.chart-card-container .inner-card'); 
  const legendDiv = document.getElementById('expensesLegend');

  const noExpenses = !expenses || expenses.length === 0;

  if (noExpenses) {
    showNoDataMessage(canvasParent, legendDiv);
    document.getElementById('expensesLegend').classList.add("hidden");
  } else {
    showChart(expenses, canvasParent, legendDiv);
    document.getElementById('expensesLegend').classList.remove("hidden");
  }
}
function showNoDataMessage(canvasParent, legendDiv) {

  if (window.expensesChartInstance) {
    window.expensesChartInstance.data.labels = [];
    window.expensesChartInstance.data.datasets[0].data = [];
    window.expensesChartInstance.update();
  }

  if (canvasParent) {
    let overlay = canvasParent.querySelector('.no-data-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'no-data-overlay flex flex-col items-center justify-center absolute inset-0 bg-white/10';
      overlay.innerHTML = `
        <div class="text-6xl mb-4">📊</div>
        <p class="text-gray-600 font-semibold">No data yet</p>
        <p class="text-gray-500 text-sm mt-2">Add expenses to see your chart</p>
      `;
      canvasParent.style.position = 'relative';
      canvasParent.appendChild(overlay);
    }
    overlay.style.display = 'flex';
  }

  if (legendDiv) legendDiv.innerHTML = '';
}

function showChart(expenses, canvasParent, legendDiv) {
  const grouped = groupExpensesByCategory(expenses);

  const categoryNames = Object.keys(grouped);
  const categoryAmounts = categoryNames.map(name => parseFloat(grouped[name].total));
  const categoryColors = categoryNames.map(name => grouped[name].color);

  const total = categoryAmounts.reduce((acc, val) => acc + Number(val), 0);
  const safeTotal = total > 0 ? total : 1;

  const canvas = document.getElementById('expensesChart');
  if (!canvas) return;

   const overlay = canvasParent.querySelector('.no-data-overlay');
  if (overlay) overlay.style.display = 'none';

  const ctx = canvas.getContext('2d');

  if (window.expensesChartInstance) {
  window.expensesChartInstance.destroy();
} 

    window.expensesChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categoryNames,
        datasets: [{
          data: categoryAmounts,
          backgroundColor: categoryColors,
          borderWidth: 0,
          borderRadius: 8,
          spacing: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        cutout: '60%',
        animation: { duration: 1000, easing: 'easeOutCubic', animateRotate: true, animateScale: true },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                const name = context.label;
                const amount = (context.parsed);
                const percent = ((amount / safeTotal) * 100).toFixed(2)
                return `${name}: ₱${amount.toLocaleString()} (${percent}%)`;
              }
            }
          },
          datalabels: {
            color: '#fff',
            font: { weight: 'bold', size: 16, family: "'DM Sans', sans-serif" },
            formatter: function(value) {
              const percent = ((value / safeTotal) * 100).toFixed(1)
              if(percent > 5) {
              return percent ? percent + '%' : '';
              } else {
                return null;
              }
            },
            anchor: 'center',
            align: 'center',
            textStrokeColor: 'rgba(0, 0, 0, 0.5)',
            textStrokeWidth: 2
          }
        }
      },
      plugins: [ChartDataLabels]
    });


  createLegend(grouped, safeTotal, legendDiv);
  }





function createLegend(grouped, safeTotal, legendDiv) {
  if (!legendDiv) return;

  let html = '';

  for (let categoryName in grouped) {
    const data = grouped[categoryName];
    const amount = data.total;
    const color = data.color;
    const percent = Math.min(((amount / safeTotal) * 100).toFixed(1), 100);


    html += `
      <div class="flex items-center justify-between py-3 px-4 hover:bg-white/30 rounded-xl transition-all duration-200 cursor-pointer font-['DM_Sans']">
        <div class="flex items-center gap-3 flex-1">
            <div style="width: 16px; height: 16px; border-radius: 50%; background-color: ${color}; box-shadow: 0 1px 2px rgba(0,0,0,0.1);"></div>
          <span class="text-gray-800 font-semibold text-sm mr-3">${categoryName}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-gray-900 font-bold text-sm">₱${amount.toLocaleString()}</span>
          <span class="text-gray-600 text-xs bg-white/50 px-2 py-1 rounded-full">${percent}%</span>
        </div>
      </div>
    `;

    
  }

  legendDiv.innerHTML = html;
}
