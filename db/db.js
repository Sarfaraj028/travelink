import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const mongoURI = process.env.mongoURI

const connection = mongoose.connect(mongoURI)
.then(()=>{
    console.log("Database connected successfully");
})
.catch((err)=>{
    console.error("failed connection : ",err);
    
})

export default connection