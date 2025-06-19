import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { register } from './controllers/auth.js';
import authRouter from "./routes/auth.js"

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
app.post('/api/register',register);
app.use('/api', authRouter);
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGOURL)
.then(()=>{
    app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
}).catch((error=>console.log(error)));



