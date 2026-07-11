
export function groupExpensesByCategory (expenses) {
  console.log
  return expenses.reduce((acc, item) => {
    if(!acc[item.category]) {
      acc[item.category] = {
        total: 0,
        color: item.color,
        logo: item.logo
      };
    }

    acc[item.category].total += Number(item.amount);
    return acc;
  }, {});
}