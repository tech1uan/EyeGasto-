import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { deleteNotification, getNotifications, pushNotification, setNotificationRead } from '../database/models/notifications.js';
import { notificationValidator, setReadValidator } from '../validators/notificationValidator.js';
import { matchedData } from 'express-validator';
import {getNotificationStatus, updateLastReminderDate, updateLastTipDate } from '../database/models/users.js';
import validate from '../middleware/validate.js';

export const notificationsRouter = express.Router();

notificationsRouter.post('/add', authMiddleware, [...notificationValidator], validate, async(req,res,next) => {
     
    const {userId} = req.user;
    const {mood,title,message} = matchedData(req);
    try {
    const result = await pushNotification(userId, mood, title, message)
    
    if(result.affectedRows != 0) {
       return res.status(200).json({success:true, notifcations: result})
    };
    
     return res.status(500).json({
        success: false,
        msg: "Failed to add notification."
      });
   
    } catch (error) {
           next(error)
    }
})

notificationsRouter.get('/get', authMiddleware, async(req,res,next) => {
     
    const {userId} = req.user;
    try {
    const result = await getNotifications(userId)
 
    return res.status(200).json({success:true, notifications:result});

    } catch (error) {
      next(error)
    }
})

notificationsRouter.patch('/set-read', authMiddleware, setReadValidator, validate, async(req,res,next) => {
     
    const {userId} = req.user;
    const {notificationId} = req.body
    try {
    const result = await setNotificationRead(userId,notificationId)
    
    if(result.affectedRows != 0) {
          return res.status(200).json({success:true, msg:'Successfully set notification as read!'});
    }

     return res.status(404).json({
        success: false,
        msg: "Notification not found."
      });
   

    } catch (error) {
      next(error)
    }
})
notificationsRouter.get(
  "/notif-status",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { userId } = req.user;

      const data = await getNotificationStatus(userId);

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
);


notificationsRouter.patch(
  '/tip',
  authMiddleware,
  async (req, res, next) => {
    try {

      const { userId } = req.user;

      await updateLastTipDate(userId);

      res.json({
        success: true
      });

    } catch (error) {
      next(error);
    }
});

notificationsRouter.patch(
  '/reminder',
  authMiddleware,
  async (req, res, next) => {
    try {

      const { userId } = req.user;

      await updateLastReminderDate(userId);

      res.json({
        success: true
      });

    } catch (error) {
      next(error);
    }
});

notificationsRouter.delete('/delete', authMiddleware, setReadValidator, validate,async(req,res,next) => {
  try {
    const {notificationId} = matchedData(req)
    const result = await deleteNotification(notificationId);

    if(result.affectedRows != 0) {
      return res.status(200).json({success: true, msg: 'Successfully delete notification!'})
    }

    return res.status(404).json({
        success: false,
        msg: "Notification not found."
      });
   
  } catch (error) {
    next(error)
  }
})


