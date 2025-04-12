import { db } from "./db.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config"; 

const JWT_SECRET = process.env.JWT_SECRET;


export async function getUsers(curID) {
    return await db.all(`
        SELECT 
            id ,
            first_name ,
            middle_name ,
            last_name ,
            position,
            department
        FROM users
        WHERE id != ?
    `, [curID]);
}

export async function addUser(first_name, middle_name, last_name, login, password, department, position, is_admin) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await db.run("INSERT INTO users (first_name, middle_name, last_name, login, password, position, department, is_admin) VALUES (?,?,?,?,?,?,?,?)", [first_name, middle_name, last_name, login, hashedPassword, position, department, is_admin]);
}

export async function signInUser(login, password) {
    const user = await db.get("SELECT * FROM users WHERE login = ?", [login]);
    if (!user) throw new Error("User not found");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid password");
    // Generate JWT token
    const token = jwt.sign(
        { id: user.id, login: user.login, position: user.position },
        JWT_SECRET,
        { expiresIn: "1d" }
    );

    return { 
        user: { 
            id: user.id,
            login: user.login,
            firstName: user.first_name,
            lastName: user.last_name,
            middleName: user.middle_name,
            position: user.position,
            department: user.department
        }, 
        token 
    };
}

export async function getRoomsByUserID(userID) { 
    return await db.all (`
            SELECT 
                rooms.*,                  
                rooms.is_private,          
                CASE 
                    -- If it's a private chat with 2 users:
                    WHEN rooms.is_private = 1 AND rooms.amount_of_participants = 2 THEN (
                    SELECT u.first_name || ' ' || u.last_name  
                    FROM users u
                    JOIN room_members rm ON u.id = rm.user_id  
                    WHERE rm.room_id = rooms.id AND u.id != ?  -- not the current user
                    LIMIT 1  
                    )
                    -- Otherwise, just use the room's name
                    ELSE rooms.name  
                END AS display_name,  

                rooms.description,     
                rooms.created_at       

            FROM rooms
            JOIN room_members ON rooms.id = room_members.room_id  
            WHERE room_members.user_id = ?;  -- <- your user ID here
    `, userID, userID)
    // return await db.all (`
    //         // SELECT rooms.*
    //         // FROM rooms
    //         // JOIN room_members ON rooms.id = room_members.room_id
    //         // WHERE room_members.user_id = ?;
    // `, userID)
}

export async function createOrGetChatRoom(participants, name, createdBy,createdAt, isPrivate, ) {
    const participantCount = participants.length;
  
    if (isPrivate) {
      const placeholders = participants.map(() => '?').join(', ');
      const existingRoom = await db.get(
        // `
        // SELECT r.id
        // FROM rooms r
        // JOIN room_members rm ON rm.room_id = r.id
        // WHERE r.is_private = 1
        //   AND rm.user_id IN (${placeholders})
        // GROUP BY r.id
        // HAVING COUNT(*) = ?
        //    AND r.amount_of_participants = ?
        // `
        `
            SELECT r.id, r.*
            FROM rooms r
            JOIN room_members rm ON rm.room_id = r.id
            WHERE r.is_private = 1
            GROUP BY r.id
            HAVING COUNT(CASE WHEN rm.user_id IN (${placeholders}) THEN 1 END) = ?
            AND COUNT(*) = ?
        `,
        ...participants,
        participantCount,
        participantCount
    );
    console.log(existingRoom)
  
      if (existingRoom) {
        return {
            roomData:existingRoom,
            alreadyExists: true
        };
      }
    }
  
    // No existing private room found or it's public — create a new one
    const result = await db.run(
      `
      INSERT INTO rooms (name, created_by, created_at, is_private, amount_of_participants)
      VALUES (?, ?, ?, ?, ?)
      `,
      name,
      createdBy,
      createdAt,
      isPrivate ? 1 : 0,
      participantCount
    );
  
    const roomId = result.lastID;
  
    // Insert all participants into room_members
    const insertValues = participants.map(userId => `(${roomId}, ${userId})`).join(', ');
    await db.run(`INSERT INTO room_members (room_id, user_id) VALUES ${insertValues}`);
  
    return {
        id:roomId,
        alreadyExists: false
    };
  }