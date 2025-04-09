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
        restoreChat (db, socket, curRoom)
        }
        callback()
   });
  
  
  socket.on('chat message', async (msg, roomID, authorID, authorName, timestamp, clientOffset, callback) => {
    let result;
    console.log ("mes from", authorID, "to", roomID, ":", msg)
    try {
      result = await db.run(
        `INSERT INTO messages (content, roomID, authorID, clientOffset, timestamp ) 
        VALUES (?,?,?,?,?)`, msg, roomID, authorID, clientOffset, timestamp )
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
    
    io.to(roomID).emit('foo', msg, authorID, authorName, roomID, timestamp, result.lastID);
    callback();
  });

  if (!socket.recovered) {
    // if the connection state recovery was not successful
    restoreChat (db, socket, curRoom)
  }

  async function restoreChat (db, socket, curRoom) {
    try {
      // await db.each('SELECT id, content FROM messages WHERE id > ? AND roomID == ?',
      await db.each(`
          SELECT messages.*, 
            users.first_name || ' ' || users.last_name AS author_name, 
            rooms.name AS room_name
          FROM messages
          JOIN users ON messages.authorID = users.id
          JOIN rooms ON messages.roomID = rooms.id
          WHERE messages.id > ? AND messages.roomID = ? 
          `,
          // ORDER BY messages.timestamp ASC;
        [socket.handshake.auth.serverOffset || 0, curRoom],
        (_err, row) => {
          // console.log(row)
          
          socket.emit('foo', row.content, row.authorID, row.author_name, row.roomID, row.timestamp, row.id);
        }
        // {

        //   id: 26,
        //   clientOffset: 'SPBdBi8daY0MaET-AAAo-0',
        //   content: 'Дмитрий@1: hello',
        //   roomID: 1,
        //   authorID: 1,
        //   timestamp: '2025-04-08 11:07:50',
        //   author_name: 'Дмитрий Малежик',
        //   room_name: 'Friends'
        // }

      )
    } catch (e) {
      console.log(e)
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
