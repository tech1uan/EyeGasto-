
import { formatToPeso } from "../core/utils.js";
import { authFetch } from "../main.js";
import { showNotif } from "../notifs/notifications.js";

export async function getUserBudget() {
  try {
    const res = await authFetch('/budget/summary/today', {
     method: 'GET',
    })
     
    const data = await res.json();
    if(!res.ok) {
      console.log(data.msg)
      return null;
    } 
      return data;

  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function apiAddBudget(amount) {
  try {
    const res = await authFetch('/budget/add', {
      method:'POST',
      headers: {
        'Content-type':'application/json'
      },

      body:JSON.stringify({amount})
    })

    const data = await res.json();
    if(!res.ok) {
     console.log(data.msg);
     return null;
    } 
    console.log('Successfully added budget for today!');
    return data;
    
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function apiEditBudget(amount) {
 try {
  const res = await authFetch('/budget/edit', {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({amount})
  });

  const data = await res.json();

  if(!res.ok) {
    console.log(data.msg);
    return null
  }
    console.log('Successfully edited budget for today!');
    return data;

 } catch (error) {
  console.error(error);
  return null;
 }

}

export let budget = {
  budget: 0,
  originalBudget:0,

  async addBudget(amount) {
    const data = await apiAddBudget(amount);
    if(!data) return;
    
    const newAmount = data.dbData?.updatedAmount ?? 0;
    this.budget = newAmount;
     
    const originalAmount = data.dbData?.originalAmount ?? 0;
    this.originalBudget = originalAmount;

    return data;
  },

  async editBudget(amount) {
    const data = await apiEditBudget(amount);
    if(!data) return;
      const newAmount = data.update?.updatedAmount ?? 0;
    this.budget = newAmount;
    this.originalBudget = newAmount;
    return data
  },

  async getBudget () {
   const data = await getUserBudget();
   if(!data) return;

   this.budget = data.budget.remaining_budget;
   this.originalBudget = data.budget.original_amount;
    
   return {
    budget: this.budget,
    originalBudget:this.originalBudget
  }
},
   _outShown: false,
  _lowShown: false,
  _exceedShow: false,

 
  checkBudgetStatus() {

    const percentLeft =   this.originalBudget === 0 ? 0
    : (this.budget / this.originalBudget) * 100;

    if(this.originalBudget === 0 ) return;
 
    if(this.budget < 0) {
      if(!this._exceedShow) {
        this._exceedShow = true;
        showNotif('budgetExceeded');
      }
      return;
    }

    if (this.budget === 0 ){
      if(!this._outShown) {
      this._outShown = true;
      showNotif('budgetOut');
     }  
     return;
}
    if (percentLeft <= 50) {
      if(!this._lowShown) {
        this._lowShown = true;
        showNotif('budgetLow');
      }
      return;
    }

  this._outShown = false;
  this._lowShown = false;
  this._exceedShow = false;
  },
 
  get isbelowZero() {
    return this.budget < 0;
  },


};

