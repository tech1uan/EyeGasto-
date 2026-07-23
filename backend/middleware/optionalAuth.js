import jwt from 'jsonwebtoken';

export const optionalAuth = (req, res, next) => {
    const token = req.cookies?.accessToken;

    console.log("optionalAuth hit");

    if (!token) {
        console.log("No access token");
        req.user = null;
        return next();
    }

    jwt.verify(token, process.env.ACCESS_KEY_SECRET, (err, user) => {
        console.log("Verify error:", err?.name);
        console.log("User:", user);

        if (err) {
            req.user = null;
            return next();
        }

        req.user = user;
        next();
    });
};