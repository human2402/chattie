import { db } from "./db.mjs";

export async function getUsers() {
    return await db.all("SELECT * FROM users");
}

export async function addUser(first_name, middle_name, last_name, login, password, position) {
    return await db.run("INSERT INTO users (first_name, middle_name, last_name, login, password, position) VALUES (?,?,?,?,?,?)", [first_name, middle_name, last_name, login, password, position]);
}