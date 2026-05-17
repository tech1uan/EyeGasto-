import pool from "../config.js";
import cron from "node-cron"

cron.schedule("0 3 * * *", async () => {
  try {
     const [result] = await pool.query(`
      
      DELETE FROM expenses 
      WHERE isDeleted = 1
      AND deletedAt < NOW() - INTERVAL 1 MONTH
      `)

      console.log("Old expenses deleted", result.affectedRows);
  } catch (error) {
    throw error
  }
})

export async function createUserBudget(userID) {
  try {
   const [result] = await pool.query(
  `
  INSERT into budget(user_id)
  VALUES(?)
  `
 ,[userID])

 return {
  userID,
  affectedRows:result.affectedRows
 }

  } catch (error) {
    throw error
}
}

export async function addBudget(userId, amount) {
  try {
     const [result] = await pool.query(
      `
      UPDATE budget
      SET amount = amount + ?, original_amount = original_amount + ?
      WHERE user_id = ?
      `
    ,[amount, amount, userId]);
  
   if(result.affectedRows === 0) {
    return {
      success: false
    }
   }

   const [rows] = await pool.query(
    `
    SELECT amount,original_amount from budget
    WHERE user_id = ?
    `
   ,[userId]);

   return {
    userId,
    amountAdded: amount,
    updatedAmount: rows[0].amount,
    originalAmount: rows[0].original_amount,
    success: true
   }
  
  } catch (error) {
    throw error;
  }
}


export async function editBudget(userId,amount) {
  try {
    const [result] = await pool.query(
    `
    UPDATE budget 
    SET amount = ?, original_amount = ?
    WHERE user_id = ?
    `
  ,[amount,amount,userId]);

     const [rows] = await pool.query(
    `
    SELECT amount,original_amount from budget
    WHERE user_id = ?
    `
   ,[userId]);

  return {
    userId,
    updatedAmount: rows[0].amount,
    originalAmount: rows[0].original_amount,
    success: result.affectedRows > 0
  }
  } catch (error) {
    throw error
  }
 
}

export async function getUserBudgetSummaryToday(userId) {
  try {
    const [result] = await pool.query(`
          SELECT
          b.user_id,
          b.original_amount,
          COALESCE(e.total_expenses,0)AS total_expenses,

      
          CASE
          WHEN b.original_amount = 0 THEN 0
          ELSE (b.original_amount - COALESCE(e.total_expenses,0))
          END AS remaining_budget 

          FROM budget b 
          LEFT JOIN(
          SELECT user_id, SUM(amount) AS total_expenses
          FROM expenses
        WHERE isDeleted = 0
        AND date_time >= CURDATE()
        AND date_time < CURDATE() + INTERVAL 1 DAY
        GROUP BY user_id
        ) e
        ON b.user_id = e.user_id
        WHERE b.user_id = ?
      `, [userId])

      return result[0];
  } catch (error) {
    throw error
  }
}

