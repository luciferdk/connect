// /app/utils/socket.ts

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

if (typeof window !== 'undefined') {
  socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
    withCredentials: true,
    transports: ['websocket', 'polling'], //use websocket only
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDely: 1000,
  });
}

export default socket;
