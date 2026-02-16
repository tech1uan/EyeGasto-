
import { savingsMoney } from "../data/savings.js";


export function renderSavingsHTML () {

  const savingsContainer = document.querySelector('.js-savings-container');

  savingsContainer.innerHTML =

  `   
      <i class="fa-solid fa-receipt js-receipt-btn text-gray-500 text-xl absolute top-2 right-2 cursor-pointer"></i>
      <div class="flex flex-col items-start justify-center p-2 w-[60%]">
        <h1 class="font-['DM_Sans'] font-bold w-full text-xs sm:text-base">Current Saved Money</h1>
        <p class="savings-balance text-[#079F9F] font-['DM_Sans'] font-bold text-3xl w-[90%] truncate ">${savingsMoney.getCurrentMoney()}</p>
        <button
          class=" add-withdraw-money bg-[#07D5C4] text-white flex items-center p-2 gap-1 text-xs rounded-2xl text-outline-black-38 drop-shadow-[0_4px_2px_rgba(0,0,0,0.56)] cursor-pointer sm:text-base"><img
            src="../images/mini-coin.png" alt="Mini coin logo"
            class="w-[24px] filter drop-shadow-[0_0_2px_rgba(0,0,0,0.38)]">Add / Withdraw Money</button>
      </div>

      <div class = "flex items-center">
        <img class=" w-full min-w-[80px] max-w-[150px]" src="../images/moneybag-big.png" alt="Money bag big logo">
      </div>

`

}