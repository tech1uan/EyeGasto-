import { API_BASE } from "../config.js";
import { formatToPeso } from "../core/utils.js";
import { authFetch } from "../main.js";


let _savingsCache = null;

export async function getUserSavings() {
 try {
  let res = await authFetch(`${API_BASE}/savings`, {
    method: 'GET',
  });
  
  let data = await res.json();
 if(!res.ok) {
  return null;
 }
  return data;

 } catch (error) {
  console.log(error);
  return null;
 }
}

export async function addSavings(amount) {
  try {
    const res = await authFetch(`${API_BASE}/savings/add`, {
      method: 'POST',
      headers: {
        'Content-type':'application/json'
      }, 
      body: JSON.stringify({amount})
    })
    const data = await res.json();

    if(!res.ok) {
      return {success: false, error: data};
    } 
      return {success: true, data};
    
  } catch (error) {
       return null
  }
}

export async function deductSavings(amount) {
  try {
    const res = await authFetch(`${API_BASE}/savings/deduct`, {
      method: 'POST',
      headers: {
        'Content-type':'application/json'
      }, 
      body: JSON.stringify({amount})
    })
  
    const data = await res.json();

    if(!res.ok) {
       return {success: false, error: data};
    } else {
      return {success: true, data};
    }
    
  } catch (error) {
    console.error(error)
    return null;
  }
}

export function invalidateSavingsCache() {
  _savingsCache = null;
} 

export async function userSavings() {
  if(_savingsCache) return _savingsCache;

  const data = await getUserSavings();
  if(!data){
    return null;
  }

  _savingsCache = {
    money: data.balance,
    goalDescription: data.goal_name,
    targetAmount: data.target_amount,
    getCurrentMoney() {
      return formatToPeso(this.money);
    },
    goalCompleted: data.goal_completed_notified
  }

  return _savingsCache;
}



export async function updateSavingsGoal(description,amount) {
  try {
    const res = await authFetch(`${API_BASE}/savings/goal`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        description,
        amount
      })
    });

    const data = await res.json();
    if(!res.ok) {
      return {success:false, error: data}
    } else {
      return {success:true, data}
    }
  } catch (error) {
    console.error(error)
    return null;
  }
}


export async function markGoalCompletedNotified() {
  try {
    const res = await authFetch(`${API_BASE}/savings/set-goal-notified`, {
      method: 'PATCH',
    });

    const data = await res.json();

    if(!res.ok) {
      console.log('error')
      return {success:false, error: data}
    } else {
      console.log('success')
      return {success:true, data}
    }
  } catch (error) {
    console.error(error)
    return null;
  }
}



