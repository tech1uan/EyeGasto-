import { API_BASE } from "../config.js";
import { authFetch } from "../main.js";


export async function getSmartInsightsByAI(totalSpent,monthlyBudget,categoryBreakdown,daysLogged,range) {
    try {
        const res =  await authFetch(`${API_BASE}/smart/`, {
            method: 'POST',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({
                totalSpent,
                monthlyBudget,
                categoryBreakdown,
                daysLogged,
                range
            })
        });

        const data = await res.json();

        if(!res.ok) {
            console.log(data);
            return null
        }

        return data;

    } catch (error) {
        console.error(error);
        return null
    }
}