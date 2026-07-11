import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {deleteSubscriptionsByEndpoint, saveSubscription } from '../database/models/subscriptions.js';
import {notifyValidator, subscriptionIdValidator, subscriptionValidator, unsubscribeValidator } from '../validators/subscriptionValidator.js';
import validate from '../middleware/validate.js';
import { notifyUser } from '../services/pushNotification.js';
import { matchedData } from 'express-validator';

const subscriptionsRouter = express.Router();


subscriptionsRouter.get('/vapid-public-key', authMiddleware, (req, res, next) => {
  try {
    res.status(200).json({ success: true, key: process.env.VAPID_PUBLIC_KEY });
  } catch (error) {
    next(error);
  }
});

subscriptionsRouter.post('/subscribe', authMiddleware, [...subscriptionValidator], validate, async (req, res) => {
  try {
    const {userId} = req.user;
    const subscription = matchedData(req);

       await saveSubscription(userId, subscription);
    
    res.status(201).json({});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});

subscriptionsRouter.delete('/unsubscribe', authMiddleware,unsubscribeValidator, validate, async (req, res, next) => {
  try {

    const {endpoint} = matchedData(req);


    const result = await deleteSubscriptionsByEndpoint(endpoint);
    res.status(200).json({ success: true, result });
  } catch (error) {
    next(error);
  }
});

subscriptionsRouter.post('/notify', authMiddleware,[...notifyValidator], validate, async (req, res, next) => {
  try {
    const {userId} = req.user;
    const {title,body} = req.body;

    await notifyUser(userId, title, body)

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});


export default subscriptionsRouter;