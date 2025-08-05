//  ---  These fucking line must be the absolute first line when ever you use redis you should care these two line above the code like this.
import * as dotenv from 'dotenv';
dotenv.config();

//  --now no one care these line where imported
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';

import messagesRoutes from './routes/routesMessages';
import authRoutes from './routes/routesAuth';
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

app.use('/api/auth', authRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/contact', addContactRoutes);
app.use('/api/delete', deleteRoutes);

//Initialize Socket.io
setupSocket(server);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
