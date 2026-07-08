
import pool from "../config.js";

export async function getUserSavings (userId) {
  try {
    const[result] = await pool.query(`
    SELECT * FROM SAVINGS
    WHERE user_id = ?
    `,[userId]);

    return result[0];

  } catch (error) {
    throw error
  }
}


export async function createUserSavingsAcc(userId) {
  try {
    const [result] = await pool.query(`
    INSERT INTO savings(user_id)
    VALUES(?)
    `,[userId])

    return {
      userId,
      affectedRows:result.affectedRows
    }
  } catch (error) {
    throw error
  }

}

export async function addSaving(userId, balance) {
  try {
    const[result] = await pool.query(
    `
    UPDATE savings
    SET balance = balance + ?
    WHERE user_id = ?
    `
  , [balance,userId])

  return {
    userId,
    affectedRows: result.affectedRows
  }
  } catch (error) {
    throw error
  }

}

export async function deductSaving(userId, balance) {
   try {
    const[result] = await pool.query(
    `
    UPDATE savings
    SET balance = balance - ?
    WHERE user_id = ?
    `
  , [balance,userId])

  return {
    userId,
    affectedRows: result.affectedRows
  }
   } catch (error) {
    throw error
   }

}


export async function resetSavings(connection, userId) {
  try {
    const [result] = await connection.query(
      `
      UPDATE savings
      SET goal_name = '',
      target_amount = 0,
      balance = 0
      WHERE user_id = ?
      `, [userId])

    return result.affectedRows;
  } catch (error) {
    throw error
  }
}



export async function setGoalCompletedNotified( userId) {
  try {
    const [result] = await pool.query(
      `
     UPDATE savings
     SET goal_completed_notified = 1
     WHERE user_id = ?;
      `, [userId])

    return result.affectedRows;
  } catch (error) {
    throw error
  }
}