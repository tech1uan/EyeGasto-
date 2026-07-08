import jwt from 'jsonwebtoken';

export const optionalAuth = (req, res, next) => {
    const token = req.cookies?.accessToken;


    if (!token) {
        req.user = null;
        return next();
    }

    jwt.verify(token, process.env.ACCESS_KEY_SECRET, (err, user) => {


        if (err) {
            req.user = null;
            return next();
        }

          console.log(user);

        req.user = user;
        next();
    });
};