import { getCurrentExpenses } from "../features/expenses/viewExpense.js";
import { groupExpensesByCategory } from "../features/expenses/groupExpensesByCategory.js";

Chart.register(ChartDataLabels);

let expensesChart = null;

export async function updateExpensesChart() {
  const expenses = await getCurrentExpenses();

  if (!expenses?.length) {
    showNoData();
    return;
  }

  hideNoData();

  const grouped = groupExpensesByCategory(expenses);

  const labels = Object.keys(grouped);
  const amounts = labels.map(label => parseFloat(grouped[label].total));
  const colors = labels.map(label => grouped[label].color);

  renderChart(labels, amounts, colors);
  renderExpensesLegend(grouped);
}

function showNoData() {
  document.querySelector('.no-data-overlay')?.classList.remove('hidden');
  document.querySelector('.chart-card-container')?.classList.add('hidden');

  const legend = document.getElementById('expensesLegend');

  if (legend) {
    legend.innerHTML = ''; 
    legend.classList.add('hidden');
  }

  if (expensesChart) {
    expensesChart.destroy();
    expensesChart = null;
  }
}

function hideNoData() {
  document.querySelector('.no-data-overlay')?.classList.add('hidden');
  document.querySelector('.chart-card-container')?.classList.remove('hidden');

  const legend = document.getElementById('expensesLegend');

  if (legend) {
    legend.classList.remove('lg-visible');
  }
}


const centerTextPlugin = {
  id: 'centerText',
   beforeDraw(chart) {
    const { ctx, chartArea } = chart;
    const dataset = chart.data.datasets[0]?.data ?? [];
    const total = dataset.reduce((sum, v) => sum + Number(v), 0) || 1;

    let topIndex = 0;
    dataset.forEach((v, i) => {
      if (Number(v) > Number(dataset[topIndex])) topIndex = i;
    });

    const topValue = Number(dataset[topIndex] ?? 0);
    const topLabel = chart.data.labels?.[topIndex] ?? '';
    const percent = ((topValue / total) * 100).toFixed(1);

    const cx = (chartArea.left + chartArea.right) / 2;
    const cy = (chartArea.top + chartArea.bottom) / 2;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = "600 20px 'DM Sans', sans-serif";
    ctx.fillStyle = '#1f2937';
    ctx.fillText(`${percent}%`, cx, cy - 10);

    ctx.font = "500 11px 'DM Sans', sans-serif";
    ctx.fillStyle = '#6b7280';
    ctx.fillText(topLabel.toLowerCase(), cx, cy + 12);

    ctx.restore();
  }
};

function renderChart(labels, data, colors) {
  const canvas = document.getElementById('expensesChart');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  if (expensesChart) {
    expensesChart.destroy();
  }

  expensesChart = new Chart(ctx, {
    type: 'doughnut',

    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderWidth: 0,
          borderRadius: 8,
          spacing: 2
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      cutout: '72%',

      animation: {
        duration: 800
      },

      plugins: {
        legend: {
          display: false
        },

        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 8,
            cornerRadius: 8,

            titleFont: {
              size: 9,
              family: "'DM Sans', sans-serif",
              weight: 'bold'
            },

              bodyFont: {
              size: 8,
              family: "'DM Sans', sans-serif"
            },


          callbacks: {
            label(context) {
              const value = Number(context.parsed);

              const total = context.dataset.data.reduce(
                (sum, current) => sum + Number(current),
                0
              );

              const safeTotal = total || 1;
              const percent = ((value / safeTotal) * 100).toFixed(1);

              return `${context.label}: ₱${value.toLocaleString()} (${percent}%)`;
            }
          }
        },

      datalabels: {
        color: '#ffffff',

        textStrokeColor: '#111827',
        textStrokeWidth: 1,

        font: {
          weight: 'bold',
          size: 14,
          family: "'DM Sans', sans-serif"
        },


          formatter(value, context) {
            const total = context.dataset.data.reduce(
              (sum, current) => sum + Number(current),
              0
            );

            const safeTotal = total || 1;
            const percent = ((value / safeTotal) * 100).toFixed(1);

            return percent > 5 ? `${percent}%` : '';
          },

          anchor: 'center',
          align: 'center'
        }
      }
    },

    plugins: [ChartDataLabels, centerTextPlugin]
  });
}


function renderExpensesLegend(grouped) {
  const legend = document.getElementById('expensesLegend');
  if (!legend) return;

  const total = Object.values(grouped)
    .reduce((sum, item) => sum + parseFloat(item.total), 0);
  const safeTotal = total || 1;

  legend.innerHTML = Object.entries(grouped)
    .sort(([, a], [, b]) => parseFloat(b.total) - parseFloat(a.total))
    .map(([category, item]) => {
      const amount = parseFloat(item.total);
      const percent = ((amount / safeTotal) * 100).toFixed(1);

      return `
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 font-['DM_Sans'] min-w-0">
            <span class="w-2 h-2 rounded-full flex-shrink-0" style="background:${item.color}"></span>
            <span class="text-[11px] sm:text-[13px] font-medium text-gray-600 truncate">
              ${category}
            </span>
          </div>

          <div class="flex items-center gap-2 flex-shrink-0">
            <span class="text-[11px] sm:text-[13px] font-semibold text-gray-800">
              ₱${amount.toLocaleString('en-PH', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </span>
            <span class="text-[10px] sm:text-[12px]  font-medium text-gray-400 w-9 text-right">
              ${percent}%
            </span>
          </div>
        </div>
      `;
    }).join('');
}
