import { updateReceiptHTML } from "../../ui/renderReceipts.js";
import { getAllTransactions, getTransactionsForToday, getTransactionsForWeek } from "./groupTransactions.js";

export let currentView = "today";

export function getCurrentTransactions () {

  if (currentView === "today") {
    return getTransactionsForToday();
  } else if (currentView === "last7") {
    return getTransactionsForWeek();
  } else if (currentView === "alltime") {
   return getAllTransactions();
  }
  return getTransactionsForToday();
}


function updateReceiptUI() {
  updateReceiptHTML();
}



export function initTDateFilter () {
 const selectElement = document.getElementById("tDateFilter");

 selectElement.addEventListener("change", (e) => {
  currentView = e.target.value;
  console.log("View changed to: ", currentView);
  updateReceiptUI();
 })
}