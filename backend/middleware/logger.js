import colors from 'colors';


const logger = (req,res,next) => {
  const methodColor = {
    GET: 'green',
    POST: 'blue',
    PUT: 'yellow',
    DELETE: 'red'
  }
  const color = methodColor[req.method];
  console.log(`${req.method}${req.url}`[color]);

  next();
}

export default logger;