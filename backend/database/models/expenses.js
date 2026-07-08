
import pool from "../config.js"

export async function addExpense(userId, description, amount, category_id) {
  try {
    const [result] = await pool.query(`
      INSERT INTO expenses (user_id, description, amount,category_id)
      VALUES (?,?,?,?)
      `,[userId,description,amount,category_id])
     
    if(result.affectedRows === 0) {
      return {
        success:false,
        message: 'Failed to insert expense!'
      }
    }
      
    return {
      userId,
      affectedRows: result.affectedRows,
      insertId: result.insertId
    }
  } catch (error) {
    throw error
  }
}

export async function deleteExpense(expenseId, userId) {
  try {
    const [result] = await pool.query(`
      UPDATE EXPENSES
       SET isDeleted = 1,
       deletedAt = NOW()
       WHERE expense_id = ? AND user_id = ?
      `, [expenseId, userId])
  
    if(result.affectedRows === 0) {
      return {
        success:false,
        message:'Expense not found or not authorized!'
      }
    }

  return {
    success:true,
    message: 'Expense deleted successfully!'
  }

  } catch (error) {
    throw error
  }
}

export async function editExpense(amount,category_id,description,expense_id,user_id) {
 try {
  const [result] = await pool.query (`
    UPDATE expenses
    SET amount = ?, category_id = ?, description = ?
    WHERE expense_id = ? AND user_id = ? 
    `, [amount,category_id,description,expense_id,user_id])
    
    if(result.affectedRows === 0) {
      return {
        success:false,
        message: 'Expense not found or unauthorized!'
      }
    }

    const [rows] = await pool.query (
      `
      SELECT expenses.description, expenses.amount, category.name AS category, category.color, category.logo
      FROM expenses
      INNER JOIN category
      ON expenses.category_id = category.id
      WHERE expense_id = ? AND user_id = ?
      `
    ,[expense_id,user_id])
     

    if(rows.length === 0) {
      return {
        success: false,
        message: 'Expense not found after update!'
      }
    }
  
    const expense = rows[0];
    return {
      success:true,
      message: 'Expense edited successfully!',
      ...expense
    }
 } catch (error) {
  throw error
 }
}

export async function getExpensesForToday(userId) {
  try {
    const [result] = await pool.query(
      `
          SELECT expenses.expense_id,expenses.description, expenses.amount, expenses.category_id, expenses.date_time, category.name AS category, category.color, category.logo
        FROM expenses
        INNER JOIN category
        ON expenses.category_id = category.id
        WHERE user_id = ? AND isDeleted = 0
        AND date_time >= current_date()
        AND date_time < current_date() + INTERVAL 1 DAY
        ORDER BY date_time DESC
      `,[userId]
    )

    return result;
  } catch (error) {
    throw(error);
  }
}

export async function getExpensesForWeek(userId) {
  try {
    const [result] = await pool.query(
      `
        SELECT expenses.expense_id,expenses.description, expenses.amount, expenses.category_id, expenses.date_time, category.name AS category, category.color, category.logo
        FROM expenses
        INNER JOIN category
        ON expenses.category_id = category.id
        WHERE user_id = ? AND isDeleted = 0
        AND date_time >= current_date() - INTERVAL 6 DAY
        AND date_time < current_date() + INTERVAL 1 DAY
        ORDER BY date_time DESC
      `,[userId]
    )
  
    return result;
  } catch (error) {
    throw(error);
  }
}

export async function getExpensesAllTime(userId) {
  try {
    const [result] = await pool.query(
      `
        SELECT expenses.expense_id,expenses.description, expenses.amount, expenses.category_id, expenses.date_time, category.name AS category, category.color, category.logo
        FROM expenses
        INNER JOIN category
        ON expenses.category_id = category.id
        WHERE user_id = ? AND isDeleted = 0
        ORDER BY date_time DESC
      `,[userId]
    )
  
    return result;
  } catch (error) {
    throw(error);
  }
}

export async function getTotalExpenses(userId, range) {
  let condition = '';
  
  const validRanges = ['today', 'last7', '1month', 'previous7', '6months', 'alltime'];

  if (!validRanges.includes(range)) {
    throw new Error('Invalid range');
  }

  if (range === 'today') {
    condition = `   
      AND date_time >= CURDATE()
      AND date_time < CURDATE() + INTERVAL 1 DAY
      `
  }
  else if(range === 'last7') {
    condition = `
      AND date_time >= CURDATE() - INTERVAL 6 DAY
      AND date_time < CURDATE() + INTERVAL 1 DAY`
  } else if (range === '1month') {
    condition = `
      AND date_time >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
      AND date_time < CURDATE() + INTERVAL 1 DAY
    `
  } else if (range === 'previous7') {
  condition = `
      AND date_time >= CURDATE() - INTERVAL 7 DAY
      AND date_time < CURDATE()
  `;
  } else if (range === '6months') {
    condition = `
      AND date_time >= CURDATE() - INTERVAL 6 MONTH
      AND date_time < CURDATE() + INTERVAL 1 DAY
      `
  } else if(range === 'alltime') {
    condition = '';
  }

  const [result] = await pool.query(
      `
      SELECT SUM(amount) 
      AS total_expenses
      FROM expenses
      WHERE user_id = ? AND isDeleted = 0
      ${condition}
      `

  ,[ userId])

  return result[0].total_expenses ?? 0;
}


export async function getRecentExpenses(userId, filter = "all") {
  try {

    let dateFilter = "";

    if(filter === "today") {
      dateFilter = `  
      AND e.date_time >= CURDATE()
      AND e.date_time < CURDATE() + INTERVAL 1 DAY
      `
    }

    if(filter === "last7") {
      dateFilter = `
      AND e.date_time >= CURDATE() - INTERVAL 6 DAY
      AND e.date_time < CURDATE() + INTERVAL 1 DAY
      `
    }
     
    const [result] = await pool.query(`
      SELECT e.expense_id, e.description,
      e.amount,e.date_time,c.name,c.color,
      c.logo
      FROM expenses e
      INNER JOIN CATEGORY c
      ON e.category_id = c.id
      WHERE e.user_id = ? AND isDeleted = 0
      ${dateFilter}
      ORDER BY e.date_time DESC
      LIMIT 2
      
      `,[userId])

    return result;
  } catch (error) {
    throw error
  }
}

export async function getThisMonthStats(user_id) {
  try {
    const [rows] = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) AS total_spent_this_month
      FROM expenses 
      WHERE user_id = ? 
        AND isDeleted = 0 
        AND MONTH(date_time) = MONTH(CURRENT_DATE())
        AND YEAR(date_time) = YEAR(CURRENT_DATE())
    `, [user_id]);
    
    return rows[0].total_spent_this_month;
  } catch (error) {
    throw error;
  }
}

export async function getMonthlyStats(userId, range) {

  let condition = '';


 const validRanges = ['last7', '1month', '6months', 'alltime'];

  if (!validRanges.includes(range)) {
    throw new Error('Invalid range');
  }

  if(range === 'last7') {
    condition = 
    `
    AND date_time >= CURDATE() - INTERVAL 6 DAY
    AND date_time < CURDATE() + INTERVAL 1 DAY
    `
  } else if (range === '1month') {

    condition = `
     AND date_time >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
     AND date_time < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01')
    `
  } else if (range === '6months') {
    condition = 
    `
    AND date_time >= CURDATE() - INTERVAL 6 MONTH
    AND date_time < CURDATE() + INTERVAL 1 DAY
    `
  } else {
    condition =  '';
  }

  try {

  const [currentRows] = await pool.query(`
    SELECT
      COALESCE(SUM(amount), 0) AS total_spent,
      COUNT(DISTINCT DATE(date_time)) AS days_logged
    FROM expenses
    WHERE user_id = ? AND isDeleted = 0
     ${condition}
  `, [userId]);

  const [lastMonthRows] = await pool.query(`
    SELECT
      COALESCE(SUM(amount), 0) AS total_spent_last_month
    FROM expenses
    WHERE user_id = ? AND isDeleted = 0
      AND date_time >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
      AND date_time < DATE_FORMAT(CURDATE(), '%Y-%m-01')
  `, [userId]);

  return {
    ...currentRows[0],
    total_spent_last_month: lastMonthRows[0].total_spent_last_month
  };
  } catch (error) {
    throw error
  }
 
}

export async function getProfileStats(userId) {
  try {
    const [result] = await pool.query(`
    SELECT
      COUNT(expense_id) AS expenses_logged,
      COUNT(DISTINCT DATE_FORMAT(date_time, '%Y-%m')) AS months_active
    FROM expenses
    WHERE user_id = ? AND isDeleted = 0

  `, [userId]);

  return result[0]
  } catch (error) {
    throw error
  }
}


export async function getComparisonStats(userId,range) {
  try {
    let currentCondition = ''
  let previousCondition = ''

  const validRanges = ['last7', '1month', '6months'];
  if(range === 'alltime') return;

  if (!validRanges.includes(range)) {
    throw new Error('Invalid range');
  }

  if(range === 'last7') {
    currentCondition = `
    AND date_time >= CURDATE() - INTERVAL 6 DAY
    AND date_time < CURDATE() + INTERVAL 1 DAY
    `;

    previousCondition = `
    
    AND date_time >= CURDATE() - INTERVAL 13 DAY
    AND date_time < CURDATE() - INTERVAL 6 DAY
    `;
  } else if (range === '1month') {
    currentCondition = `
    AND date_time >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
    AND date_time < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01')
    `;

    previousCondition = `
    AND date_time >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
    AND date_time < DATE_FORMAT(CURDATE(), '%Y-%m-01')
    `;

  } else if (range === '6months') {
        currentCondition = `
    AND date_time >= CURDATE() - INTERVAL 6 MONTH
    AND date_time < CURDATE() + INTERVAL 1 DAY
    `;

    previousCondition = `
    AND date_time >= CURDATE() - INTERVAL 12 MONTH
    AND date_time < CURDATE() - INTERVAL 6 MONTH
    `
  }

  const [currentRows] = await pool.query(`
    SELECT COALESCE(SUM(amount),0) AS total
    FROM expenses
    WHERE user_id = ?
    AND isDeleted = 0
    ${currentCondition}
    `, [userId])

  const [previousRows] = await pool.query(`
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM expenses
    WHERE user_id = ?
    AND isDeleted = 0
    ${previousCondition}
    
    `, [userId])

  return {
    current: currentRows[0].total,
    previous: previousRows[0].total
  }
  } catch (error) {
    throw error
  }
  
}

export async function getExpensesByRange(userId, range = 'alltime') {
  try {
    let condition = '';

    const validRanges = ['last7', '1month', '6months', 'alltime'];

    if (!validRanges.includes(range)) {
      throw new Error('Invalid range');
    }

     if(range === 'last7') {
      condition = `
      AND date_time >= CURDATE() - INTERVAL 6 DAY
      AND date_time < CURDATE() + INTERVAL 1 DAY
      `;
    } else if (range === '1month') {
      condition = `
      AND date_time >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
      AND date_time < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01')
      `;


    } else if (range === '6months') {
        condition = `
      AND date_time >= CURDATE() - INTERVAL 6 MONTH
      AND date_time < CURDATE() + INTERVAL 1 DAY
      `;
    } else {
      condition = ''
    }

    const [rows] = await pool.query(`
      SELECT expenses.description,expenses.amount,
      expenses.category_id,expenses.date_time,expenses.isDeleted,
      category.id,category.name AS category, category.color, category.logo
      FROM expenses
      INNER JOIN category
      ON expenses.category_id = category.id
      WHERE user_id = ? 
      AND isDeleted = 0 
      ${condition}
      ORDER BY date_time DESC
      `,[userId])

      return rows;
} catch (error) {
  throw error
}
}

export async function getExpenseHeatMap(userId) {
  try {
    const [rows] = await pool.query(`
      SELECT 
      DATE_FORMAT(date_time, '%b') AS month,
      MONTH(date_time) AS month_num,
      SUM(amount) AS total,
      YEAR(date_time) AS year
      FROM expenses
      WHERE user_id = ?
      AND YEAR(date_time) = YEAR(CURDATE())
      AND isDeleted = 0
      GROUP BY month_num, month
      ORDER BY month_num ASC
      `,[userId] );

      return rows;
  } catch (error) {
    throw error
  }
}


export async function deleteAllExpenses(connection, userId) {
  try {
    const [result] = await connection.query(
      `
      DELETE FROM expenses
      WHERE user_id = ?
      `, [userId])

    return result.affectedRows;
  } catch (error) {
    throw error
  }
}


export async function getDailyStats(userId) {
  const [today] = await pool.query(`
    SELECT COUNT(*) AS todayExpenseCount
    FROM expenses
    WHERE user_id = ?
    AND date_time >= CURDATE()
    AND date_time < CURDATE() + INTERVAL 1 DAY
  `, [userId]);

  const [rows] = await pool.query(`
    SELECT DISTINCT DATE(date_time) AS day
    FROM expenses
    WHERE user_id = ?
    ORDER BY day DESC
  `, [userId]);

  let streak = 0;
  let currentDate = new Date();

  for (let i = 0; i < rows.length; i++) {
    const rowDate = new Date(rows[i].day);

    if (i === 0) {
      streak = 1;
      currentDate = rowDate;
      continue;
    }

    const diff = (currentDate - rowDate) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      streak++;
      currentDate = rowDate;
    } else {
      break;
    }
  }

  return {
    todayExpenseCount: today[0].todayExpenseCount,
    currentStreak: streak
  };
}