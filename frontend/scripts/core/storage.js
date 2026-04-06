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

} else if (name === "budget") {
  return saved ? JSON.parse(saved):0;
  } else if (name === "user") {
    return saved ? JSON.parse(saved) : null;
  } else {
    return saved ? JSON.parse (saved): null;
  }
}