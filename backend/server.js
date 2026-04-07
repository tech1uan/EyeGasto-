import express from 'express';
import cors from 'cors';
import router from './routes/central.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './middleware/logger.js';
import notFound from './middleware/notFound.js';


const PORT = process.env.PORT || 8000;

const server = express();

server.use(cors());
server.use(express.json())

server.use(express.static('../frontend'));


server.use('/', router);
server.use(logger);
server.use(notFound);
server.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})