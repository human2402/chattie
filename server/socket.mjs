import {Server} from "socket.io";

export function setupSocket (server, db) {
    const io = new Server(server, { // Pass "server" here!
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        },
        connectionStateRecovery: {}
    });
    
    //
    // maps work
    //

    const connectedUsers = new Map();
    
    // Node/Express startup or when a room is first used:
    const roomMembers = new Map(); // roomID → Set<userID>
    async function loadRoomMembers(roomID) {
        // Query DB once:
        const rows = await db.all('SELECT user_id FROM room_members WHERE room_id = ?', roomID);
        roomMembers.set(roomID, new Set(rows.map(r => r.user_id)));
    }

    //
    // io work
    //
    io.on('connection', async (socket) => {
        let curRoom = ""
        let userID_friendly = 0

        console.log('Socket', socket.id);


        socket.on("authenticate", ({ userID }) => {
            console.log("Socket", socket.id, "authenticated", userID );
            connectedUsers.set(Number(userID), socket.id);
            userID_friendly = userID
        });

        // socket.on('join room', async (roomID, doNeedToRefire, callback) => {
        //     if (!socket.rooms.has(roomID)) {
        //         console.log(`Socket ${socket.id} is joining room: ${roomID}`);
        //         //  Let the socket join the Socket.IO room
        //         socket.join(roomID);
        //         curRoom = roomID
        //         if (doNeedToRefire) {
        //             restoreChat (db, socket, curRoom)
        //         }
        //         // If you haven’t loaded members yet, do so:
        //         if (!roomMembers.has(roomID)) {
        //             await loadRoomMembers(roomID);
        //         }
        //         console.log (roomMembers.get(roomID))
        //         // Add this user to the in‐memory set (or re‐query the DB if you prefer)
        //         //roomMembers.get(roomID).add(socket.handshake.auth.userID);
        //     }
        //     callback()
        // });
        
        socket.on("join room", async (roomID, doNeedToRefire = true, callback) => {
            try {
              if (!socket.rooms.has(roomID)) {
                socket.join(roomID);
                if (doNeedToRefire) {
                  await restoreChat(db, socket, roomID);
                }
                if (!roomMembers.has(roomID)) {
                  await loadRoomMembers(roomID);
                }
              }
            } catch (err) {
              // If something goes wrong, send the error back:
              if (typeof callback === "function") {
                return callback();
              }
            }
        
            // SUCCESS: invoke callback() with no arguments
            if (typeof callback === "function") {
                return callback();
              }
          });

        async function proccessMsg (data, callback) {
            let result;
            console.log ("mes from", data.authorID, "to", data.roomID, ":", data.msg)
            try {
                result = await db.run(
                    `INSERT INTO messages (content, roomID, authorID, clientOffset, timestamp, messagetype  ) 
                    VALUES (?,?,?,?,?, ?)`, data.msg, data.roomID, data.authorID, data.clientOffset, data.timestamp, data.type )
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

            sendNotification(
                data.msg, data.authorID, data.authorName, data.roomID, data.timestamp, result.lastID
            )
            
            // io.to(data.roomID).emit('foo', data.msg, data.authorID, data.authorName, data.roomID, data.timestamp, data.type, result.lastID);
            io.to(data.roomID).emit('foo', {
                msg: data.msg, 
                authorID: data.authorID, 
                authorName: data.authorName, 
                roomID: data.roomID,
                timestamp: data.timestamp, 
                type: data.type, 
                lastID: result.lastID
            });
            callback();
        }

        socket.on('chat message', async (data, callback) => {
            await proccessMsg (data, callback)
        });
        socket.on('image message',async (data, callback) => {
            await proccessMsg (data, callback)
        });



        if (!socket.recovered) {
            // if the connection state recovery was not successful
            restoreChat (db, socket, curRoom)
        }

        function sendNotification (msg, authorID, authorName, roomID, timestamp, lastID){
            //            gotta check all the participants of chat id bruh cringe myaw 

            // Look up the current participants from memory
            const participants = roomMembers.get(roomID) || new Set();

            // 3) Emit notifications to each participant except the sender:
            for (const userID of participants) {
                console.log ("userID", userID)
                if (userID === authorID) continue; // don’t notify the sender
                console.log("connectedUsers", connectedUsers)
                const socketIDs = connectedUsers.get(Number(userID)); // your existing userID → [socketIDs] map
                console.log ("socketIDs", socketIDs)
                if (!socketIDs) continue;
                
                    console.log()
                    io.to(socketIDs).emit('notification', {
                        roomID,
                        authorID,
                        authorName,
                        msg,
                        timestamp,
                        messageID: lastID
                    });
                
            }
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
                
                socket.emit('foo', {
                    msg: row.content, 
                    authorID: row.authorID, 
                    authorName: row.author_name, 
                    roomID: row.roomID, 
                    timestamp: row.timestamp, 
                    type: row.messagetype , 
                    id: row.id
                    });
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
}