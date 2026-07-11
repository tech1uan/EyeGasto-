import { getSmartInsightsByAI } from "../../data/smartInsight.js";

export async function updateSmartInsights
(totalSpent,monthlyBudget,categoryBreakdown,daysLogged,range) {


    const titleContainer = document.getElementById('smart-title');
    const bodyContainer = document.getElementById('smart-message');
    
  
    if (titleContainer && bodyContainer) {
        titleContainer.textContent = "Analyzing data...";
        bodyContainer.textContent = "Gastoo is processing your financial insights...";
    }

     const responseData = await getSmartInsightsByAI(
        totalSpent, 
        monthlyBudget, 
        categoryBreakdown, 
        daysLogged, 
        range
    );


    if(!responseData || !responseData.success || !responseData.insight) {
        if(titleContainer && bodyContainer) {
            titleContainer.textContent = "Insight Unavailable";
            bodyContainer.textContent = "Could not load budget tips right now. Check your network or try again.";
        }
     return;
    }

    const {title,body} = responseData.insight;

    if(titleContainer) titleContainer.textContent = title;
    if(bodyContainer) bodyContainer.textContent = body;
}

