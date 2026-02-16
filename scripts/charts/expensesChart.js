import { getCurrentExpenses } from "../features/expenses/expenseVIew.js";
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
    window.expensesChartInstance.destroy();
    window.expensesChartInstance = null;
  }

  if (canvasParent) {
    canvasParent.innerHTML = `
      <div class="title-container">
        <h3 class="text-xl font-bold text-gray-800 text-center w-full">
          Expenses by Category
        </h3>
      </div>
      <div class="flex flex-col items-center justify-center py-12">
        <div class="text-6xl mb-4">📊</div>
        <p class="text-gray-600 font-semibold">No data yet</p>
        <p class="text-gray-500 text-sm mt-2">Add expenses to see your chart</p>
      </div>
    `;
  }

  if (legendDiv) {
    legendDiv.innerHTML = '';
  }
}



function showChart(expenses, canvasParent, legendDiv) {
  
  const grouped = groupExpensesByCategory(expenses);

  const categoryNames = Object.keys(grouped);
  const categoryAmounts = categoryNames.map(name => grouped[name].total);
  const categoryColors = categoryNames.map(name => grouped[name].color);

  let total = 0;
  for (let amount of categoryAmounts) {
    total = total + amount;
  }

  let canvas = document.getElementById('expensesChart');
  
  if (!canvas) {
    canvasParent.innerHTML = `
      <div class="title-container">
        <h3 class="text-xl font-[DM_Sans] font-bold text-gray-800 text-center w-full">
          Expenses by Category
        </h3>
      </div>
      <div class="w-full flex items-center justify-center">
        <canvas id="expensesChart"></canvas>
      </div>
    `;
    canvas = document.getElementById('expensesChart');
  }

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
      plugins: {
        legend: {
          display: false  // Hide default legend - we make our own!
        },
        
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              const name = context.label;
              const amount = context.parsed;
              const percent = ((amount / total) * 100).toFixed(2);
              return `${name}: ₱${amount} (${percent}%)`;
            }
          }
        },
        
        datalabels: {
          color: '#fff',
          font: {
            weight: 'bold',
            size: 16,
            family: "'DM Sans', sans-serif",
          },
          formatter: function(value) {
            const percent = ((value / total) * 100).toFixed(1);

            if (percent) {
              return percent + '%';
            } else {
              return '';
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

  // Create the custom legend at the bottom!
  createLegend(grouped, total, legendDiv);
}

// This creates the custom legend at the bottom of the chart
function createLegend(grouped, total, legendDiv) {
  // If no legend container, stop
  if (!legendDiv) return;

  let html = '';

  // Loop through each category
  for (let categoryName in grouped) {
    const data = grouped[categoryName];
    const amount = data.total;
    const color = data.color;
    const percent = ((amount / total) * 100).toFixed(1);

    // Build HTML for each category row
    html += `
      <div class="flex items-center justify-between py-3 px-4 hover:bg-white/30 rounded-xl transition-all duration-200 cursor-pointer font-['DM_Sans']">
        <div class="flex items-center gap-3 flex-1">
            <div style="width: 16px; height: 16px; border-radius: 50%; background-color: ${color}; box-shadow: 0 1px 2px rgba(0,0,0,0.1);"></div>
          <span class="text-gray-800 font-semibold text-sm">${categoryName}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-gray-900 font-bold text-sm">₱${amount.toLocaleString()}</span>
          <span class="text-gray-600 text-xs bg-white/50 px-2 py-1 rounded-full">${percent}%</span>
        </div>
      </div>
    `;

    
  console.log(color);
  }

  

  // Put the HTML into the legend div
  legendDiv.innerHTML = html;
}
