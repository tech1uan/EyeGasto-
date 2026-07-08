import { formatToPeso } from "../../core/utils.js";
import { getExpensesHeatMap } from "../../data/expenses.js"

export async function showNoData() {
    document.querySelector('.heatmap-no-data')?.classList.remove('hidden');
    document.querySelector('.heatmap-content')?.classList.add('hidden');
}
export async function updateExpenseHeatMap() {
 const data = await getExpensesHeatMap();

 if(!data || data.expenses.length === 0) {
    showNoData()
    return null;
 }
  renderHeatMap(data);
}

function getHeatmapColor(amount, max) {
    if(!amount || amount === 0) return '#112924'

    const ratio = amount / max;

    if (ratio <= 0.2)  return '#1a3a35';  
    if (ratio <= 0.4)  return '#1a6b52';
    if (ratio <= 0.6)  return '#1d9e75';  
    if (ratio <= 0.8)  return '#22D3B6'; 

    return '#5effd8';     
}


async function renderHeatMap(data) {
    const heatMapYear = document.getElementById('heatmap-year');
    heatMapYear.textContent = `Year ${data.expenses[0].year}`
    
    const grid = document.querySelector('.heatmap-grid')
    if(!grid) return;

    const allMonths = ['Jan','Feb','Mar','Apr','May','Jun',
                       'Jul','Aug','Sep','Oct','Nov','Dec'];
    
    const monthMap = {};

     data.expenses.forEach(r => {
        monthMap[r.month] = Number(r.total)
    })

    const max = Math.max(...Object.values(monthMap), 1);

    const currentMonth = new Date().getMonth();

    grid.innerHTML = allMonths.map((month, i) => {
        const amount = monthMap[month] || 0

       
        const color = getHeatmapColor(amount, max);

        const isFuture = i > currentMonth;
        
           return `

            <div class="heatmap-cell relative group cursor-default">

                <div 

                    class="w-full aspect-square rounded-lg transition-all duration-300 ${isFuture ? 'opacity-20' : ''}"
                    style="background: ${color};"

                ></div>

                <span class="text-[10px] text-[#6ab3a6] font-['DM_Sans'] 
                    text-center block mt-1">${month}</span>


                <div class="heatmap-tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                    px-2 py-1 opacity-0 rounded-lg text-[11px] font-['DM_Sans'] text-white
                    whitespace-nowrap group-hover:opacity-100 
                    pointer-events-none transition-all duration-200 z-10"
                    style="background: rgba(15,52,48,0.95); 
                    border: 1px solid rgba(34,211,182,0.3);">
                    ${isFuture ? 'No data yet' : `${formatToPeso(amount)}`}
                </div>

            </div>

        `;
    }).join('');
}

export async function initToolTipForHeatmap() {
 
    const grid = document.querySelector('.heatmap-grid');

    grid.addEventListener('click', (e) => {
        const month = e.target.closest('.heatmap-cell');
        const tooltip = month.querySelector('.heatmap-tooltip');
    
        if(!tooltip) return;

        tooltip.classList.toggle('show-tooltip')
    })
}