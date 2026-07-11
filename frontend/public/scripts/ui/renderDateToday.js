import { formatDate } from "../core/utils.js";


export async function initDateFilter() {
   const today = dayjs().format('MMMM D, YYYY')
  const date = document.querySelectorAll('.date-today');
 date.forEach(d => d.innerText = today)
}