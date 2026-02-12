export function saveToLocalStorage(savingsArray) {

  localStorage.setItem('savings', JSON.stringify(savingsArray));

}

export function loadSavingsFromStorage() {
  const saved = localStorage.getItem('savings');

  return saved ? JSON.parse(saved): {
  money: 0,
  transactions: [],
  };
}