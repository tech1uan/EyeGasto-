import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import router from './routes/central.js';

import logger from './middleware/logger.js';
import latencyCheck from './middleware/latencyCheck.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import { authorizeMiddleware } from './middleware/authorizeMiddleware.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import { optionalAuth } from './middleware/optionalAuth.js';
import webpush from 'web-push';

dotenv.config();

const PORT = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.resolve(__dirname, '../frontend/public');
const protectedPath = path.resolve(__dirname, '../frontend/protected');

const server = express();

server.use(logger);
server.use(latencyCheck);

server.use(cors({
  origin: [
    'https://gastoos.onrender.com',
    'https://gastoo-the-expense-tracker.vercel.app',
    'http://localhost:8000',      
  ],
  credentials: true
}));

console.log({
  DB_HOST: !!process.env.DB_HOST,
  VAPID: !!process.env.VAPID_PUBLIC_KEY,
  RESEND: !!process.env.RESEND_API_KEY,
  NODE_ENV: process.env.NODE_ENV
});

server.use(cookieParser());
server.use(express.json());

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
)

server.get('/', optionalAuth, (req, res) => {
    if (req.user?.role === 'admin') {
        return res.redirect('/gastoo-admin-dashboard');
    }

    return res.sendFile(path.join(publicPath, 'index.html'));
});

server.get('/login', optionalAuth, (req, res) => {
    res.set('Cache-Control', 'no-store');
    if (req.user?.role === 'admin') {
        return res.redirect('/gastoo-admin-dashboard');
    }

    if (req.user) {
        return res.redirect('/');
    }

    return res.sendFile(path.join(publicPath, 'login.html'));
});

server.get('/register', optionalAuth, (req, res) => {
    res.set('Cache-Control', 'no-store');
    if (req.user?.role === 'admin') {
        return res.redirect('/gastoo-admin-dashboard');
    }

    if (req.user) {
        return res.redirect('/');
    }

    return res.sendFile(path.join(publicPath, 'register.html'));
});


server.get('/verify', optionalAuth, (req,res) => {
  if(req.user) {
    return res.redirect('/')
  }
  return res.sendFile(path.join(publicPath, 'verify.html'));
})

server.get('/gastoo-admin-dashboard', (req, res) => {
    return res.sendFile(path.join(protectedPath, 'admin.html'));
});


server.get('/index.html', (_, res) => res.redirect('/'));
server.get('/login.html', (_, res) => res.redirect('/login'));
server.get('/register.html', (_, res) => res.redirect('/register'));



server.use(express.static(publicPath));

server.use(
    '/protected',
    express.static(protectedPath)
);

server.use('/uploads', express.static('uploads'));

server.get('/app/auth', authMiddleware, (req, res) => {
    return res.json({ user: req.user });
});

server.use('/', router);

server.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

server.use(notFound);
server.use(errorHandler);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});