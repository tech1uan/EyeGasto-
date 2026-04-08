import pool from "../config.js";

export async function getUserSavings (userId) {
const[result] = await pool.query(`
   SELECT * FROM SAVINGS
   WHERE user_id = ?
  `,[userId]);

  return result[0];
}


