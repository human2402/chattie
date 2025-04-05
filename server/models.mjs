import { db } from "./db.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config"; 

const JWT_SECRET = process.env.JWT_SECRET;


export async function getUsers() {
    return await db.all("SELECT * FROM users");
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