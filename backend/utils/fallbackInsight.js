export async function getFallbackInsight(
    totalSpent,
    monthlyBudget,
    categoryBreakdown,
    daysLogged
) {
    const percent = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;


    const topCategory = Object.entries(categoryBreakdown).sort((a,b) => b[1] - a[1])[0];

    const topCategoryName = topCategory?.[0] || "Unknown";
    const topCategoryAmount = topCategory?.[1] || 0;

     if (percent >= 100) {
        return {
            title: "Budget Exceeded",
            body: `You've already spent ₱${totalSpent.toLocaleString()}, exceeding your ₱${monthlyBudget.toLocaleString()} budget. Consider reducing your spending on ${topCategoryName}.`
        };
    }

    if (percent >= 90) {
        return {
            title: "Almost Out of Budget",
            body: `You've used ${percent.toFixed(0)}% of your monthly budget. Your largest expense is ${topCategoryName} (₱${topCategoryAmount.toLocaleString()}).`
        };
    }

    if (percent <= 50) {
        return {
            title: "Budget On Track",
            body: `Great job! You've only used ${percent.toFixed(0)}% of your budget, leaving ₱${(monthlyBudget-totalSpent).toLocaleString()} available.`
        };
    }

    if (topCategoryName === "Food") {
        return {
            title: "Food Leads Spending",
            body: `Food is your highest expense at ₱${topCategoryAmount.toLocaleString()}. Planning meals could help you save more.`
        };
    }

    // Transportation
    if (topCategoryName === "Transportation") {
        return {
            title: "Transportation Costs",
            body: `Transportation accounts for most of your spending. Carpooling or public transport may help lower your expenses.`
        };
    }

    if (topCategoryName === "Shopping") {
        return {
            title: "Shopping Alert",
            body: `Shopping is your biggest expense so far. Waiting before making non-essential purchases can help your budget.`
        };
    }

    if (topCategoryName === "Entertainment") {
        return {
            title: "Entertainment Spending",
            body: `Entertainment is your top spending category. Setting a weekly entertainment budget may help you stay on track.`
        };
    }

    if (daysLogged <= 3) {
        return {
            title: "Keep Logging",
            body: `You've only recorded expenses on ${daysLogged} day(s). Logging every expense gives you more accurate financial insights.`
        };
    }

    if (daysLogged >= 25) {
        return {
            title: "Consistent Tracking",
            body: `Excellent! You've tracked expenses for ${daysLogged} days. Consistent tracking makes it easier to spot spending habits.`
        };
    }

    return {
        title: "Keep Monitoring",
        body: `You've spent ₱${totalSpent.toLocaleString()} so far. Continue tracking your expenses to stay within your budget.`
    };
 }

