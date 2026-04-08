import express from 'express';
import bcrypt from 'bcrypt';
import { createUser, deleteAllUserTokens, deleteUserToken, getUserByUsername, getUserTokens, insertRefreshToken } from '../database/models/tokens.js';
import jwt from 'jsonwebtoken';

export const authRouter = express.Router();


authRouter.post('/register', async (req,res,next) => {
    const {username,password} = req.body;

    if(!username || !password) {
    const error = new Error ('Please input username and password!');
    error.status = 400;
    return next(error);
    }

try {
  const userExist = await getUserByUsername(username); 

  if(userExist) {
    const error = new Error('User already exists!')
    error.status = 400;
    return next(error);
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  await createUser (username,hashedPassword);
  res.status(201).json({msg:'Successfully created account!'});

} catch (error) {
  next(error);
}

});


authRouter.post('/login', async (req,res,next) => {
  const {username,password} = req.body;
  if(!username || !password){
    const error = new Error('Please input username and password!');
    error.status = 400;
    return next(error);
  }

  try {
      const user = await getUserByUsername(username)
      if(user == null) {
      const error = new Error('User not found!');
      error.status = 400;
      return next(error);
     }
    if(await bcrypt.compare(password,user.password)) {
    const jwtUser = {userId:user.id};
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

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite:'strict',
      maxAge: 10 * 24 * 60 * 60 * 1000
    })


    res.status(200).json({accessToken});

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
      if(!token) {
      const error = new Error('Please insert your token!');
      error.status = 401;
      return next(error);
    }

  jwt.verify(token, process.env.REFRESH_KEY_SECRET, async (err,user) => {

    if(err) {
      const error = new Error('Invalid refresh token!');
      error.status = 401;
      return next(error);
    }

    const userId = user.userId;

  try {
     const userTokens = await getUserTokens(userId);
     let validToken = null;
     for(const t of userTokens) {
      if(await bcrypt.compare(token,t.token)) {
        validToken = t;
        break;
      }
     }
     if(!validToken) {
      await deleteAllUserTokens(userId);
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      const error = new Error('Token doesnt exist, all sessions invalidated!');
      error.status = 401;
      return next(error);
     }

     if(validToken.expires_at < new Date()){
      await deleteUserToken(validToken.token_id);
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure:process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      const error = new Error('Refresh token expired!');
      error.status = 401;
      return next(error);
     }

     await deleteUserToken(validToken.token_id);

     const newRefreshToken = jwt.sign({userId}, process.env.REFRESH_KEY_SECRET, {expiresIn: '10d'});
    const decoded = jwt.decode(newRefreshToken);
    const expiresAt = new Date(decoded.exp * 1000);
    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await insertRefreshToken(userId, hashedRefreshToken, expiresAt);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite:'strict',
      maxAge: 10 * 24 * 60 * 60* 1000
    })

     const accessToken = generateAccessToken({userId});
     res.status(200).json({accessToken});
    }

    catch(error) {
      next(error);
    }
  })
})


authRouter.post('/logout', async (req,res,next) => {
  try {
    const token = req.cookies?.refreshToken;
    
    if(!token) {
      const error = new Error('No refresh token found!');
      error.status = 401;
      return next(error)
    }

   const decoded = jwt.verify(token,process.env.REFRESH_KEY_SECRET);
   const userId = decoded.userId;

   const userTokens = await getUserTokens(userId);
   for (const t of userTokens) {
    if(await bcrypt.compare(token, t.token)) {
      await deleteUserToken(t.token_id);
      break;
    }
   }

   res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
   });

   res.status(200).json({msg: 'Logged out successfully!'});
  } catch (error) {
    next(error);
  }
})

function generateAccessToken (jwtUser) {
return jwt.sign(jwtUser,process.env.ACCESS_KEY_SECRET, {expiresIn: '15m'})
}