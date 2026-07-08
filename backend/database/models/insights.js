import pool from "../config.js";

export async function checkInsight(userId,range) {
try {
   const [rows] = await pool.query(
    `
    SELECT title, body
    FROM smart_insights
    WHERE user_id = ?
    AND range_type = ?
    `,
    [userId, range]
);

if (rows.length > 0) {
    return {
        success: true,
        insight: rows[0]
    }
}
} catch (error) {
    throw error
}
}

export async function storeInsight(userId,range,title,body) {
try {
   const [rows] = await pool.query(
    `
    INSERT INTO smart_insights
    (user_id, range_type, title, body)
    VALUES (?, ?, ?, ?)
    `,
    [
        userId,
        range,
        title,
        body
    ]
);

return {
    success:true
}
} catch (error) {
    throw error
}
}

export async function deleteInsights(userId) {
    const [result] = await pool.query(
        `
        DELETE FROM smart_insights
        WHERE user_id = ?
        `,
        [userId]
    );
 
    return {
        affectedRows: result.affectedRows
    }
  
}

