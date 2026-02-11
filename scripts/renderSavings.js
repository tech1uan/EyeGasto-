
import { savingsMoney } from "./savings.js";
import { formatToPeso } from "./utils.js";

export function renderSavingsHTML () {

  const savingsContainer = document.querySelector('.js-savings-container');

  savingsContainer.innerHTML =

  `
      <div class="flex flex-col items-start justify-center p-2">
        <h1 class="font-['DM_Sans'] font-bold w-full text-xs">Current Saved Money</h1>
        <p class="savings-balance text-[#079F9F] font-['DM_Sans'] font-bold text-3xl">₱0.00</p>
        <button
          class=" add-withdraw-money bg-[#07D5C4] text-white flex items-center p-2 gap-1 text-xs rounded-2xl w-full text-outline-black-38 drop-shadow-[0_4px_2px_rgba(0,0,0,0.56)] cursor-pointer"><img
            src="../images/mini-coin.png" alt="Mini coin logo"
            class="w-[24px] filter drop-shadow-[0_0_2px_rgba(0,0,0,0.38)]">Add / Withdraw Money</button>
      </div>

      <div>
        <img class="w-[150px] -translate-y-4" src="../images/moneybag-big.png" alt="Money bag big logo">
      </div>

`
}