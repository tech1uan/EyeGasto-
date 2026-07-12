import { API_BASE } from "../config.js";
import { authFetch } from "../main.js";

let _profileStatsCache = null;

export async function initProfileStats() {
if(_profileStatsCache) return _profileStatsCache;

const profileStats = await getProfileStats();
if(!profileStats) return null;

_profileStatsCache = profileStats

return profileStats; 

}


export function invalidateProfileStats(){
  _profileStatsCache = null;
}

export async function getUserExpenses() {
  try {
    const res = await authFetch(`${API_BASE}/expenses/`, {
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

export async function fetchGetUserExpenses(range) {
    try {
      const res= await authFetch(`${API_BASE}/expenses/${range}`, {
        method: 'GET',
      })

      const data = await res.json();

      if(!res.ok) {

        return null;
      }
      return data;
    } catch (error) {
      console.error(error);
    }
}

export async function getUserRecentExpenses(filter) {
  try {
    const res = await authFetch(`${API_BASE}/expenses/recent?filter=${filter}`, {
      method: 'GET',
    })

    const data = await res.json();

    if(!res.ok) {
      return null
    }
    
    return data.expenses
  } catch (error) {
    console.error(error);
  }
}

export async function addExpense(description, amount, categoryId) {;
  
try {
  const res = await authFetch(`${API_BASE}/expenses/`, {
    method:'POST',
    headers: {
      'Content-type':'application/json'
    },
    body: JSON.stringify({description,amount,categoryId})
  })
  const data = await res.json();

  if(!res.ok) {
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
  const res = await authFetch(`${API_BASE}/expenses/`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({expenseId})
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


 export async function editExpense(expenseId, amount, categoryId, description) {
  try {
    const res = await authFetch(`${API_BASE}/expenses/`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({expenseId,amount,categoryId,description})
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

 export async function getMonthlyStats(range) {
   try {
    const res = await authFetch(`${API_BASE}/expenses/month/stats/${range}`, {
      method:'GET',
    })

    const data = await res.json();

    if(!res.ok) {
      return null
    }

    return data;

   } catch (error) {
    console.error(error)
    return null
   }
 }

  export async function getProfileStats() {
   try {
    const res = await authFetch(`${API_BASE}/expenses/profile/stats/`, {
      method:'GET',
    })

    const data = await res.json();

    if(!res.ok) {

      return null
    }

    return data;

   } catch (error) {
    console.error(error)
    return null
   }
 }

  export async function getMonthStats() {
   try {
    const res = await authFetch(`${API_BASE}/expenses/month/stats`, {
      method:'GET',
    })

    const data = await res.json();

    if(!res.ok) {

      return null
    }

    return data;

   } catch (error) {
    console.error(error)
    return null
   }
 }


 export async function getComparisonStats(range) {
   try {
    const res = await authFetch(`${API_BASE}/expenses/month/${range}`, {
      method:'GET',
    })

    const data = await res.json();

    if(!res.ok) {
      return null
    }

    return data;

   } catch (error) {
    console.error(error)
    return null
   }
 }

 export async function getExpensesByRange(range) {
  try {
    const res = await authFetch(`${API_BASE}/expenses/filter/${range}`, {
      method: 'GET',
    }) 

    const data = await res.json();

    if(!res.ok) {
      return null;
    }
    
    return data;

  } catch (error) {
    console.error(error);
    return null
  }
 }

  export async function getExpensesHeatMap() {
  try {
    const res = await authFetch(`${API_BASE}/expenses/heatmap`, {
      method: 'GET',
    }) 

    const data = await res.json();

    if(!res.ok) {
      return null;
    }
    
    return data;

  } catch (error) {
    console.error(error);
    return null
  }
 }


  export async function getTotalExpensesByRange(range) {
  try {
    const res = await authFetch(`${API_BASE}/expenses/summary/${range}`, {
      method: 'GET',
    }) 

    const data = await res.json();

    if(!res.ok) {
      return null;
    }
    
    return data;

  } catch (error) {
    console.error(error);
    return null
  }
 }
 
 
  export async function getExpensesDailyStats() {
  try {
    const res = await authFetch(`${API_BASE}/expenses/daily-stats`, {
      method: 'GET',
    }) 

    const data = await res.json();

    if(!res.ok) {
      return null;
    }
    
    return data;

  } catch (error) {
    console.error(error);
    return null
  }
 }
 