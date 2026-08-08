import express from "express";
import { initDb } from "./db/database.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, async () => {
    await initDb();
    console.log(`Server is running on port ${PORT}`);
});
