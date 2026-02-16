import { formatDate } from "../core/utils.js";


export function renderDateTodayHTML () {
  
  const today =  formatDate(dayjs());
  const container = document.querySelector('.date-container');
  
  container.innerHTML = 
  `
  <div class = "w-full flex justify-between text-gray-500">
  <p>${today}</p>
   <select id = "dateFilter">
  <option value = "today">Today</option>
  <option value = "last7">Last 7 Days</option>
  <option value = "alltime">All Time</option>
  </select>
  </div>
  `

}