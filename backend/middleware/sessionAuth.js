import jwt from "jsonwebtoken";
import { getUserByUserID } from "../database/models/users.js";
import { getRefreshTokenById } from "../database/models/tokens.js";
import bcrypt from "bcrypt";

export async function sessionAuth(req,res,next){

    const accessToken = req.cookies?.accessToken;

    // 1. Try access token first
    if(accessToken){

        jwt.verify(
            accessToken,
            process.env.ACCESS_KEY_SECRET,
            async(err,user)=>{

                if(!err){

                    req.user = user;
                    return next();

                }

                return refreshSession(req,res,next);
            }
        )

    }else{

        return refreshSession(req,res,next);

    }

}


async function refreshSession(req,res,next){

    const refreshToken = req.cookies?.refreshToken;
    const refreshTokenId = req.cookies?.refreshTokenId;


    if(!refreshToken || !refreshTokenId){
        return next();
    }


    jwt.verify(
        refreshToken,
        process.env.REFRESH_KEY_SECRET,
        async(err,user)=>{


            if(err){
                return next();
            }


            const dbToken = await getRefreshTokenById(refreshTokenId);


            if(!dbToken){
                return next();
            }


            const match = await bcrypt.compare(
                refreshToken,
                dbToken.token
            );


            if(!match){
                return next();
            }



            const dbUser = await getUserByUserID(user.userId);


            const jwtUser={
                userId:dbUser.id,
                role:dbUser.role
            };


            const newAccessToken = jwt.sign(
                jwtUser,
                process.env.ACCESS_KEY_SECRET,
                {
                    expiresIn:"30s"
                }
            );


            res.cookie(
                "accessToken",
                newAccessToken,
                {
                    httpOnly:true,
                    secure:process.env.NODE_ENV==="production",
                    sameSite:"None",
                    maxAge:15*60*1000
                }
            );


            req.user = jwtUser;

            next();

        }
    )

}