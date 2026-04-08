import jwt from 'jsonwebtoken';


export const authMiddleware = (req,res,next) => {
const authHeader = req.headers['authorization'];
const token = authHeader ? authHeader.split(' ')[1] : null;

if(token == null) {
  const error = new Error('Token missing!');
  error.status = 401;
  return next(error);
}

jwt.verify(token, process.env.ACCESS_KEY_SECRET, (err,user) => {
  if(err) {
    if(err.status === 'TokenExpiredError') {
    const error = new Error('Token Expired!');
    error.status = 401;
    next(error)
    } else {
    const error = new Error('Invalid token!');
    error.status = 401;
    return next(error);
    }
  }

  req.user = user
  next();
})

}