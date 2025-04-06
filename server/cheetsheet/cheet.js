import express from 'express';
import { createServer } from 'node:http';

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { Server } from 'socket.io';

// import { availableParallelism } from 'node:os';
// import cluster from 'node:cluster';
// import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';


const app = express();
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
});


import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// open the database file
const db = await open({
  filename: 'chat.db',
  driver: sqlite3.Database
});

// create our 'messages' table (you can ignore the 'client_offset' column for now)
await db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_offset TEXT UNIQUE,
      content TEXT,
      roomName TEXT
  );
`);

const __dirname = dirname(fileURLToPath(import.meta.url));


app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'cheet.html'));
});

io.on('connection', async (socket) => {
    let curRoom = ""

    console.log('Socket connected:', socket.id);
    
    socket.on('join room', (roomName, callback) => {
        if (!socket.rooms.has(roomName)) {
            console.log(`Socket ${socket.id} is joining room: ${roomName}`);
            socket.join(roomName);
            curRoom = roomName
            callback()
            restoreChat (db, socket, curRoom)
        }
    });

    socket.on('chat message', async (msg, roomName, clientOffset, callback) => {
        let result;
        console.log ("mes from", socket.id, "to", roomName, ":", msg)
        try {
            // store the message in the database
            result = await db.run('INSERT INTO messages (content, client_offset, roomName) VALUES (?, ?,?)', msg, clientOffset, roomName);
        } catch (e) {
            if (e.errno === 19 /* SQLITE_CONSTRAINT */ ) {
                // the message was already inserted, so we notify the client
                callback();
            } else {
                // nothing to do, just let the client retry
            }
            return;
        }
        // include the offset with the message
        curRoom = roomName
        io.to(roomName).emit('chat message', `${socket.id}: ${msg}`, roomName, result.lastID);
        // acknowledge the event
        callback();
    });

    if (!socket.recovered) { 
        restoreChat (db, socket, curRoom)
    }

    async function restoreChat (db, socket, curRoom) {
        try {
            await db.each('SELECT id, roomName, content FROM messages WHERE id > ? AND roomName == ?',
              [socket.handshake.auth.serverOffset || 0, curRoom],
              (_err, row) => {
                socket.emit('chat message', row.content, row.roomName, row.id);
              }
            )
          } catch (e) {
            console.error(e)
          }
    }

    // socket.on('disconnect', () => {
    //   console.log('user disconnected');
    // });
});







server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});