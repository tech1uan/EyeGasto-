import pool from "../config.js";

export async function createUser(name,password) {
  
  try {
      const [result] = await pool.query(`
       INSERT INTO users(username,password)
       VALUES (?,?)
     `,[name,password]);

     return {
      id:result.insertId,
      username:name,
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

export async function insertRefreshToken(userId,token,expiresAt) {
  try {
    const[result] = await pool.query(
      `
      INSERT INTO refresh_tokens(user_id,token,expires_at)
      VALUES(?,?,?)
      `,[userId,token,expiresAt]
    )
    return {
      userId,
      affectedRows: result.affectedRows,
      insertId: result.insertId
    }
  } catch (error) {
    throw error
  }
}


export async function getUserTokens(userId) {
  try {
    const [result] = await pool.query(
      `
      SELECT * FROM refresh_tokens
      WHERE user_id = ?
      `,[userId]
    )

    return result;
  } catch (error) {
    throw error;
  }
}

export async function deleteAllUserTokens(userId) {
  try {
    const [result] = await pool.query(
      `
      DELETE FROM refresh_tokens
      WHERE user_id = ?
      `,[userId]
    )

    return {
      userId,
      affectedRows: result.affectedRows
    }
  } catch (error) {
    throw error
  }
}

export async function deleteUserToken(tokenId) {
  try {
    const [result] = await pool.query(
      `
      DELETE FROM refresh_tokens
      WHERE token_id = ?
      `,[tokenId]
    )

    return {
      tokenId,
      affectedRows: result.affectedRows
    }
  } catch (error) {
    throw error
  }
}

