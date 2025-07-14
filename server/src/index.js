import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import { db } from './db/db.js';
import authRouter from './routes/auth.routes.js';
import noteRouter from './routes/note.routes.js';

const port = process.env.PORT || 4000;
const app = express();

dotenv.config();

//middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended:true}));
app.use(cookieParser());

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/note',noteRouter);

app.listen(port, () => {
    db();
    console.log(`Server running at http://localhost:${port}`);
});