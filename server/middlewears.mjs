import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;

export function logger(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
}

export function authenticate(req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.manager = decoded; // Attach manager data to the request
        // console.log('Authentication passed');
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
}