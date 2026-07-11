import jwt from 'jsonwebtoken';


export const authMiddleware = (req,res,next) => {
const token = req.cookies?.accessToken;

if(token == null) {
  const error = new Error(`Token missing!`);
  error.status = 401;
  return next(error);
}

jwt.verify(token, process.env.ACCESS_KEY_SECRET, (err,user) => {
  if(err) {
    if(err.name === 'TokenExpiredError') {
    const error = new Error('Token Expired!');
    error.status = 401;
    return next(error)
    } else {
    const error = new Error('Invalid token!');
    error.status = 401;
    return next(error);
    }
  }
  if(!user) {
    const error = new Error('Invalid token payload');
    error.status = 401;
    return next(error);
  }
  req.user = user
  next();
})

}