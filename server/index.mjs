import express from 'express';
import http from 'http';
import db from './db.mjs';
import { router } from "./routes.mjs";
import { setupSocket } from './socket.mjs';
import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


const app = express();
app.use(express.json());
app.use("/api", router);
app.use('/uploads', express.static('uploads'));

const server = http.createServer(app);

//socket.mjs logic
setupSocket(server, db);

app.post('/api/upload-image', upload.single('image'), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ success: false });

  const fileUrl = `/uploads/${file.filename}`;
  res.json({ success: true, url: fileUrl });
});

const portn = 3000  
server.listen(portn, () => {
  console.log('listening on *:'+portn);
});
