
  const addWithdrawBtn = document.querySelector('.add-withdraw-money');
  const addWithdrawContainer = document.querySelector('.add-withdraw-option-container');

  showAddWithdrawOption();
  hideAddWithdrawOption();

function showAddWithdrawOption () {

  addWithdrawBtn.addEventListener('click', () => {
   addWithdrawContainer.classList.remove("hidden");
  })
  
}

function hideAddWithdrawOption () {

}