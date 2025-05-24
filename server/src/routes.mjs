import express from "express";
import * as models from './models.mjs'
import { authenticate } from "./middlewears.mjs";
// import { getUsers, addUser } from "./models.mjs";

export const router = express.Router();

//
// should really remove that
//
router.get("/users/:id", authenticate,  async (req, res) => {
    const userID = req.params.id
    res.json(await models.getUsers(userID));
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

router.post("/users/:id/public-key", authenticate, async (req,res) => {
    const userID = req.params.id
    const { publicKey } = req.body;
    // console.log (req.userFromJWT, userID)
    if (userID == req.userFromJWT.id) {
        try {
            const update = await models.updatePublicKey (userID, publicKey)

            res.json(update)
        } catch (e) {
            // not cool to send the error to the client but it will do for now
            res.status(401).json({ error: e.message });
        }
    } else {
        return res.status(403).json({ error: "Access forbidden" });
    }
})

router.get("/users/:id/public-key", authenticate, async (req,res) => {
    const userID = req.params.id
    // console.log (req.userFromJWT, userID)

    try {
        const update = await models.getPublicKey (userID)
        res.json(update)
    } catch (e) {
        // not cool to send the error to the client but it will do for now
        res.status(401).json({ error: e.message });
    }
})

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

router.get("/users/rooms/:id", authenticate, async (req,res) => {
    const userID = req.params.id
    // console.log (req.userFromJWT, userID)
    if (userID == req.userFromJWT.id) {
        try {
            const rooms = await models.getRoomsByUserID (userID)
            // console.log(rooms)
            res.json(rooms)
        } catch (e) {
            // not cool to send the error to the client but it will do for now
            res.status(401).json({ error: error.message });
        }
    } else {
        return res.status(403).json({ error: "Access to rooms forbidden" });
    }
})



// router.get("/users/rooms/:id", authenticate, async (req,res) => {


// })

router.post("/rooms", async (req, res) => {
    try{
        const {participants, name, created_by,created_at, is_private}= req.body;
        let result = await models.createOrGetChatRoom(participants, name, created_by,created_at, is_private)
        res.json(result)
    } catch(e) {
        res.status(401).json({ error: e.message });
    }
    
})
