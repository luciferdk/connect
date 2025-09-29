import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: Server;
let isInitialized = false;


export const setupSocket = (server: HTTPServer) => {
io = new Server(server, {
    cors: {
      origin: 'http:localhost:3000',
      credentials: true,
    },
  });
isInitialized = true;


  io.on('connection', (socket) => {
    console.log('✅ A user Connected', socket.id);

    socket.on('join', async (userId: string) => {
      socket.join(userId);
      console.log(`📦 User ${userId} joined room`);
    });

    socket.on('send_message', ({ recipientId, message }) => {
      io.to(recipientId).emit('recive_message', message); //send to recipient
      io.to(message.senderId).emit('rececive_message', message); // send back to sender for confirmation
    });

    socket.on('❌ disconnect', () => {
      console.log('A user disconnected', socket.id);
    });
  });
};
export const getIo = () => {
  if (!isInitialized || !io) throw new Error('socket.io not Initialized');
  return io;
};
