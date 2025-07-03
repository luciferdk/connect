//  ---  These fucking line must be the absolute first line ---
//      --when ever you use redis you should care these two line above the code like this.
import * as dotenv from 'dotenv';
dotenv.config();

//  --now no one care thse se line where imported
import express from 'express';
import cors from 'cors';
import { messages } from './routes/routesMessages';
import authRoutes from './routes/routesAuth';
import cookieParser from 'cookie-parser';


const server  = express();
const PORT = process.env.PORT;

server.use(cors());
server.use(express.json());
server.use(cookieParser());

server.use('/api/auth', authRoutes);
server.use('/api/messages', messagesRoutes);


// Start server
server.listen(PORT, () => {
  console.log(` Server is listening on port ${PORT}`);
});
