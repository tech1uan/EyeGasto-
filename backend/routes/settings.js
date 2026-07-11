import express from 'express';
import { getNotificationPreference, updateNotificationPreference } from '../database/models/users.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const settingsRouter = express.Router();

settingsRouter.get(
    "/notifications",
    authMiddleware,
   async (req, res, next) => {
       try {

        const result = await getNotificationPreference(req.user.userId);

        return res.json({
            enabled: Boolean(result.notifications_enabled)
        });

    } catch (err) {

        next(err);
    }
    }
    
);

settingsRouter.patch(
    "/notifications",
    authMiddleware,
   async (req, res, next) => {

    try {

        const { enabled } = req.body;

        await updateNotificationPreference(
            req.user.userId,
            enabled
        );

        return res.json({
            msg: "Notification preference updated."
        });

    } catch (err) {

        next(err);

    }

})

export default settingsRouter;