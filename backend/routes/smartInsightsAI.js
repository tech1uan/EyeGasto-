import { GoogleGenAI } from '@google/genai';
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { checkInsight, storeInsight } from '../database/models/insights.js';
import { getFallbackInsight } from '../utils/fallbackInsight.js';

export const smartInsightsRouter = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

smartInsightsRouter.post('/', authMiddleware, async(req,res,next) => {
 try {
  const {userId} = req.user
 
  const {
    totalSpent,
    monthlyBudget,
    categoryBreakdown,
    daysLogged,
    range
  } = req.body;

    const spent = Number(totalSpent) || 0;
    const budget = Number(monthlyBudget) || 0;

    const budgetLeft = budget - spent;

    const budgetPercent =
      budget > 0
        ? ((spent / budget) * 100).toFixed(1)
        : "0.0";


  const categoryText = Object.entries(categoryBreakdown)
  .sort((a,b) => b[1] - a[1])
  .map(([cat, amt]) => 
    `${cat}:₱${Number(amt).toLocaleString()}`)
    .join(', ') 
  
    const rangeLabel = {
      last7: 'last 7 days',
      '1month': 'this month',
      '6months': 'last 6 months',
      alltime: 'all time'
    }[range] || range
  
    const prompt = `
      You are a friendly personal finance assistant 
      for a Filipino expense tracker app called Gastoo.

      User financial data for ${rangeLabel}:
      - Monthly budget: ₱${Number(monthlyBudget).toLocaleString()}
      - Total spent: ₱${Number(totalSpent).toLocaleString()}
      - Budget used: ${budgetPercent}%
      - Budget left: ₱${Number(budgetLeft).toLocaleString()}
      - Days with expenses: ${daysLogged}
      - Spending by category: ${categoryText}

      Give ONE short smart financial insight.
      Be specific with the numbers.
      Be friendly and encouraging.
      Use peso sign ₱.
      Keep it short — max 3 sentences.

      Respond ONLY with this JSON format, 
      no markdown, no extra text:
      {
        "title": "short title max 8 words",
        "body": "2-3 sentences with insight and one tip"
      }
    `;

    const cachedInsight = await checkInsight(userId,range);

    if(cachedInsight){
      return res.json({success: true, insight: cachedInsight.insight})
    } 

     let insight;

  try{

  const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
      });


    const text = response.text;
    

    const clean = text
    .replace(/```json/g, '')
    .replace(/```/g,'')
    .trim();
    
  
    insight = JSON.parse(clean)
   
    } catch (error) {
     console.error("Gemini failed:", error.message);
     insight = await getFallbackInsight(totalSpent,monthlyBudget,categoryBreakdown,daysLogged)
    }

    await storeInsight(userId, range, insight.title, insight.body)
  
    res.json({success: true, insight})
 } catch (error) {
  next(error)
 }
})
 