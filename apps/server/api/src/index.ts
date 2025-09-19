//  ---  These fucking two line must be top if you use redis
import * as dotenv from 'dotenv';
dotenv.config();

//  --now no one care these line where imported
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';

import authRoutes from './routes/routesAuth';
import messagesRoutes from './routes/routesMessages';
import profileRoutes from './routes/routesUpdate';
import addContactRoutes from './routes/routesContact';
import deleteRoutes from './routes/routesDelete';
import { setupSocket } from './config/socket';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

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
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
