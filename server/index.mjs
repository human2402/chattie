import express from 'express';
import http from 'http';
import {Server} from "socket.io";
import { router } from "./routes.mjs";

import db from './db.mjs';


const app = express();
app.use(express.json());
app.use("/api", router);


const server = http.createServer(app);

const io = new Server(server, { // Pass "server" here!
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  },
  connectionStateRecovery: {}
});

io.on('connection', async (socket) => {
  let curRoom = ""
  console.log('Socket connected:', socket.id);

  socket.on('join room', (roomID, callback) => {
    if (!socket.rooms.has(roomID)) {
        console.log(`Socket ${socket.id} is joining room: ${roomID}`);
        socket.join(roomID);
        curRoom = roomID
        callback()
        restoreChat (db, socket, curRoom)
      }
   });
  
  
  socket.on('chat message', async (msg, roomID, authorID, clientOffset, callback) => {
    let result;
    console.log ("mes from", socket.id, "to",  ":", msg)
    try {
      result = await db.run(
        `INSERT INTO messages (content, roomID, authorID, clientOffset ) 
        VALUES (?,?,?,?)`, msg, roomID, authorID, clientOffset )
    } catch (e) {
      if (e.errno === 19 /* SQLITE_CONSTRAINT */ ) {
        // Duplicate message detected (based on client_offset), notify client
        callback();
      } else {
        // Any other error (e.g., database issues), let the client retry
        console.error('Database error:', e);
        callback(e);
      }
      return;
    }
    
    io.to(roomName).emit('foo', msg, result.lastID);
    callback();
  });

  if (!socket.recovered) {
    // if the connection state recovery was not successful
    
  }

  async function restoreChat (db, socket, curRoom) {
    try {
      await db.each('SELECT id, content FROM messages WHERE id > ?',
        [socket.handshake.auth.serverOffset || 0],
        (_err, row) => {
          socket.emit('chat message', row.content, row.id);
        }
      )
    } catch (e) {
      // something went wrong
    }
  }


  // socket.on('disconnect', () => {
  //   console.log('user disconnected');
  // });
});



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const portn = 3000  
server.listen(portn, () => {
  console.log('listening on *:'+portn);
});
