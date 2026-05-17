
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


export async function getTotalExpenseForToday(userId) {
  try {
    const [result] = await pool.query(
      `
      SELECT SUM(amount) 
      AS total_expenses
      FROM expenses
      WHERE user_id = ? AND isDeleted = 0
      AND date_time >= CURDATE()
      AND date_time < CURDATE() + INTERVAL 1 DAY
      `,[userId]
    )

    return result[0].total_expenses ?? 0;


  } catch (error) {
    throw error
  }
}


export async function getTotalExpensesForWeek(userId) {
  try {
    const [result] = await pool.query(
      `
      SELECT SUM(amount) 
      AS total_expenses
      FROM expenses
      WHERE user_id = ? AND isDeleted = 0
      AND date_time >= CURDATE() - INTERVAL 6 DAY
      AND date_time < CURDATE() + INTERVAL 1 DAY
      `,[userId]
    )

    return result[0].total_expenses ?? 0;


  } catch (error) {
    throw error
  }
}

export async function getTotalExpensesAllTime(userId) {
  try {
    const [result] = await pool.query(
      `
      SELECT SUM(amount) 
      AS total_expenses
      FROM expenses
      WHERE user_id = ? AND isDeleted = 0
      `,[userId]
    )

    return result[0].total_expenses ?? 0;


  } catch (error) {
    throw error
  }
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

const recent = await getRecentExpenses(1, 'today');
console.log(recent)