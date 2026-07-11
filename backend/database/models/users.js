
import pool from "../config.js";

export async function createUser(firstName,lastName,username,email,password,verification_code, expires_at) {
  
  try {
      const [result] = await pool.query(`
       INSERT INTO users(first_name,last_name, username,email,password, verification_code, code_expires_at)
       VALUES (?,?,?,?,?,?,?)
     `,[firstName,lastName,username,email,password,verification_code, expires_at]);

     return {
      id:result.insertId,
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
      SELECT * FROM users
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
    SELECT TRIM(concat(first_name, ' ' , last_name)) 
    AS full_name,
    id,
    role,
    first_name,
    last_name,
    username,
    email,
    password,
    created_at,
    verification_code,
    is_verified,
    code_expires_at,
    profile_picture

    FROM users
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

export async function updateVerificationCodeByID(userId,code,expiresAt) {
  try {
     const [result] = await pool.query (
    `
    UPDATE users
    SET
     verification_code = ?,
     code_expires_at = ?
    WHERE id = ?
    `, [code,expiresAt,userId]
  )
  return result.affectedRows
  } catch (error) {
    throw error
  }
}

export async function updateProfilePicture(userId, profilePicture) {
  try {
    const [result] = await pool.query(
      `
      UPDATE users
      SET profile_picture = ?
      WHERE id = ?
      `,[profilePicture, userId])

    return result.affectedRows;
  
  } catch (error) {
    throw error
  }
}

export async function updateProfile(userId, newFirstName,newLastName, newUsername) {
  try {
    const [result] = await pool.query(
      `
       UPDATE users
       SET first_name = ?,
       last_name = ?,
       username = ?
       WHERE id = ?
      `, [newFirstName, newLastName, newUsername, userId]);

      return result.affectedRows;
  } catch (error) {
    throw error
  }
} 

export async function requestEmailChange(userId, newEmail, verificationCode, codeExpiresAt) {
  try {
    const [result] = await pool.query(
      `
      UPDATE users
      SET pending_email = ?,
      verification_code = ?,
      code_expires_at = ?
      WHERE id = ?
      `, [newEmail,verificationCode,codeExpiresAt,userId]);

    return result.affectedRows
  } catch (error) {
    throw error
  }
}

export async function updateEmailChange(userId) {
  try {
    const [result] = await pool.query(
      `
      UPDATE users
      SET email = pending_email,
      pending_email = NULL,
      verification_code = NULL,
      code_expires_at = NULL
      WHERE id = ? 
      `, [userId]
    )

    return result.affectedRows
  } catch (error) {
    throw error
  }
}

export async function setNewPassword(userId, newPassword) {
  try {
    const [result] = await pool.query(`
      
      UPDATE users
      SET password = ?
      WHERE id = ?
      `, [newPassword, userId]);

    return result.affectedRows
  } catch (error) {
    throw error
  }
}

export async function getNotificationStatus(userId) {
  const [rows] = await pool.query(
    `
    SELECT
      last_tip_date,
      last_reminder_date
    FROM users
    WHERE id = ?
    `,
    [userId]
  );

  return rows[0];
}

export async function updateLastTipDate(userId) {
  const [result] = await pool.query(
    `
    UPDATE users
    SET last_tip_date = CURDATE()
    WHERE id = ?
    `,
    [userId]
  );

  return result;
}


export async function updateLastReminderDate(userId) {
  try {
    const [result] = await pool.query(
    `
    UPDATE users
    SET last_reminder_date = CURDATE()
    WHERE id = ?
    `,
    [userId]
  );

  return result;
  } catch (error) {
    throw error
  }

}

/*ADMIN SIDE QUERIES*/

export async function getTotalUsersByRange(range) {

   let current;
   let previous;

  const allowedRanges = ['last7', 'last30', 'last90']
  if(!allowedRanges.includes(range)) {
    throw new Error('Invalid range')
  }

 
  if(range === 'last7') {
    current = `
    created_at >= NOW() - INTERVAL 7 DAY
    `
  } else if (range === 'last30') {
    current = `
    created_at >= NOW() - INTERVAL 30 DAY
    `
  } else if(range === 'last90') {
    current = `
    created_at >= NOW() - INTERVAL 90 DAY
    `
  }


  if(range === 'last7') {
    previous = `
    created_at >= NOW() - INTERVAL 14 DAY
    AND created_at < NOW() - INTERVAL 7 DAY
    ` 
  } else if (range === 'last30') {
    previous = `
   created_at >= NOW() - INTERVAL 60 DAY
    AND created_at < NOW() - INTERVAL 30 DAY
    `
  } else if(range === 'last90') {
    previous = `
   created_at >= NOW() - INTERVAL 180 DAY
   AND created_at < NOW() - INTERVAL 90 DAY
    `
  }

  try {
    const [total] = await pool.query(`
      SELECT COUNT(*) AS total_users
      FROM users
      `,)

    
    const[totalCurrent] = await pool.query(`
      SELECT COUNT(*) AS total_users
      FROM users
      WHERE ${current}
      `)

    const[totalPrevious] = await pool.query(`
      SELECT COUNT(*) AS total_users
      FROM users
      WHERE ${previous}
      `)

    const allTimeUsers = total[0].total_users;
    const currentUsers = totalCurrent[0].total_users;
    const previousUsers = totalPrevious[0].total_users;

    const percentChange =
      previousUsers === 0
        ? 100
        : ((currentUsers - previousUsers) / previousUsers) * 100;

    return {
      allTimeUsers,
      currentUsers,
      previousUsers,
      percentChange
    };


  } catch (error) {
    throw error
  }
}

export async function setLastLogin(userId) {
  try {
    const [result] = await pool.query(`
      UPDATE users
      SET last_login = NOW()
      WHERE id = ?
      
      `, [userId])
  } catch (error) {
    throw error
  }
}

export async function getActiveUsersToday() {
  try {
     const [result] = await pool.query(`
      SELECT COUNT(*) as active_users_today
      FROM users
      WHERE DATE(last_login) = CURDATE();
      `)

    return result[0]
  } catch (error) {
    throw error
  }
}

export async function getNewSignups(range) {
  let current;
   let previous;

  const allowedRanges = ['last7', 'last30', 'last90']
  if(!allowedRanges.includes(range)) {
    throw new Error('Invalid range')
  }

    if(range === 'last7') {
      current = `
      created_at >= NOW() - INTERVAL 7 DAY
      `
    } else if (range === 'last30') {
      current = `
      created_at >= NOW() - INTERVAL 30 DAY
      `
    } else if(range === 'last90') {
      current = `
      created_at >= NOW() - INTERVAL 90 DAY
      `
    }


    if(range === 'last7') {
      previous = `
      created_at >= NOW() - INTERVAL 14 DAY
      AND created_at < NOW() - INTERVAL 7 DAY
      ` 
    } else if (range === 'last30') {
      previous = `
    created_at >= NOW() - INTERVAL 60 DAY
      AND created_at < NOW() - INTERVAL 30 DAY
      `
    } else if(range === 'last90') {
      previous = `
    created_at >= NOW() - INTERVAL 180 DAY
    AND created_at < NOW() - INTERVAL 90 DAY
      `
    }
  try {
    const [currentResult] = await pool.query(`
      
      SELECT COUNT(*) as new_signups
      FROM users
      WHERE ${current}
      `)

     const [previousResult] = await pool.query(`
      
      SELECT COUNT(*) as previous_signups
      FROM users
      WHERE ${previous}
      `)


    const currentResults = currentResult[0].new_signups;
    const previousResults = previousResult[0].previous_signups;

    let percentChange = 0;

    if (previousResults > 0) {
      percentChange = ((currentResults - previousResults) / previousResults) * 100;
    }

    return {
      newSignups: currentResults,
      previousSignups: previousResults,
      percentChange: Number(percentChange.toFixed(1))
    };

  } catch (error) {
    throw error
  }
 
}


export async function getRecentUsers() {
  try {
    const [result] = await pool.query(`
      SELECT TRIM(concat(u.first_name, ' ' ,u.last_name)) 
      AS full_name,
      u.id,
      u.username,
      u.created_at,
      u.profile_picture,
      u.email,
      u.last_login,
      COUNT(e.user_id) AS expensesLogged
      FROM users u
      LEFT JOIN expenses e
      ON u.id = e.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT 5;
      `)

     return result;
    } catch (error) {
    throw error
  }
}




export async function getUserGrowth(range) {

  const allowedRanges = ['last7', 'last30', 'last90'];

  if (!allowedRanges.includes(range)) {
    throw new Error('Invalid range');
  }

  let interval;

  if (range === 'last7') {
    interval = 7;
  } else if (range === 'last30') {
    interval = 30;
  } else {
    interval = 90;
  }

  try {

    const [signups] = await pool.query(`
      SELECT
      DATE(created_at) AS day,
      COUNT(*) AS signups
      FROM users
      WHERE created_at >= CURDATE() - INTERVAL ? DAY
      GROUP BY DATE(created_at)
      ORDER BY day
    `, [interval - 1]);

    const [activeUsers] = await pool.query(`
      SELECT
      DATE(last_login) AS day,
      COUNT(*) AS activeUsers
      FROM users
      WHERE last_login >= CURDATE() - INTERVAL ? DAY
      GROUP BY DATE(last_login)
      ORDER BY day
    `, [interval - 1]);

    return {
      
      signups,
      activeUsers
    };

  } catch (error) {
    throw error;
  }

}


export async function getNotificationPreference(userId) {
  try {
      const [rows] = await pool.execute(
        `
        SELECT notifications_enabled
        FROM users
        WHERE id = ?
        `,
        [userId]
    );

    return rows[0];
  } catch (error) {
     throw error
  }

}

export async function updateNotificationPreference(userId, enabled) {

    await pool.execute(
        `
        UPDATE users
        SET notifications_enabled = ?
        WHERE id = ?
        `,
        [enabled, userId]
    );
}