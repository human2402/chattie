CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clientOffset TEXT UNIQUE,
    content BLOB,
    roomID INTEGER,
    authorID INTEGER,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (authorID) REFERENCES users(id),
    FOREIGN KEY (roomID) REFERENCES rooms(id)
);`