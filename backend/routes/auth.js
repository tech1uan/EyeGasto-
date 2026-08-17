import express from 'express';
import bcrypt from 'bcrypt';
import {deleteAllUserTokens, deleteUserToken, getRefreshTokenById, insertRefreshToken } from '../database/models/tokens.js';
import { createUser, getUserByUserID, getUserByUsername, setLastLogin } from '../database/models/users.js';
import jwt from 'jsonwebtoken';
import { createUserSavingsAcc } from '../database/models/savings.js';
import { createUserBudget } from '../database/models/budget.js';
import validate from '../middleware/validate.js';
import {matchedData} from 'express-validator';
import {loginPasswordValidator,registerNameValidator,registerPasswordValidator, registerUsernameValidator, loginUsernameValidator } from '../validators/authValidators.js';
import rateLimit from 'express-rate-limit';


export const authRouter = express.Router();
const isProduction = process.env.NODE_ENV === 'production';


const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {msg:'Too many login attempts. Try again later.'},
});


authRouter.post('/register', [...registerNameValidator,... registerUsernameValidator, ...registerPasswordValidator], validate,
  async (req,res,next) => {
    const {firstName,lastName,username,password} = matchedData(req);

try { 
  const hashedPassword = await bcrypt.hash(password, 10);
  await createUser(firstName,lastName,username,hashedPassword);

  const user = await getUserByUsername(username);

  await createUserSavingsAcc(user.id);
  
  await createUserBudget(user.id);
  
  res.status(201).json({
    message: 'Account created successfully! You can now log in.'
  })

} catch (error) {
  next(error);
}

});

authRouter.post('/login', loginLimiter, [ 
  ...loginUsernameValidator,
    ...loginPasswordValidator],validate,
  
    async (req,res,next) => {
    const {login,password} = matchedData(req);
  
  try {

      const user = await getUserByUsername(login);

      if(!user) {
        const error = new Error('Invalid credentials');
        error.status = 401;
        return next(error);
      }

      
    if(await bcrypt.compare(password,user.password)) {
     await deleteAllUserTokens(user.id)
    const jwtUser = {userId:user.id, role: user.role};
    const accessToken = generateAccessToken(jwtUser);
    const refreshToken = jwt.sign(jwtUser, process.env.REFRESH_KEY_SECRET, {expiresIn: '10d'});
    const decoded = jwt.decode(refreshToken);
    const expiresAt = new Date(decoded.exp * 1000);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const storeRefreshToken = await insertRefreshToken(user.id,hashedRefreshToken,expiresAt);

    if(!storeRefreshToken || storeRefreshToken.affectedRows === 0) {
      const error = new Error('Failed to store session');
      error.status = 500;
      return next(error);
    }

  
    let tokenId = storeRefreshToken.insertId;

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite:isProduction? 'None' : 'Lax',
      maxAge: 15* 60 * 1000
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite:isProduction? 'None' : 'Lax',
      maxAge: 10 * 24 * 60 * 60 * 1000
    })

     res.cookie('refreshTokenId', tokenId, {
      httpOnly: true,
      secure: isProduction,
      sameSite:isProduction? 'None' : 'Lax',
      maxAge: 10 * 24 * 60 * 60 * 1000
    })

    await setLastLogin(user.id);

    return res.status(200).json({msg:'Logged in successfully!', role: user.role});

    } else {
      const error = new Error('Invalid credentials');
      error.status = 401;
      return next(error);
    }

    } catch (error) {
     return next(error)
    }
    
});

authRouter.post('/token', async (req,res,next) => {
    const token = req.cookies?.refreshToken;
    const tokenId = req.cookies?.refreshTokenId;

      if(!token || !tokenId) {
      const error = new Error('Please insert your token!');
      error.status = 401;
      return next(error);
    }

  jwt.verify(token, process.env.REFRESH_KEY_SECRET, async (err,user) => {

    if(err) {
      res.clearCookie('refreshToken', {
        httpOnly:true,
        secure: isProduction,
        sameSite:isProduction? 'None' : 'Lax',
      });
      const error = new Error('Invalid refresh token!');
      error.status = 401;
      return next(error);
    }
  
  try {


     const dbUser = await getUserByUserID(user.userId);

    const jwtUser = {
      userId: dbUser.id,
      role: dbUser.role
    }
    
  
    const dbToken = await getRefreshTokenById(tokenId);

    if(!dbToken) {
      return next(new Error("Token not found!"));
    }
      const match = await bcrypt.compare(token, dbToken.token)
      console.log("4. Match:", match);
     if(!match) {
      await deleteAllUserTokens(jwtUser.userId);
      res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite:isProduction? 'None' : 'Lax',
      });
      return next(new Error('Token doesnt exist, all sessions invalidated!'));
     }

     if(new Date(dbToken.expires_at) < new Date()){
      await deleteUserToken(tokenId);
      console.log("5. Deleted old token");
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite:isProduction? 'None' : 'Lax',
      });
      return next(new Error('Refresh token expired!'));
     }


     await deleteUserToken(tokenId);
     console.log("5. Deleted old token");

    const newRefreshToken = jwt.sign(jwtUser, process.env.REFRESH_KEY_SECRET, {expiresIn: '10d'});
    const decoded = jwt.decode(newRefreshToken);
    const expiresAt = new Date(decoded.exp * 1000);
    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    const storeRefreshToken = await insertRefreshToken(jwtUser.userId, hashedRefreshToken, expiresAt);
    console.log("6. Stored new token:", storeRefreshToken);
    console.log("7. Sending response");
    const newTokenId = storeRefreshToken.insertId;

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite:isProduction? 'None' : 'Lax',
      maxAge: 10 * 24 * 60 * 60* 1000
    })

     res.cookie('refreshTokenId', newTokenId, {
      httpOnly: true,
      secure: isProduction,
      sameSite:isProduction? 'None' : 'Lax',
      maxAge: 10 * 24 * 60 * 60* 1000
    })

     const accessToken = generateAccessToken(jwtUser);

     res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite:isProduction? 'None' : 'Lax',
      maxAge: 15 * 60 * 1000
     })
     res.status(200).json({msg:'Token refreshed!', newAccessToken:accessToken});
    }
    
    catch(error) {
      next(error);
    }
  })
});


authRouter.post('/logout', async (req,res,next) => {
  try {
    const token = req.cookies?.refreshToken;
    const tokenId = req.cookies?.refreshTokenId;
    
    if(!token || !tokenId) {
      const error = new Error('No refresh token found!');
      error.status = 401;
      return next(error)
    }

   const userToken = await getRefreshTokenById(tokenId);
    
   const match = await bcrypt.compare(token, userToken.token)
   
    if(!match) {
      return next(new Error('Token not found!'));
    }

    await deleteUserToken(tokenId);

   res.clearCookie('accessToken', {
    httpOnly:true,
      secure: isProduction,
      sameSite:isProduction? 'None' : 'Lax',
   })

   res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite:isProduction? 'None' : 'Lax',
   });

   res.clearCookie('refreshTokenId', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction? 'None' : 'Lax'
   })

   res.status(200).json({msg: 'Logged out successfully!'});
  } catch (error) {
    next(error);
  }
})

function generateAccessToken (jwtUser) {

return jwt.sign(jwtUser,process.env.ACCESS_KEY_SECRET, {expiresIn: '15m'})
}
