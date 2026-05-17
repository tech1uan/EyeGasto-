import { authFetch } from "../main.js";


export async function getUserExpenses() {
  try {
    const res = await authFetch('/expenses/', {
     method: 'GET',
    })
    const data = await res.json();
    if(!res.ok) {
    console.log(data.msg);
    return null;
}
    return data;
  
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchGetUserExpenses(range) {
    try {
      const res= await authFetch(`/expenses/${range}`, {
        method: 'GET',
      })

      const data = await res.json();

      if(!res.ok) {
        console.log(data.msg);
        return null;
      }
      return data;
    } catch (error) {
      console.error(error);
    }
}

export async function getUserRecentExpenses(filter) {
  try {
    const res = await authFetch(`/expenses/recent?filter=${filter}`, {
      method: 'GET',
    })

    const data = await res.json();

    if(!res.ok) {
      console.log(data.msg);
      return null
    }
    
    return data.expenses
  } catch (error) {
    console.error(error);
  }
}

export async function addExpense(description, amount, categoryId) {;
  
try {
  const res = await authFetch('/expenses/', {
    method:'POST',
    headers: {
      'Content-type':'application/json'
    },
    body: JSON.stringify({description,amount,categoryId})
  })
  const data = await res.json();

  if(!res.ok) {
    console.log(data.msg);
    return null
  }

  return data;
} catch (error) {
  console.error(error)
  return null;
}
}

export async function deleteExpense(expenseId) {
try {
  const res = await authFetch('/expenses/', {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({expenseId})
  })
 
  const data = await res.json();

  if(!res.ok) {
    console.log(data.msg);
    return null;
  }
  
  return data;

} catch (error) {
  console.error(error);
  return null;
}
 }



 export async function editExpense(expenseId, amount, categoryId, description) {
  try {
    const res = await authFetch('/expenses/', {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({expenseId,amount,categoryId,description})
    })

    const data = await res.json();

    if(!res.ok) {
      console.log(data.msg);
      return null;
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
 }
