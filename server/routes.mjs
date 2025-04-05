import express from "express";
import * as models from './models.mjs'
import { authenticate } from "./middlewears.mjs";
// import { getUsers, addUser } from "./models.mjs";

export const router = express.Router();

//
// should really remove that
//
router.get("/users", authenticate,  async (req, res) => {
    res.json(await models.getUsers());
});

router.post("/users", authenticate, async (req, res) => {
    const { 
        first_name,
        middle_name,
        last_name,
        login,
        password,
        position,
        department,
        is_admin
    } = req.body;
    
    if (!first_name || !last_name ||!login ||!password ||!position) return res.status(400).json({ error: "first_name, last_name, login, password, position are required" });
    
    try {
        await models.addUser(
            first_name,
            middle_name,
            last_name,
            login,
            password,
            position,
            department,
            is_admin
        );
        res.status(201).json({ message: "User added" });
    } catch (error) {
        // not cool to send the error to the client but it will do for now
        res.status(401).json({ error: error.message });
    }
});

router.post("/login", async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ error: "Login and password are required" });
    }

    try {
        const result = await models.signInUser(login, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});