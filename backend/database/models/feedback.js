

import pool from "../config.js";


export async function addUserFeedback(userId, rating, type, message) {
    try {
        const [result] = await pool.query(`
            INSERT INTO feedback (user_id,rating,type,message)
            VALUES(?,?,?,?)            
            `,[userId, rating,type,message])

        return result.affectedRows;
    } catch (error) {
        throw error
    }
}
export async function getUserFeedbacks(filter = "all") {
  try {
    const validFilters = [
      "all",
      "new",
      "reviewing",
      "resolved",
      "archived",
      "bug",
      "idea",
      "praise",
      "other"
    ];

    if (!validFilters.includes(filter)) {
      throw new Error("Invalid filter");
    }

    let whereClause = "WHERE f.archived = 0";
    const params = [];

    switch (filter) {
      case "new":
      case "reviewing":
      case "resolved":
        whereClause += " AND f.status = ?";
        params.push(filter);
        break;

      case "archived":
        whereClause = "WHERE f.archived = 1";
        break;

      case "bug":
      case "idea":
      case "praise":
      case "other":
        whereClause += " AND f.type = ?";
        params.push(filter);
        break;

      case "all":
      default:
        whereClause = "WHERE f.archived = 0";
        break;
    }

    const [feedbacks] = await pool.query(
      `
      SELECT
        TRIM(CONCAT(u.first_name,' ',u.last_name)) AS full_name,
        f.id,
        u.username,
        u.profile_picture,
        f.user_id,
        f.type,
        f.rating,
        f.admin_reply,
        f.message,
        f.status,
        f.archived,
        f.created_at,
        f.updated_at
      FROM feedback f
      JOIN users u
        ON u.id = f.user_id
      ${whereClause}
      ORDER BY f.created_at DESC
      `,
      params
    );

    const [[stats]] = await pool.query(`
      SELECT
        COUNT(*) AS total_feedbacks,
        SUM(CASE WHEN status='new' AND archived=0 THEN 1 ELSE 0 END) AS new_feedbacks,
        SUM(
          CASE
            WHEN status='resolved'
            AND DATE(updated_at)=CURDATE()
            AND archived=0
            THEN 1
            ELSE 0
          END
        ) AS resolved_feedbacks_today
      FROM feedback
      WHERE archived=0
    `);

    return {
      feedbacks,
      stats: {
        totalFeedbacks: Number(stats.total_feedbacks),
        newFeedbacks: Number(stats.new_feedbacks),
        resolvedToday: Number(stats.resolved_feedbacks_today)
      }
    };
  } catch (error) {
    throw error;
  }
}
export async function setUserFeedbackStatus(feedbackId, status) {
    try {
      const [result] = await pool.query(`
        UPDATE feedback
        SET status = ?
        WHERE id = ?
        `, [status, feedbackId])
        
    return result.affectedRows;
    } catch (error) {
        throw error
    }
}


export async function archiveFeedback(id) {
    try {

        const [result] = await pool.query(`
            UPDATE feedback
            SET archived = 1
            WHERE id = ?
        `,[id]);

        return result.affectedRows;

    } catch (error) {
        throw error;
    }
}