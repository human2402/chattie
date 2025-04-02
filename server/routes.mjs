import express from "express";
import * as models from './models.mjs'
// import { getUsers, addUser } from "./models.mjs";

export const router = express.Router();

router.get("/users", async (req, res) => {
    res.json(await models.getUsers());
});

router.post("/users", async (req, res) => {
    const { 
        first_name,
        middle_name,
        last_name,
        login,
        password,
        position
    } = req.body;
    
    if (!first_name || !last_name ||!login ||!password ||!position) return res.status(400).json({ error: "first_name, last_name, login, password, position are required" });
    
    await models.addUser(
        first_name,
        middle_name,
        last_name,
        login,
        password,
        position
    );
    res.status(201).json({ message: "User added" });
});