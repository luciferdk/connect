//  ---  These fucking line must be the absolute first line ---
//      --when ever you use redis you should care these two line above the code like this.
import * as dotenv from 'dotenv';
dotenv.config();

//  --now no one care thse se line where imported
import express from 'express';
import cors from 'cors';
import messagesRoutes from './routes/routesMessages';
import authRoutes from './routes/routesAuth';
import cookieParser from 'cookie-parser';



const app = express();
const PORT = process.env.PORT;


app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messagesRoutes);

// Start server
app.listen(PORT, () => {
  console.log(` Server is listening on port ${PORT}`);
});
