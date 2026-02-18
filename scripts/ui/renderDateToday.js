import { formatDate } from "../core/utils.js";


export function renderExpensesFilter () {
  
  const today =  formatDate(dayjs());
  const container = document.querySelector('.date-container');
  
  container.innerHTML = 
  `
  <div class = "w-full flex justify-between text-gray-500">
  <p>${today}</p>
   <select id = "dateFilter">
  <option value = "today" class ="text-center">Today</option>
  <option value = "last7" class ="text-center">Last 7 Days</option>
  <option value = "alltime" class ="text-center">All Time</option>
  </select>
  </div>
  `

}


export function renderTransactionsFilter () {
  
  const today =  formatDate(dayjs());
  const container = document.querySelector('.t-date-container');
  
  container.innerHTML = 
  `
  <div class = "w-full flex justify-between text-gray-500">
  <p>${today}</p>
   <select id = "tDateFilter">
  <option value = "today" class ="text-center">Today</option>
  <option value = "last7" class ="text-center">Last 7 Days</option>
  <option value = "alltime" class ="text-center">All Time</option>
  </select>
  </div>
  `

}