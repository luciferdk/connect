import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

// Message type interface
interface ChatMessage {
  type: 'chat' | 'system';
  senderId?: string;
  content: string;
  timestamp: number;
}

// Create HTTP server
const server = http.createServer((request, response) => {
  console.log(new Date() + ' Received request for ' + request.url);
  response.writeHead(200);
  response.end("WebSocket server is up");
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
  console.log("Client connected");

  // Send welcome message to newly connected client
  const welcomeMessage: ChatMessage = {
    type: 'system',
    content: 'Welcome to the chat!',
    timestamp: Date.now()
  };
  ws.send(JSON.stringify(welcomeMessage));

  // Listen for incoming messages from client
  ws.on('message', (data: WebSocket.RawData) => {
    try {
      const msg: ChatMessage = JSON.parse(data.toString());

      console.log(`[${msg.senderId}] ${msg.content}`);

      // Broadcast message to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(msg));
        }
      });
    } catch (err) {
      console.error("Failed to parse message:", err);
    }
  });

  ws.on('error', console.error);
});






// Start server
const PORT = 8080;
server.listen(PORT, () => {
  console.log(new Date() + ` Server is listening on port ${PORT}`);
});
