import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB=async()=>{
    try{
     const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n DB connected successfully: DB Host: ${connectionInstance.connection.host} \n`);
    }catch(err){
        console.log("Error in DB connection",err);
        process.exit(1);
    }
}

export default connectDB;