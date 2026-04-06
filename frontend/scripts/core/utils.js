export function formatToPeso(amount) {
  const num = Number(amount) || 0;

  return `₱${num.toFixed(2)}`;
}

export function formatDate(date) {
   
  const today = dayjs(date).format('MMMM D, YYYY');
  return today;
 
}

export function removeJustifyCenter (container) {
   container.classList.remove("justify-center");
}

export function addJustifyCenter (container) {
   container.classList.add("justify-center");
}