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

        // async function proccessMsg (data, callback) {
        //     let result;
        //     console.log ("mes from", data.authorID, "to", data.roomID, ":", data.msg)
        //     try {
        //         result = await db.run(
        //             `INSERT INTO messages (content, roomID, authorID, clientOffset, timestamp, messagetype  ) 
        //             VALUES (?,?,?,?,?, ?)`, data.msg, data.roomID, data.authorID, data.clientOffset, data.timestamp, data.type )
        //     } catch (e) {
        //         if (e.errno === 19 /* SQLITE_CONSTRAINT */ ) {
        //             // Duplicate message detected (based on client_offset), notify client
        //             callback();
        //         } else {
        //             // Any other error (e.g., database issues), let the client retry
        //             console.error('Database error:', e);
        //             callback(e);
        //         }
        //         return;
        //     }

        //     sendNotification(
        //         data.msg, data.authorID, data.authorName, data.roomID, data.timestamp, result.lastID
        //     )
            
        //     // io.to(data.roomID).emit('foo', data.msg, data.authorID, data.authorName, data.roomID, data.timestamp, data.type, result.lastID);
        //     io.to(data.roomID).emit('foo', {
        //         msg: data.msg, 
        //         authorID: data.authorID, 
        //         authorName: data.authorName, 
        //         roomID: data.roomID,
        //         timestamp: data.timestamp, 
        //         type: data.type, 
        //         lastID: result.lastID
        //     });
        //     callback();
        // }

        async function proccessMsg(data, callback) {
            // Step 1: Basic validation
            if (!data.msg || !data.roomID || !data.authorID || !data.timestamp || !data.type) {
              console.warn("Incomplete message received:", data);
              callback("Invalid message data");
              return;
            }
          
            console.log("msg from", data.authorID, "to", data.roomID, ":", data.msg);
          
            try {
              let result;
          
              // Step 2: Prepare fileData JSON if type is "file"
              const fileDataJson = data.type === 'file' && data.file
                ? JSON.stringify({
                    name: data.file.name,
                    type: data.file.type,
                    size: data.file.size,
                    url: data.file.url
                  })
                : null;
          
              // Step 3: Insert into SQLite
              result = await db.run(
                `INSERT INTO messages 
                   (content, roomID, authorID, clientOffset, timestamp, messagetype, fileData) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                  data.msg,
                  data.roomID,
                  data.authorID,
                  data.clientOffset,
                  data.timestamp,
                  data.type,
                  fileDataJson
                ]
              );
          
              // Step 4: Optional notification logic
              sendNotification(
                data.msg,
                data.authorID,
                data.authorName,
                data.roomID,
                data.timestamp,
                result.lastID
              );
          
              // Step 5: Emit to clients
              io.to(data.roomID).emit('foo', {
                msg: data.msg,
                authorID: data.authorID,
                authorName: data.authorName,
                roomID: data.roomID,
                timestamp: data.timestamp,
                type: data.type,
                lastID: result.lastID,
                file: data.file ?? null // frontend can use this directly
              });
          
              callback();
            } catch (e) {
              if (e.errno === 19 /* SQLITE_CONSTRAINT */) {
                callback(); // Duplicate message (clientOffset constraint)
              } else {
                console.error('Database error:', e);
                callback(e); // Retryable error
              }
            }
          }
          async function proccessMsg(data, callback) {
            // Step 1: Basic validation
            if (!data.msg || !data.roomID || !data.authorID || !data.timestamp || !data.type) {
              console.warn("Incomplete message received:", data);
              callback("Invalid message data");
              return;
            }
          
            console.log("msg from", data.authorID, "to", data.roomID, ":", data.msg);
          
            try {
              let result;
          
              // Step 2: Prepare fileData JSON if type is "file"
              const fileDataJson = data.type === 'file' && data.file
                ? JSON.stringify({
                    name: data.file.name,
                    type: data.file.type,
                    size: data.file.size,
                    url: data.file.url
                  })
                : null;
          
              // Step 3: Insert into SQLite
              result = await db.run(
                `INSERT INTO messages 
                   (content, roomID, authorID, clientOffset, timestamp, messagetype, fileData) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                  data.msg,
                  data.roomID,
                  data.authorID,
                  data.clientOffset,
                  data.timestamp,
                  data.type,
                  fileDataJson
                ]
              );

              await db.run(
                `UPDATE rooms SET last_message_time = ? WHERE id = ?`,
                [data.timestamp, data.roomID]
              );
          
              // Step 4: Optional notification logic
              sendNotification(
                data.msg,
                data.authorID,
                data.authorName,
                data.roomID,
                data.timestamp,
                result.lastID
              );
          
              // Step 5: Emit to clients
              io.to(data.roomID).emit('foo', {
                msg: data.msg,
                authorID: data.authorID,
                authorName: data.authorName,
                roomID: data.roomID,
                timestamp: data.timestamp,
                type: data.type,
                id: result.lastID,
                file: data.file ?? null,
                isRead: false,
                isEdited: false
                // frontend can use this directly
              });
          
              callback();
            } catch (e) {
              if (e.errno === 19 /* SQLITE_CONSTRAINT */) {
                callback(); // Duplicate message (clientOffset constraint)
              } else {
                console.error('Database error:', e);
                callback(e); // Retryable error
              }
            }
          }
                    

        socket.on('chat message', async (data, callback) => {
            await proccessMsg (data, callback)
        });
        socket.on('image message',async (data, callback) => {
            await proccessMsg (data, callback)
        });

        socket.on('delete message', async (data, callback) => {
          const { messageID } = data;
          console.log("delete-message request:", messageID);
        
          try {
            const result = await db.run(
              `UPDATE messages
               SET messagetype = ?, content = ?, fileData = null
               WHERE id = ?`,
              ["deleted", "Сообщение удалено", messageID]
            );
        
            if (result.changes === 0) {
              console.warn("No message found with ID:", messageID);
              return callback({ error: "Message not found" });
            }
        
            // Notify all clients in the room about the deletion
            const updated = await db.get(`SELECT * FROM messages WHERE id = ?`, [messageID]);
        
            io.to(updated.roomID).emit("message updated", {
              id: updated.id,
              roomID: updated.roomID,
              authorID: updated.authorID,
              timestamp: updated.timestamp,
              type: "deleted",
              msg: updated.content,
            });
        
            callback({ success: true });
          } catch (err) {
            console.error("Error deleting message:", err);
            callback({ error: "Internal server error" });
          }
        })

        socket.on('edit message', async (data, callback) => {
          const { msg, messageID, timestamp } = data;

          try {
            // Update the message content and mark as edited
            const result = await db.run(
              `UPDATE messages
               SET content = ?, isEdited = 1, editTime = ?
               WHERE id = ?`,
              [msg, timestamp, messageID]
            );
        
            if (result.changes === 0) {
              console.warn("No message found with ID:", messageID);
              return callback({ error: "Message not found" });
            }
        
            // Fetch the updated message for broadcasting
            const updated = await db.get(`SELECT * FROM messages WHERE id = ?`, [messageID]);
        
            // Send update to all clients in the room
            io.to(updated.roomID).emit("message updated", {
              id: updated.id,
              msg: updated.content,
              isEdited: 1,
              editTime: updated.editTime
            });
        
            callback({ success: true });
        
          } catch (err) {
            console.error("Error editing message:", err);
            callback({ error: "Internal server error" });
          }
        })

        socket.on('read messages', async (data, callback) => {
          // inside your setupSocket(server, db) function...
        
          const { messageIDs } = data;
          if (!Array.isArray(messageIDs) || messageIDs.length === 0) {
            return callback?.({ error: "No messageIDs provided" });
          }

          try {
            // 1. Mark all as read
            const placeholders = messageIDs.map(() => "?").join(",");
            await db.run(
              `UPDATE messages
              SET isRead = 1
              WHERE id IN (${placeholders})`,
              messageIDs
            );

            // 2. Find which rooms these messages belong to
            const rooms = await db.all(
              `SELECT DISTINCT roomID FROM messages
              WHERE id IN (${placeholders})`,
              messageIDs
            );

            // 3. Broadcast "messages-read" to each affected room
            for (const { roomID } of rooms) {
              io.to(roomID).emit("messages read", { messageIDs });
            }

            callback?.({ success: true });
          } catch (err) {
            console.error("Error in read messages handler:", err);
            callback?.({ error: "Internal server error" });
          }

        })



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
        
        async function restoreChat(db, socket, curRoom) {
            try {
              await db.each(
                `
                SELECT messages.*, 
                       users.first_name || ' ' || users.last_name AS author_name, 
                       rooms.name AS room_name
                FROM messages
                JOIN users ON messages.authorID = users.id
                JOIN rooms ON messages.roomID = rooms.id
                WHERE messages.id > ? AND messages.roomID = ?
                ORDER BY messages.timestamp ASC
                `,
                [socket.handshake.auth.serverOffset || 0, curRoom],
                (_err, row) => {
                  if (_err) {
                    console.error('Error fetching messages:', _err);
                    return;
                  }
          
                  // Parse fileData JSON if exists
                  let fileObj = null;
                  if (row.fileData) {
                    try {
                      fileObj = JSON.parse(row.fileData);
                    } catch (parseErr) {
                      console.warn('Failed to parse fileData JSON:', parseErr);
                    }
                  }
          
                  socket.emit('foo', {
                    msg: row.content,
                    authorID: row.authorID,
                    authorName: row.author_name,
                    roomID: row.roomID,
                    timestamp: row.timestamp,
                    type: row.messagetype,
                    id: row.id,
                    file: fileObj,
                    isEdited: row.isEdited, 
                    isRead: row.isRead
                  });
                }
              );
            } catch (e) {
              console.error('restoreChat error:', e);
            }
          }
          

    // socket.on('disconnect', () => {
    //   console.log('user disconnected');
    // });
    });
}