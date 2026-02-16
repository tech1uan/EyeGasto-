
export function initAddWithdrawOption () {
  const button = document.querySelector('.add-withdraw-money');
  const closeButton = document.querySelector('.js-close-add-withdraw');
  const container = document.querySelector('.add-withdraw-option-container');

  button.addEventListener('click', () => {
   container.classList.remove("hidden");
  })
  
   closeButton.addEventListener('click', () => {
    container.classList.add("hidden");
  });

}


export function hideAddWithdrawOption (button) {
  const container = document.querySelector('.add-withdraw-option-container');

   button.addEventListener('click', () => {
   container.classList.add("hidden");
  });

}