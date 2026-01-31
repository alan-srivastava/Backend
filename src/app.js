import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app= express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(express.json({limit:'16kb'})); //to parse JSON data
app.use(express.urlencoded({extended:true, limit: "16kb"})); //to parse URL-encoded data
app.use(express.static("public")); //serve static files from the "public" directory
app.use(cookieParser()); //to parse cookies


//routes import
import userRouter from './routes/user.routes.js';

//routes declaration
app.use("/api/v1/users", userRouter);  //link of this wiill be generated link: http://localhost:PORT/api/v1/users/register
export { app }
//middlewares is a function that has access to req,res and next (when req coming from browser before going to compute operations middleware check if person is authorised or not and then allow to go next)