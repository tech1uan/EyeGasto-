import pool from "../config.js";



export async function addTransaction(user_id, savings_id, amount,description,type) {
  try {
     const [result] = await pool.query(`
    INSERT INTO transactions (user_id,savings_id,amount,description,type)
    VALUES(?,?,?,?,?)
    `,[user_id,savings_id,amount,description,type])

   return {
    user_id,
    savings_id,
    affectedRows: result.affectedRows
   }

  } catch (error) {
    throw(error)
  }
}

export async function getUserTransactions(user_id) {
 try {
  const [result] = await pool.query(
    `
    SELECT * FROM transactions
    WHERE user_id = ?
    `
  ,[user_id]);

  return result;
 } catch (error) {
  throw error
 }
}