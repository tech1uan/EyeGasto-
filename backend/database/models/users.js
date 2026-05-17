import pool from "../config.js";

export async function createUser(name,email,password,verification_code, expires_at) {
  
  try {
      const [result] = await pool.query(`
       INSERT INTO users(username,email,password, verification_code, code_expires_at)
       VALUES (?,?,?,?,?)
     `,[name,email,password,verification_code, expires_at]);

     return {
      id:result.insertId,
      username:name,
      affectedRows: result.affectedRows
     }
  } catch (error) {
    throw error
  }
}

export async function getUserByUsername(username) {
  try {
    const [result] = await pool.query(
      `
      SELECT * FROM USERS
      WHERE username = ?
      `
    ,[username])
    
    return result[0];
  } catch (error) {
    throw error
  }
}

export async function getUserByUserID(userId) {
  try {
    const [result] = await pool.query (
    `
    SELECT * FROM users
    WHERE id = ?
    `
    ,[userId]);

    return result[0];
  } catch (error) {
    throw error
  }
}

export async function getUserByEmail(email) {
  try {
    const [row] = await pool.query(
      `
      SELECT * FROM users
      WHERE email = ?
      `,[email]
    )
    
    return row[0];
  } catch (error) {
    throw(error)
  }
}

export async function verifyUser(email) {
  try {
    const [row]  = await pool.query(
      `
      UPDATE users
      SET
      is_verified = true,
      verification_code = NULL
      WHERE email = ?
      `, [email]
    )

    return row.affectedRows;
  } catch (error) {
    throw(error)
  }
}


export async function updateVerificationCode(email,code,expiresAt) {
  try {
     const [result] = await pool.query (
    `
    UPDATE users
    SET
     verification_code = ?,
     code_expires_at = ?
    WHERE email = ?
    `, [code,expiresAt,email]
  )
  return result.affectedRows
  } catch (error) {
    throw error
  }
}