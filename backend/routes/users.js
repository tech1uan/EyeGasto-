import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getTotalUsersByRange, getUserByEmail, getUserByUserID, requestEmailChange, setNewPassword, updateEmailChange, updateProfile, updateProfilePicture, updateVerificationCode, updateVerificationCodeByID } from '../database/models/users.js';
import upload from '../middleware/uploadProfile.js';
import fs from 'fs/promises';
import path from 'path';
import { resetSavings } from '../database/models/savings.js';
import { deleteAllExpenses } from '../database/models/expenses.js';
import { resetBudget } from '../database/models/budget.js';
import pool from '../database/config.js';
import validate from '../middleware/validate.js';
import { changePasswordValidator, updateEmailValidator, updateProfileValidator } from '../validators/inputValidators.js';
import { matchedData, validationResult } from 'express-validator';
import transporter from '../services/mailer.js';
import { resendLimiter, verifyLimiter } from './auth.js';
import bcrypt from 'bcrypt';
import { authorizeMiddleware } from '../middleware/authorizeMiddleware.js';

const userRouter = express.Router();

userRouter.get('/', authMiddleware, async(req,res,next) => {
try {
  const {userId} = req.user; 

  if(!userId) {
   const error = new Error('Invalid or missing token!');
   error.status = 401;
   return next(error);
  }

  const user = await getUserByUserID(userId);
  if(!user) return next(new Error('User not found'));

  res.status(200).json({user});
} catch (error) {
  next(error)
}
})

userRouter.put('/update-profile', authMiddleware, [...updateProfileValidator], validate, async(req,res,next) => {
try {
  const {userId} = req.user; 
  const {newFirstName,newLastName,newUsername} = matchedData(req);

  const update = await updateProfile(userId,newFirstName,newLastName,newUsername);

  res.status(200).json({update});
} catch (error) {
  next(error)
}
})

userRouter.delete('/clear-data', authMiddleware, async (req, res, next) => {
  const connection = await pool.getConnection();

  try {
    const { userId } = req.user;
    await connection.beginTransaction();
    await deleteAllExpenses(connection, userId);
    await resetSavings(connection, userId);
    await resetBudget(connection, userId);
    await connection.commit();
    
    
    res.status(200).json({
      success: true,
      msg: 'All data cleared successfully.'
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

userRouter.patch('/profile-picture', authMiddleware, upload.single('profile'), 
async(req,res,next) => {
  try {
    const {userId} = req.user;

    const user = await getUserByUserID(userId)
    if(!user) return next(new Error('User not found'));

    const oldPicture = user.profile_picture;

    const imagePath = `/uploads/profiles/${req.file.filename}`

    if(oldPicture && oldPicture !== "/images/user.png") {

      const filePath = path.join(
        process.cwd(),
        oldPicture.substring(1)
      );
    

    try {
      await fs.unlink(filePath)
    } catch (error) {
      console.log('Old profile picture already deleted.')
    }

  }
    await updateProfilePicture(userId, imagePath);

    res.status(200).json({
      success:true,
      
    })
     
  } catch (error) {
    next(error)
  }
})


userRouter.put('/request-email-change', authMiddleware, updateEmailValidator[0], validate,async(req,res,next) => {
  try {
    const {userId} = req.user;
    const {newEmail} = matchedData(req);
    
    const user = await getUserByUserID(userId);
    
    if(user.email === newEmail) {
      const error = new Error('Email already verified!');
      error.status = 404;
      return next(error);
  
    }
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await requestEmailChange(userId, newEmail, verificationCode, codeExpiresAt);
    
    res.status(200).json({
      message: 'Verification code sent to your new email.'
    });

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: newEmail,
      subject: 'Verify your new email address',
      html: `
          <h2>Your Verification Code</h2>
          <h1 style="letter-spacing:8px">${verificationCode}</h1>
          <p>Expires in <b>10 minutes</b></p>
      `
    });


  } catch (error) {
    next(error);
  }
})

userRouter.post('/verify-email-change', authMiddleware, verifyLimiter, updateEmailValidator[1] ,validate, async (req,res,next) => {
  
   const {userId} = req.user;
   const {code} = req.body;

  try {

    const user = await getUserByUserID(userId);
    if(!user) return next(new Error('User not found'));

    if(user.verification_code !== code) {
      const error = new Error('Invalid verification code');
      error.status = 403;
      return next(error);
    }

    if(new Date(user.code_expires_at) < new Date()) {
      const error = new Error('Verification code expired!');
      error.status = 400;
      return next(error);
    }

    await updateEmailChange(userId);

    res.status(200).json({msg: 'Email verified successfully!'});

  } catch (error) {
    next(error)
  }
})

userRouter.post('/resend-code', authMiddleware, resendLimiter, async(req,res,next) => {
 
  const {userId} = req.user;

  try {
    const user = await getUserByUserID(userId); 
    if(!user) return next(new Error('User not found'));

    const now = new Date();
    const lastSent = new Date(user.code_expires_at) - 10*60*1000;
    const secondsSinceLastSent = (now-lastSent) / 1000;

    if(secondsSinceLastSent < 30) {
      const secondsLeft = Math.ceil(30 - secondsSinceLastSent);
      return res.status(429).json({
        msg:`Please wait ${secondsLeft} seconds before resending!`
      })
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newExpiresAt = new Date (Date.now() + 10 * 60 * 1000);

    await updateVerificationCodeByID(userId,newCode,newExpiresAt);

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.pending_email,
      subject: 'Your new verification code',
         html: `
        <h2>New Verification Code</h2>
        <h1 style="letter-spacing:8px">${newCode}</h1>
        <p>Expires in <b>10 minutes</b></p>
      `
    })

    res.status(200).json({msg: 'New code sent!'});

  } catch (error) {
    next(error)
  }
})

userRouter.patch('/set-new-password', authMiddleware, changePasswordValidator ,validate,
  async(req,res,next) => {
    const {userId} = req.user;
    const {currentPassword, newPassword} = matchedData(req);

    try {
    const user = await getUserByUserID(userId);

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    )

    if(!isMatch) {
      return res.status(400).json({
        success:false,
        message: 'Current password is incorrect'
      }) 
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await setNewPassword(userId, hashedPassword);

    res.json({
      success: true,
      message: 'Password updated successfully!'
    })
    
   } catch (error) {
      next(error)
    }
  }
)




export default userRouter;