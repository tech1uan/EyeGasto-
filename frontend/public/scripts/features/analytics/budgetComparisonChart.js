import { budget, getBudgetComparison } from "../../data/budget.js";


    let budgetChart = null;


export function showNoData() {
  document.querySelector('.spending-budget-no-data')?.classList.remove('hidden');
  document.querySelector('.budget-comparison-chart-container')?.classList.add('hidden');

}
    
export async function updateBudgetComparisonChart() {
    const data = await getBudgetComparison();
    
    if(!data || data.budgetComparison.length === 0) {
      showNoData();
      return;      
    };

    const spent = [0,0,0,0];


    data.budgetComparison.forEach(item => {
        spent[item.week - 1] = Number(item.total)
    })


   const monthlyBudget = budget.originalBudget;
   const weeklyBudget = Math.round(monthlyBudget / 4);

   const budgetData = [
    weeklyBudget,
    weeklyBudget,
    weeklyBudget,
    weeklyBudget
   ]

   const labels = ['W1', 'W2', 'W3', 'W4'];

   const canvas = document.getElementById('budgetComparisonChart');
   const ctx = canvas.getContext('2d');

   if(budgetChart) {
    budgetChart.destroy();
   }
   
   budgetChart = new Chart(ctx, {
    type: 'bar',

    data: {
        labels,

       datasets: [
        {
            label: 'Spent',
            data: spent,

            backgroundColor: '#22D3B6',

            borderRadius: {
            topLeft: 999,
            topRight: 999,
            bottomLeft: 0,
            bottomRight: 0
            },

            borderSkipped: false,

            barPercentage: 0.9,
            categoryPercentage: 0.59,

            maxBarThickness: 16
        },

        {
            label: 'Budget',
            data: budgetData,

            backgroundColor: '#C97773',

            borderRadius: {
            topLeft: 999,
            topRight: 999,
            bottomLeft: 0,
            bottomRight: 0
            },

            borderSkipped: false,

            barPercentage: 0.9,
            categoryPercentage: 0.59,

           maxBarThickness: 16
        }
        ]
        },

  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,

    plugins: {
      datalabels: {
        display: false
      },

      tooltip: {
        callbacks: {
          label: function(context) {
            const value = Number(context.raw);

            return `${context.dataset.label}: ₱${value.toLocaleString('en-PH', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`;
          }
        }
      },

      legend: {
        position: 'bottom',
        align: 'start',
        labels: {
          color: '#B8D7D0',
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          pointStyle: 'rectRounded'
        }
      }
    },

  scales: {
    y: {
      display: false,
      grid: {
        display: false
      },
        border: {
        display: false
    }
    },
    x: {
      grid: {
        display: false
      },
      border: {
      display: false
    },
    ticks: {
    color: '#9EC7C0',
    font: {
      size: 11
    }
    
    }
  }
},

}}

)
}