//  ---  These fucking two line must be top if you use redis
import * as dotenv from 'dotenv';
dotenv.config();

//  --now no one care these line where imported
import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';


import authRoutes from './routes/routesAuth';
import messagesRoutes from './routes/routesMessages';
import profileRoutes from './routes/routesUpdate';
import addContactRoutes from './routes/routesContact';
import deleteRoutes from './routes/routesDelete';
import { setupSocket } from './config/socket';


const PORT = Number(process.env.PORT);
const app = express();
const server = http.createServer(app);//Important: attach to server

//middleware
app.use(cors({ origin:  'https://connect.x-dev.site', credentials: true }));
app.use(express.json({ limit: '100mb' }));
app.use(cookieParser());

// <- Routes ->
//for authentication, logout,checkAuth
app.use('/api/auth', authRoutes);
//for sidebar, getMessage, sendMessage
app.use('/api/messages', messagesRoutes);
//for updateCredential
app.use('/api/profile', profileRoutes);
//for addContact
app.use('/api/contact', addContactRoutes);
//for delete user
app.use('/api/delete', deleteRoutes);

//Initialize Socket.io
setupSocket(server);

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server + socket.io is listening on PORT http://${PORT}`);
});
