import { savingsMoney } from "../../data/savings.js";


export function getTransactionsForToday() {
  const today = dayjs().format('YYYY-MM-DD');
  return savingsMoney.transactions.filter(t => t.date === today);
}

export function getTransactionsForWeek() {
  const weekAgo = dayjs().subtract(7, 'day');
  const today = dayjs();

  return savingsMoney.transactions.filter(e => {
    const transactionDate = dayjs(e.date);

    return transactionDate.valueOf() >= weekAgo.valueOf() &&
           transactionDate.valueOf() <= today.valueOf();
  });
}

export function getAllTransactions () {
  return savingsMoney.transactions;
}
