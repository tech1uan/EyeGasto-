

const latencyCheck = (req,res,next) => {
  console.log('🔥 latency middleware hit');
  const start = process.hrtime.bigint();


  res.on('finish', () => {
  const end = process.hrtime.bigint();

  
  const latency = Number(end - start) / 1e6
  console.log(`[${req.method}] ${req.originalUrl} ${latency.toFixed(2)}ms`)
  })

  next();
}

export default latencyCheck;