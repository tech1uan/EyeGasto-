import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
import cors from 'cors';
import router from './routes/central.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './middleware/logger.js';
import notFound from './middleware/notFound.js';
import cookieParser from 'cookie-parser';
import { authMiddleware } from './middleware/authMiddleware.js';
import path from 'path';
import { fileURLToPath } from 'url';
import latencyCheck from './middleware/latencyCheck.js';

const PORT = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.resolve(__dirname, '../frontend/public');
const protectedPath = path.resolve(__dirname, '../frontend/protected');

const server = express();

server.use(logger);
server.use(latencyCheck)
server.use(cors());
server.use(cookieParser());
server.use(express.json())


server.use(express.static(publicPath));


server.get('/login', (req,res) => {
  res.sendFile(path.join(publicPath,'login.html'))
})

server.get('/register',(req,res) => {
  res.sendFile(path.join(publicPath,'register.html'))
})

server.get('/app/auth', authMiddleware, (req,res) => {
  res.json({user: req.user})
})

server.use('/', router);
server.use(notFound);
server.use(errorHandler);


server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`)
})