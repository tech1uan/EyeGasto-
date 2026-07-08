import pool from "../config.js";


export async function pushNotification(userId, mood, title, message) {
    try {
       const [result] = await pool.query(
        `
        INSERT INTO notifications (user_id, mood, title, message)
        VALUES(?, ?, ?, ?)
        `,[userId,mood,title,message]
       )

       return result.affectedRows;

    } catch (error) {
        throw error
    }
} 

export async function getNotifications(userId) {
    try {
    const [result] = await pool.query(
        `
        SELECT * 
        FROM notifications
        WHERE user_id = ?
        `, [userId]

    )

    return result;
    } catch (error) {
        throw error
    }
}


export async function setNotificationRead(userId, notificationId) {
    try {
     const [result] = await pool.query(
        `
        UPDATE notifications
        SET is_read = true 
        WHERE notification_id = ? AND user_id = ?
        `,[notificationId,userId]
     )

     return result.affectedRows
    } catch (error) {
        throw error
    }
}

export async function insertNotificationForUser(userId, mood, title, message) {
    try {
          const [result] = await pool.query(
            `INSERT INTO notifications (user_id, mood, title, message)
            VALUES (?, ?, ?, ?)`,
            [userId, mood, title, message]
        );
        return result;
    } catch (error) {
        throw error
    }

}

