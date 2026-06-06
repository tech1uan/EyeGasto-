import express from 'express';
import bcrypt from 'bcrypt';
import {deleteAllUserTokens, deleteUserToken, getRefreshTokenById, insertRefreshToken } from '../database/models/tokens.js';
import { createUser, getUserByEmail, getUserByUsername, updateVerificationCode, verifyUser } from '../database/models/users.js';
import jwt from 'jsonwebtoken';
import { createUserSavingsAcc } from '../database/models/savings.js';
import { createUserBudget } from '../database/models/budget.js';
import validate from '../middleware/validate.js';
import {matchedData} from 'express-validator';
import { emailValidator, loginIdentifierValidator, loginPasswordValidator,registerPasswordValidator, registerUsernameValidator } from '../validators/authValidators.js';
import transporter from '../services/mailer.js';
import rateLimit from 'express-rate-limit';


export const authRouter = express.Router();
const isProduction = process.env.NODE_ENV === 'production';


const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {msg:'Too many login attempts. Try again later.'},
});

const verifyLimiter = rateLimit({
  windowMs: 10 * 60  * 1000,
  max: 3,
  message: {msg: 'Too many verification attempts.'}
})

const resendLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: {msg: 'Too many resend attempts.'},
})


authRouter.post('/register', [... registerUsernameValidator, ...emailValidator, ...registerPasswordValidator], validate,
  async (req,res,next) => {
    const {username,email,password} = matchedData(req);

    const verificationCode = Math.floor( 100000 + Math.random() * 900000).toString();
    const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

try { 
  const hashedPassword = await bcrypt.hash(password, 10);

  await createUser(username,email,hashedPassword, verificationCode,codeExpiresAt);

  const user = await getUserByUsername(username);

  await createUserSavingsAcc(user.id);
  await createUserBudget(user.id);
  
   transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email',
    html: `
        <h2>Your Verification Code</h2>
        <h1 style="letter-spacing:8px">${verificationCode}</h1>
        <p>Expires in <b>10 minutes</b></p>
      `
  })
  
  res.status(201).json({
    message: 'Verification code sent to email'
  })

} catch (error) {
  next(error);
}

});

authRouter.post('/verify-email', verifyLimiter, async (req,res,next) => {
  const {email, code} = req.body;
   
  try {
   const user = await getUserByEmail(email);

   if(!user) {
    const error = new Error('Invalid credentials');
    error.status= 401;
    return next(error)
   }
   
   if(user.verification_code !== code) {
  const error = new Error('Invalid verification code');
    error.status= 403;
    return next(error)
   }

   if(new Date(user.code_expires_at) < new Date()) {
    const error = new Error('Verification code expired! Please register again.');
    error.status = 400;
    return next(error);
   }

   await verifyUser(email);
   res.status(200).json({msg: 'Email verified successfully'})
 } catch (error) {
  next(error);
 }
})

authRouter.post('/resend-code', resendLimiter, async (req,res,next) => {
  const {email} = req.body;

  try {
    const user = await getUserByEmail(email);

    if(!user) {
      const error = new Error('User not found!');
      error.status = 404;
      return next(error);
    }

    if(user.is_verified) {
      const error = new Error('Email already verified!');
      error.status = 400;
      return next(error);
    }

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

    await updateVerificationCode(email,newCode,newExpiresAt);

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
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

authRouter.post('/login', loginLimiter, [ 
  ...loginIdentifierValidator,
    ...loginPasswordValidator],validate,
  

    async (req,res,next) => {
    const {login,password} = matchedData(req);

  try {
      const user = login.includes('@') ?
      await getUserByEmail(login) : await getUserByUsername(login);

      if(!user) {
        const error = new Error('Invalid credentials');
        error.status = 401;
        return next(error);
      }

      if(!user.is_verified) {
        const error = new Error('Please verify your email first.');
        error.status = 401;
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

    let tokenId = storeRefreshToken.insertId;
    console.log(tokenId);

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


    return res.status(200).json({msg:'Logged in successfully!'});

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

      console.log('Refresh token from cookie:', token);
      console.log('Refresh token Id from cookie:', tokenId);
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

    const userId = user.userId;

  try {
    const dbToken = await getRefreshTokenById(tokenId);
    if(!dbToken) {
      return next(new Error("Token not found!"));
    }
  
      const match = await bcrypt.compare(token, dbToken.token)
      console.log('Match result:', match);
      
     if(!match) {
      await deleteAllUserTokens(userId);
      res.clearCookie('refreshToken', {
        httpOnly: true,
      secure: isProduction,
      sameSite:isProduction? 'None' : 'Lax',
      });
      return next(new Error('Token doesnt exist, all sessions invalidated!'));
     }

     if(new Date(dbToken.expires_at) < new Date()){
      await deleteUserToken(tokenId);
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite:isProduction? 'None' : 'Lax',
      });
      return next(new Error('Refresh token expired!'));
     }


     await deleteUserToken(tokenId);

     const newRefreshToken = jwt.sign({userId}, process.env.REFRESH_KEY_SECRET, {expiresIn: '10d'});
    const decoded = jwt.decode(newRefreshToken);
    const expiresAt = new Date(decoded.exp * 1000);
    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    const storeRefreshToken = await insertRefreshToken(userId, hashedRefreshToken, expiresAt);
    
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

     const accessToken = generateAccessToken({userId});

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