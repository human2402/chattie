import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database
});

await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        middle_name TEXT,
        last_name TEXT NOT NULL,
        login TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        position TEXT,
        department TEXT,
        is_admin INT DEFAULT 0
    );
`);
