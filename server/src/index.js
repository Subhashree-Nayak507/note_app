import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors"; 
import { db } from './db/db.js';
import authRouter from './routes/auth.routes.js';
import noteRouter from './routes/note.routes.js';
import path from 'path';

const port = process.env.PORT || 4000;
const app = express();

dotenv.config();

const __dirname = path.resolve();

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

//middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended:true}));
app.use(cookieParser());

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/note',noteRouter);


if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/client/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
	});
}

app.listen(port, () => {
    db();
    console.log(`Server running at http://localhost:${port}`);
});