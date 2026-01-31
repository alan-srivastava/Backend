import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';      

const registerUser=asyncHandler(async(req,res)=>{
     //get user details from frontend
     //validation -- not empty fields, valid email, password strength
     //check if user already exists: username, email
     //check for images, check for avtar
     //upload image to cloudinary, avtar
     //create user object-- create entry in db
     //remove password and refreh token field from response
     //check fro user creation
     //return res
     

     const {fullName, email, username, password}=req.body
     console.log("email: ", email);
  
     //validation
     if(
        [fullName, email, username, password].some(field => field?.trim() === "") //this line means if any field is empty after trimming whitespace it will return true
     ){
        throw new ApiError(400,"All fields are required");
     }

     const existedUser = await User.findOne({
        $or:[{username}, {email}]
     })

     if(existedUser){
        throw new ApiError(409,"User with given username or email already exists"); //ApiError file which we have created in utils folder it's useful here to send custom error message and status code
     }

   const avtarLocalPath = req.files?.avtar[0]?.path; //this line means if req.files exists and has avtar array with at least one element then get the path of the first element otherwise undefined
   const coverImageLocalPath = req.files?.coverImage[0]?.path;  //this line means if req.files exists and has coverImage array with at least one element then get the path of the first element otherwise undefined
    
   if(!avtarLocalPath){
        throw new ApiError(400,"Avtar is required");
    }
    
    const avtar = await uploadOnCloudinary(avtarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avtar){
        throw new ApiError(400,"Avtar file is required");
    }
      
    const user = await User.create({
        fullName,
        avtar: avtar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
   const createdUser = await User.findById(user._id).select( //this line means we are finding the user by id and selecting all fields except password and refreshToken
        "-password -refreshToken"); //this line is used to exclude password and refreshToken fields from the user object before sending it in the response
      
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user");
    }
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered Successfully")
    );
});
export {registerUser};  // Exporting the registerUser function for use in other parts of the application

//In app.js we defined a route for user registration using userRouter which is imported from
// user.routes.js. In user.routes.js, we defined a POST route "/register" that 
// calls the registerUser function from user.controller.js when a request is made 
// to that route. The registerUser function is wrapped with asyncHandler to handle
// any asynchronous errors properly.