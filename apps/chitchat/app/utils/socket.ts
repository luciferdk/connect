// /app/utils/socket.ts

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

if (typeof window !== 'undefined') {
  socket = io('http://10.54.158.144:8080', {
    withCredentials: true,
    transports: ['websocket', 'polling'], //use websocket only
    autoConnect: false,
  });
}

export default socket;
