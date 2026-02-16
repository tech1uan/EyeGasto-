export function saveToLocalStorage(name,savingsArray) {

  localStorage.setItem(name, JSON.stringify(savingsArray));

}

export function loadSavingsFromStorage(name) {
  const saved = localStorage.getItem(name);
 
  if(name === "savings") {
  return saved ? JSON.parse(saved): {
  money: 0,
  transactions: [],
  };

} else if (name === "expenses") {
  return saved ? JSON.parse(saved):[]

}
}