import { formatToPeso } from "../core/utils.js";
import { authFetch } from "../main.js";

export async function getUserSavings() {
 try {
  let res = await authFetch('/savings', {
    method: 'GET',
  });
  
  let data = await res.json();
 if(!res.ok) {
  console.log(data.msg);
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
    const res = await authFetch('/savings/add', {
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
       return {success: false, error};
  }
}

export async function deductSavings(amount) {
  try {
    const res = await authFetch('/savings/deduct', {
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
    return null;
  }
}


export async function userSavings() {
  const data = await getUserSavings();
  if(!data){
    return null;
  }
  return {
    money: data.balance,
    getCurrentMoney() {
      return formatToPeso(this.money)
    }
  }
}


  let isRefreshing = false
  let refreshPromise = null;



