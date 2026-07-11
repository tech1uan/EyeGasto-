
import { getTransactions } from "../../data/transactions.js";

async function fetchTransactions () {
 const {transactions} = await getTransactions();
 return transactions;
}

export async function getTransactionsForToday() {
  const today = dayjs().format('YYYY-MM-DD');
  const transactions = await fetchTransactions()
 const result = transactions.filter(t => dayjs(t.date_time).format('YYYY-MM-DD') === today);
 
  return result;
}

export async function getTransactionsForWeek() {
  const weekAgo = dayjs().subtract(7, 'day').startOf('day');
  const today = dayjs().endOf('day');
   
  const transactions = await fetchTransactions()

  return transactions.filter(e => {
    const transactionDate = dayjs(e.date_time);

  return transactionDate.valueOf() >= weekAgo.valueOf() &&
           transactionDate.valueOf() <= today.valueOf();
  });
}

export async function getAllTransactions () {
    const transactions = await fetchTransactions()
  return transactions;
}
