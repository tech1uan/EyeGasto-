
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


