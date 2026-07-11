
import { formatToPeso } from "../core/utils.js";
import { authFetch } from "../main.js";
import { showNotif } from "../notifs/notifications.js";
import { showMessage } from "../withdrawals/addWithdraw.js";

  const success = document.getElementById('success-budget');
  const error = document.getElementById('error-budget');

export async function getUserBudget(range) {
  try {
    const res = await authFetch(`/budget/summary?range=${range}`, {
     method: 'GET',
    })
     
    const data = await res.json();
    if(!res.ok) {
      return null;
    } 
      return data;

  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getBudgetComparison() {
  try {
    const res = await authFetch('/budget/comparison', {
      method:'GET',
    })

    const data = await res.json();

    if(!res.ok) {
      console.log(data.msg)
      return null
    }


    return data;
  
  } catch (error) {
    return null
  }
}

export async function apiAddBudget(amount,range) {
  try {
    const res = await authFetch('/budget/add', {
      method:'POST',
      headers: {
        'Content-type':'application/json'
      },

      body:JSON.stringify({amount,range})
    })

    const data = await res.json();
    if(!res.ok) { 
       const message =
      data.errors?.map(err => err.msg).join(", ") ||
      data.message ||
      "Something went wrong";
      
      showMessage(error,message)
    }
    return data;
    
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function apiEditBudget(amount,range) {

 try {
  const res = await authFetch('/budget/edit', {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({amount,range})
  });

  const data = await res.json();

  if(!res.ok) {
    const message =
    data.errors?.map(err => err.msg).join(", ") ||
    data.message ||
    "Something went wrong";
    
    showMessage(error,message)
    return;
  }
    return data;

 } catch (error) {
  return null;
 }

}


export let budget = {
  remainingBudget: 0,
  originalBudget:0,
  totalSpent: 0,

  async addBudget(amount, range) {
    const data = await apiAddBudget(amount, range);
    if(!data) return;
    
    const newAmount = data.dbData?.updatedAmount ?? 0;
    this.budget = newAmount;
     
    const originalAmount = data.dbData?.originalAmount ?? 0;
    this.originalBudget = originalAmount;

    return data;
  },

  async editBudget(amount,range) {
    const data = await apiEditBudget(amount,range);
    if(!data) return;
      const newAmount = data.update?.updatedAmount ?? 0;
    this.budget = newAmount;
    this.originalBudget = newAmount;
    return data
  },

  async getBudget (range) {
  
   const data = await getUserBudget(range);
   if(!data) return;
  
    this.remainingBudget = Number(data.amounts.remaining_budget ?? data.amounts.remaining_budget ?? 0);
    this.originalBudget = Number(data.amounts.original_budget ?? data.amounts.original_budget ?? 0);
    this.totalSpent = Number(data.amounts.total_expenses?? data.amounts.total_expenses ?? 0)

   return {
    budget:this.remainingBudget,
    originalBudget:this.originalBudget,
    totalSpent: this.totalSpent
  }
},
};




