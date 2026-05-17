import { authFetch } from "../main.js";

export async function addTransaction(amount,description,type) {
 try {
  const res = await authFetch('/transactions/add', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body:JSON.stringify({amount,description,type})
  })

  const data = await res.json();
  if(!res.ok) {
    console.log(data.msg);
    return null;
  }
  return data;

 } catch (error) {
  console.error(error)
  return null;
 }
}

export async function getTransactions() {
  try {
    const res = await authFetch('/transactions/get', {
      method: 'GET',
    })
   
    const data = await res.json();
    if(!res.ok) {
        console.log(data.msg);
        return null;
      }
    return data
    
  } catch (error) {
    console.error(error);
    return null;
  }
}