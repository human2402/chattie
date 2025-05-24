import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database
});

await db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS "users" (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        middle_name TEXT,
        last_name TEXT NOT NULL,
        login TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        position TEXT,
        department TEXT,
        is_admin INT DEFAULT 0,
        publicKey TEXT
    )

    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        clientOffset TEXT UNIQUE,
        content TEXT,
        roomID INTEGER,
        authorID INTEGER,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (authorID) REFERENCES users(id),
        FOREIGN KEY (roomID) REFERENCES rooms(id)
    );

    CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_by INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        is_private INTEGER DEFAULT 0,
        amount_of_participants INTEGER DEFAULT 1,

        FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS room_members (
        room_id INTEGER,
        user_id INTEGER,
        PRIMARY KEY (room_id, user_id),
        FOREIGN KEY (room_id) REFERENCES rooms(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

`);

export default db;
