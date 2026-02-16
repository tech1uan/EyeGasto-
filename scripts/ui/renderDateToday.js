import { formatDate } from "./utils.js";


export function renderDateTodayHTML () {
  
  const today =  formatDate(new Date());
  const container = document.querySelector('.date-container');
  
  container.innerHTML = 
  `
  <div class = "w-full flex justify-between text-gray-500">
  <p>${today}</p>
  <p>Today</p>
  </div>
  `
}