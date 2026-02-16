
export function formatToPeso(amount) {
 
  return amount.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  });


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