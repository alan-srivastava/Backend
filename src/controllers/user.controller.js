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
     //console.log("email: ", email);
  
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
     console.log(req.files); //print the files uploaded

   const avatarLocalPath = req.files?.avatar[0]?.path; //this line means if req.files exists and has avatar array with at least one element then get the path of the first element otherwise undefined
   //const coverImageLocalPath = req.files?.coverImage[0]?.path;  //this line means if req.files exists and has coverImage array with at least one element then get the path of the first element otherwise undefined
    

   let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){ //this line means if req.files exists and has coverImage array with at least one element then get the path of the first element
        coverImageLocalPath = req.files.coverImage[0].path;
   }
   if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required");
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar file is required");
    }
      
    const user = await User.create({
        fullName,
        avatar: avatar.url,
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



//Okay so basically in this file let me explain you step by step what is happening:
//1. We are importing necessary modules and functions like asyncHandler, ApiError, User model, uploadOnCloudinary function and ApiResponse class.
//2. We define an asynchronous function registerUser which is wrapped with asyncHandler to handle errors properly.
//3. Inside the function, we extract user details from the request body.
//4. We perform validation to check if any required field is empty.
//5. We check if a user with the given username or email already exists in the database.
//6. We log the uploaded files to the console for debugging purposes.
//7. We get the local file paths of the uploaded avatar and cover image.
//8. We check if the avatar is provided, if not we throw an error.
//9. We upload the avatar and cover image to Cloudinary using the uploadOnCloudinary function.
//10. We create a new user in the database with the provided details and the URLs of the uploaded images.
//11. We retrieve the created user from the database excluding the password and refreshToken fields.
//12. We check if the user was created successfully, if not we throw an error.
//13. Finally, we send a success response with the created user details using the ApiResponse class.
//14. We export the registerUser function for use in other parts of the application.
// This function is typically called when a user tries to register on the platform.
