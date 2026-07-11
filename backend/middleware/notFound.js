
const notFound = (req,res,next) => {
  res.status(500).json({msg:'Not found!'});
  next();
}

export default notFound;