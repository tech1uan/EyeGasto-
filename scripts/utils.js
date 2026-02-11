export function formatToPeso(amount) {
 
  return amount.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  });


}