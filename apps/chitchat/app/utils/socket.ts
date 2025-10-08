// /app/utils/socket.ts

import { io } from 'socket.io-client';

const socket = io('http://192.168.1.8:8080', {
	withCredentials: true,
	transports: ['websocket', 'polling'], //use websocket only
	autoConnect: false,
});

export default socket;
