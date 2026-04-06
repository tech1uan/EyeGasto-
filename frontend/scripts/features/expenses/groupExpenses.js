
export function groupExpensesByCategory (expenses) {

  return expenses.reduce((acc, item) => {
     
    if(!acc[item.category]) {
      acc[item.category] = {
        total: 0,
        color: item.color
      };
    }

    acc[item.category].total += item.amount;
    return acc;
  }, {});


}