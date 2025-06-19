import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
dotenv.config();
app.use(cors());
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGOURL)
.then(()=>{
    app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
}).catch((error=>console.log(error)));



