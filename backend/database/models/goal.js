import pool from "../config.js";


export async function updateSavingsGoal(userId, description, amount) {
    try {
     const [result] = await pool.query(
        `
        UPDATE savings
        SET goal_name = ?, target_amount = ?
        WHERE user_id = ?
        `,[description,amount,userId])
        
        if(result.affectedRows === 0) {
            return {
                success: false,
                message: 'Savings account not found or not authorized!'
            }
        }

        const [rows] = await pool.query(
            `
            SELECT goal_name,target_amount
            FROM savings
            WHERE user_id = ?
            `
        ,[userId])

        return {
            success: true,
            message: 'Savings goal updated!',
            goal: rows[0]
        }
    } catch (error) {
        throw error
    }
}

