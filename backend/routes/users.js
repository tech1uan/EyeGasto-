import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getTotalUsersByRange, getUserByUserID, setNewPassword, updateProfile, updateProfilePicture } from '../database/models/users.js';
import upload from '../middleware/uploadProfile.js';
import { resetSavings } from '../database/models/savings.js';
import { deleteAllExpenses } from '../database/models/expenses.js';
import { resetBudget } from '../database/models/budget.js';
import pool from '../database/config.js';
import validate from '../middleware/validate.js';
import { changePasswordValidator, updateProfileValidator } from '../validators/inputValidators.js';
import { matchedData, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import cloudinary from '../services/cloudinary.js';

const userRouter = express.Router();

function getPublicId(imageUrl) {
  const parts = imageUrl.split("/");

  const filename = parts.pop(); 
  const folder = parts.pop();  

  const name = filename.substring(0, filename.lastIndexOf("."));

  return `${folder}/${name}`;
}

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

    const imagePath = req.file.path;
  
    if (
    oldPicture &&
    oldPicture.startsWith("https://res.cloudinary.com/")
    ){
      const publicId = getPublicId(oldPicture);
      try {
      const result = await cloudinary.uploader.destroy(publicId);

      } catch (err) {
          console.warn("Couldn't delete old image:", err.message);
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
