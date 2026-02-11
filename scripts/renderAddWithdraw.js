

export function renderAddWithdrawHTML () {

  const addWithdrawContainer = document.querySelector('.add-withdraw-option-container');
   
    addWithdrawContainer.innerHTML =
    `
    <div class="bg-white rounded-lg p-6 flex flex-col gap-4 w-[300px]">

      <input type="text" id="description" class="js-description p-2 border rounded bg-white text-black"
        placeholder="Description">
      <input type="text" id="amount" class="js-amountInput p-2 border rounded text-black bg-white" placeholder="Amount">

      <div class="flex flex-col justify-between gap-8">
        <button class="bg-green-500 text-white p-8 rounded hover:bg-green-600 cursor-pointer js-add-button">Add
          Money</button>
        <button class="bg-red-500 text-white p-8 rounded hover:bg-red-600 cursor-pointer">Withdraw Money</button>
      </div>

    </div>
    
    `



}