
import express from 'express';
import bcrypt from 'bcrypt';
import {deleteAllUserTokens, deleteUserToken, getRefreshTokenById, insertRefreshToken } from '../database/models/tokens.js';
import { createUser, getUserByEmail, getUserByUserID, getUserByUsername, setLastLogin, updateVerificationCode, verifyUser } from '../database/models/users.js';
import jwt from 'jsonwebtoken';
import { createUserSavingsAcc } from '../database/models/savings.js';
import { createUserBudget } from '../database/models/budget.js';
import validate from '../middleware/validate.js';
import {matchedData} from 'express-validator';
import { emailValidator, loginIdentifierValidator, loginPasswordValidator,registerNameValidator,registerPasswordValidator, registerUsernameValidator } from '../validators/authValidators.js';
import transporter from '../services/mailer.js';
import rateLimit from 'express-rate-limit';


export const authRouter = express.Router();
const isProduction = process.env.NODE_ENV === 'production';


const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {msg:'Too many login attempts. Try again later.'},
});

export const verifyLimiter = rateLimit({
  windowMs: 10 * 60  * 1000,
  max: 3,
  message: {msg: 'Too many verification attempts.'}
})

export const resendLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: {msg: 'Too many resend attempts.'},
})


authRouter.post('/register', [...registerNameValidator,... registerUsernameValidator, ...emailValidator, ...registerPasswordValidator], validate,
  async (req,res,next) => {
    const {firstName,lastName,username,email,password} = matchedData(req);

    const verificationCode = Math.floor( 100000 + Math.random() * 900000).toString();
    const hashedVerificationCode = await bcrypt.hash(verificationCode, 10);
    const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

try { 
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('1')
  await createUser(firstName,lastName,username,email,hashedPassword,hashedVerificationCode,codeExpiresAt);
  console.log('2')
  const user = await getUserByUsername(username);
  console.log('3')
  await createUserSavingsAcc(user.id);
    console.log('4')
  await createUserBudget(user.id);
    console.log('5')

    console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);
  try {
    await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email',
    html: `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#E6F5F4;padding:40px 0;">
  <tr>
    <td align="center">
      <table role="presentation" width="420" cellpadding="0" cellspacing="0" style="max-width:420px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,122,116,0.12);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(180deg,#007A74 0%,#009E94 20%,#23736F 100%);padding:36px 24px;" align="center">
            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
              GASTOO
            </p>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.85);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
              Smart Expense Tracker
            </p>
          </td>
        </tr>

        <!-- Verification Code -->
        <tr>
          <td align="center" style="padding:36px 32px 32px;">

            <h2 style="margin:0 0 6px;font-size:19px;font-weight:600;color:#1A1A1A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
              Your verification code
            </h2>

            <p style="margin:0 0 24px;font-size:14px;color:#6B7280;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
              Enter this code to verify your email address.
            </p>

            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
              <tr>
                <td style="background:#E6F5F4;border-radius:12px;padding:18px 36px;">
                  <h1 style="margin:0;font-size:34px;letter-spacing:8px;font-weight:700;color:#007A74;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
                    ${verificationCode}
                  </h1>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#9CA3AF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
              This code expires in <b style="color:#23736F;">10 minutes</b>
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:0 32px;">
            <div style="border-top:1px solid #F1F5F4;"></div>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:20px 32px 28px;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
              Didn't request this? You can safely ignore this email.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
      `

    })
    console.log('6')
    console.log("✅ Email sent successfully!");
  } catch (error) {
    console.error("❌ Nodemailer Error:", error);

    return res.status(500).json({
        msg: "Failed to send email."
    });
}
  
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

  if(new Date(user.code_expires_at) < new Date()) {
    const error = new Error('Verification code expired! Please register again.');
    error.status = 400;
    return next(error);
   }

   const codeMatch = await bcrypt.compare(code,user.verification_code)

   
   if(!codeMatch) {
    const error = new Error('Invalid verification code');
    error.status= 403;
    return next(error)
   }

   await verifyUser(email);
   res.status(200).json({msg: 'Email verified successfully'})
 } catch (error) {
  next(error);
 }
})

authRouter.post('/resend-code', resendLimiter, async (req,res,next) => {
  const {email} = req.body;
  console.log("Resend code route called");
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
  const secondsSinceLastSent = (now - lastSent) / 1000;

    if(secondsSinceLastSent < 30) {
      const secondsLeft = Math.ceil(30 - secondsSinceLastSent);
      return res.status(429).json({
        msg:`Please wait ${secondsLeft} seconds before resending!`
      })
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedNewCode = await bcrypt.hash(newCode,10);

    const newExpiresAt = new Date (Date.now() + 10 * 60 * 1000);

    await updateVerificationCode(email,hashedNewCode,newExpiresAt);
    
    try {
   await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your new verification code',
         html: `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#E6F5F4;padding:40px 0;">
  <tr>
    <td align="center">
      <table role="presentation" width="420" cellpadding="0" cellspacing="0" style="max-width:420px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,122,116,0.12);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(180deg,#007A74 0%,#009E94 20%,#23736F 100%);padding:36px 24px;" align="center">
            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
              GASTOO
            </p>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.85);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
              Smart Expense Tracker
            </p>
          </td>
        </tr>

        <!-- Verification Code -->
        <tr>
          <td align="center" style="padding:36px 32px 32px;">

            <h2 style="margin:0 0 6px;font-size:19px;font-weight:600;color:#1A1A1A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
              Your verification code
            </h2>

            <p style="margin:0 0 24px;font-size:14px;color:#6B7280;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
              Enter this code to verify your email address.
            </p>

            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
              <tr>
                <td style="background:#E6F5F4;border-radius:12px;padding:18px 36px;">
                  <h1 style="margin:0;font-size:34px;letter-spacing:8px;font-weight:700;color:#007A74;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
                    ${newCode}
                  </h1>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#9CA3AF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
              This code expires in <b style="color:#23736F;">10 minutes</b>
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:0 32px;">
            <div style="border-top:1px solid #F1F5F4;"></div>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:20px 32px 28px;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
              Didn't request this? You can safely ignore this email.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
      `});
   
    console.log("✅ Email sent successfully!");

     } catch (error) {
    console.error("❌ Nodemailer Error:", error);

    return res.status(500).json({
        msg: "Failed to send email."
    });
}

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
        return res.status(401).json({
        msg: "Please verify your email first.",
        verified: false,
        email: user.email
      });
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

