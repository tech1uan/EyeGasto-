
import pool from "../config.js";


export async function saveSubscription(userId,subscription) {
    const {endpoint,keys} = subscription;

    try {
        const [result] =  await pool.query(
            `INSERT INTO subscriptions (user_id, endpoint, p256dh, auth) 
            VALUES (?, ?, ?, ?)`,
            [userId, endpoint, keys.p256dh, keys.auth]
        );

        return result.affectedRows;


    } catch (error) {
        throw error
    }
}

export async function getSubscriptionsByUser(userId) {
    try {
        const [rows] = await pool.query(
            `
            SELECT * FROM subscriptions WHERE user_id = ?
            `, [userId]
        )

        return rows; 
    } catch (error) {
        throw error
    }
}
 

export async function deleteSubscriptionsByUser(userId) {

    const [result] = await pool.query(
        `
        DELETE FROM subscriptions
        WHERE user_id = ?
        `,
        [userId]
    );

    return result.affectedRows;
};

export async function deleteSubscriptionsByEndpoint(endpoint) {

    const [result] = await pool.query(
        `
        DELETE FROM subscriptions
        WHERE endpoint = ?
        `,
        [endpoint]
    );

    return result.affectedRows;
};


export async function deleteSubscription(id) {

    const [result] = await pool.query(
        `
        DELETE FROM subscriptions
        WHERE id = ?
        `,
        [id]
    );

    return result.affectedRows;
};


export async function getSubscriptionByEndpoint(endpoint) {

    try {

        const [rows] = await pool.query(
            `
            SELECT id
            FROM subscriptions
            WHERE endpoint = ?
            `,
            [endpoint]
        );

        return rows[0];

    } catch (error) {
        throw error;
    }

}