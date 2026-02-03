// import { ApiError } from "../utils/ApiError.js";
// import {asyncHandler} from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";
// export const verifyJWT= asyncHandler(async (req, _, next) => {
//     //get token from headers
//     try {
//         const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") // This whole line means we are checking if the token is present in cookies or in headers for example in postman we send token in headers
//         if(!token){
//             throw new ApiError(401, "Unauthorized: No token provided");
//         }
//         const decodedToken=jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         const user=await User.findById(decodedToken._Id).select("-password -refreshToken"); //this line means we are finding the user by id and selecting all fields except password and refreshToken
//         if(!user){
//             throw new ApiError(401, "Unauthorized: Invalid token");
//         }
//         req.user=user; // attach user to request object
//         next();
//     } catch (error) {
//         throw new ApiError(401, error?.message || "Unauthorized: Invalid token");
//     }
// });


import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})