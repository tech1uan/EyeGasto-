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

export async function addBudget(userId, amount, range) {

  let condition = '';
  let selectedColumns = ''

  const rangeAllowed = ['daily', 'monthly'];

  if(!rangeAllowed.includes(range)) {
    throw new Error('Invalid budget range')
  }

  if(range === 'daily') {
   condition = 
   `
    SET daily_remaining_budget = daily_remaining_budget + ?,
    daily_original_budget = daily_original_budget + ?
   `

   selectedColumns = 
   `
   daily_remaining_budget, daily_original_budget
   `
  } 

  if(range === 'monthly') {
    condition = `
    SET monthly_remaining_budget = monthly_remaining_budget + ?,
    monthly_original_budget = monthly_original_budget + ?
    `
    
   selectedColumns = 
   `
   monthly_remaining_budget, monthly_original_budget
   `
  }



  try {
    const [result] = await pool.query(
      `
      UPDATE budget
      ${condition}
      WHERE user_id = ?
      `,
      [amount, amount, userId]
    );

    if (result.affectedRows === 0) {
      return {
        success: false
      };
    }



    const [rows] = await pool.query(
      `
      SELECT ${selectedColumns}
      FROM budget
      WHERE user_id = ?
      `,
      [userId]
    );

    return {
      userId,
      amountAdded: amount,
      amounts: rows[0],
      success: true
    };

  } catch (error) {
    throw error;
  }
}


export async function editBudget(userId, amount, range) {
  const rangeAllowed = ['daily', 'monthly'];

  if (!rangeAllowed.includes(range)) {
    throw new Error('Invalid budget range');
  }

  let condition = '';
  let selectedColumns = '';

  if (range === 'daily') {
    condition = `
      SET daily_remaining_budget = ?,
          daily_original_budget = ?
    `;

    selectedColumns = `
      daily_remaining_budget,
      daily_original_budget
    `;
  } else if (range === 'monthly') {
    condition = `
      SET monthly_remaining_budget = ?,
          monthly_original_budget = ?
    `;

    selectedColumns = `
      monthly_remaining_budget,
      monthly_original_budget
    `;
  }

  try {
    const [result] = await pool.query(
      `
      UPDATE budget
      ${condition}
      WHERE user_id = ?
      `,
      [amount, amount, userId]
    );

    const [rows] = await pool.query(
      `
      SELECT ${selectedColumns}
      FROM budget
      WHERE user_id = ?
      `,
      [userId]
    );

    return {
      userId,
      updatedAmount: rows[0],
      success: result.affectedRows > 0
    };
  } catch (error) {
    throw error;
  }
}

export async function getUserBudgetSummary(userId, range) {
  if (!['daily', 'monthly'].includes(range)) {
    throw new Error('Invalid budget range');
  }

  const budgetColumns =
    range === 'daily'
      ? `
        b.daily_original_budget AS original_budget,
        (b.daily_original_budget - COALESCE(e.total_expenses, 0)) AS remaining_budget
      `

      : `
        b.monthly_original_budget AS original_budget,
        (b.monthly_remaining_budget - COALESCE(e.total_expenses, 0)) AS remaining_budget
      `;

  const expenseCondition =
    range === 'daily'
      ? `
        AND date_time >= CURDATE()
        AND date_time < CURDATE() + INTERVAL 1 DAY
      `
      : `
        AND MONTH(date_time) = MONTH(CURDATE())
        AND YEAR(date_time) = YEAR(CURDATE())
      `;

  try {
    const [result] = await pool.query(
      `
      SELECT
        b.user_id,
        ${budgetColumns},
        COALESCE(e.total_expenses, 0) AS total_expenses

      FROM budget b

      LEFT JOIN (
        SELECT
          user_id,
          SUM(amount) AS total_expenses
        FROM expenses
        WHERE isDeleted = 0
        ${expenseCondition}
        GROUP BY user_id
      ) e
      ON b.user_id = e.user_id

      WHERE b.user_id = ?
      `,
      [userId]
    );

    return result[0];
  } catch (error) {
    throw error;
  }
}

export async function getBudgetComparison(userId) {
  try {
    const [result] = await pool.query(
      `
      SELECT
        FLOOR((DAY(date_time)-1)/7)+1 AS week,
        SUM(amount) AS total
      FROM expenses
      WHERE user_id = ?
        AND MONTH(date_time) = MONTH(CURDATE())
        AND YEAR(date_time) = YEAR(CURDATE())
      GROUP BY week
      ORDER BY week;
      `,
      [userId]
    );

    return result;
  } catch (error) {
    throw error;
  }
}

export async function resetBudgetWithRange(connection, userId, range) {
  const rangeAllowed = ['daily', 'monthly'];

  if (!rangeAllowed.includes(range)) {
    throw new Error('Invalid budget range');
  }

  let condition = '';

  if (range === 'daily') {
    condition = `
      SET daily_original_budget = 0,
          daily_remaining_budget = 0
    `;
  } else if (range === 'monthly') {
    condition = `
      SET monthly_original_budget = 0,
          monthly_remaining_budget = 0
    `;
  }

  try {
    const [result] = await connection.query(
      `
      UPDATE budget
      ${condition}
      WHERE user_id = ?
      `,
      [userId]
    );

    return result;
  } catch (error) {
    throw error;
  }
}


export async function resetBudget(connection, userId) {
  const [result] = await connection.query(
    `
    UPDATE budget
    SET
      daily_original_budget = 0,
      daily_remaining_budget = 0,
      monthly_original_budget = 0,
      monthly_remaining_budget = 0
    WHERE user_id = ?
    `,
    [userId]
  );

  return result;
}