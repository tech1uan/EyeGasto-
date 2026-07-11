import { updateReceiptHTML } from "../../ui/renderReceipts.js";
import { getAllTransactions, getTransactionsForToday, getTransactionsForWeek } from "./groupTransactions.js";

export let currentView = "today";

export async function getCurrentTransactions () {

  if (currentView === "today") {
    return await getTransactionsForToday();
  } else if (currentView === "last7") {
    return getTransactionsForWeek();
  } else if (currentView === "alltime") {
   return await getAllTransactions();
  }
  return await getTransactionsForToday();
}


async function updateReceiptUI() {
  await updateReceiptHTML();
}


export function initTransactionsFilter () {
 const selectElement = document.getElementById("filter-transactions");
 selectElement.addEventListener("change", (e) => {
  currentView = e.target.value;
  console.log("View changed to: ", currentView);
  updateReceiptUI();
 })
}

