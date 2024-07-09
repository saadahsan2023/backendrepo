import auth from "./routes/auth.js";
import notes from "./routes/notes.js";
import cors from 'cors'
connectToMongo();
const app = express();
const port = 4000;
import connectToMongo from "./database/db.js";
import express from "express";


// middlewere
app.use(express.json());
app.use(cors())


// routes 
app.use("/api/auth", auth);
app.use("/api/notes", notes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

