import express from 'express';
import http from 'http';
import {Server} from "socket.io";
import { router } from "./routes.mjs";


const app = express();
app.use(express.json());
app.use("/api", router);


const server = http.createServer(app);

const io = new Server(server, { // Pass "server" here!
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const portn = 3000  
server.listen(portn, () => {
  console.log('listening on *:'+portn);
});
