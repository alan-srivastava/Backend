import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';   
import jwt from 'jsonwebtoken';   

const generateAccessAndRefreshTokens= async(userId)=>{ //This whole function line by line means we are generating access and refresh tokens for the user
    try {
        const user = await User.findById(userId);
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();

        user.refreshToken= refreshToken;
        await user.save({validateBeforeSave: false}); // we are not validating before saving because we are only updating the refresh token field
        return {accessToken, refreshToken};

    } catch (error) {
        throw new ApiError(500,"Error generating tokens");
        
    }
};

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


const loginUser= asyncHandler(async (req, res) => {
    //req body -> data from frontend
    //username or email
    //find the user
    //compare password
    //access and refresh token
    //send cookies and response
    const {username, email, password}= req.body;
    console.log(email);
        if(!username && !email){
            throw new ApiError(400, "username or email is required");
        }

        const user=await User.findOne({  //here we are finding the user by username or email
            $or: [{username}, {email}],
        })
        if(!user){
            throw new ApiError (404, "User not found");
        }
        const isPasswordValid= await user.isPasswordCorrect(password); //this line will return true or false
        if(!isPasswordValid){
            throw new ApiError(401, "Invalid credentials");
        }

        const {accessToken, refreshToken}= await generateAccessAndRefreshTokens(user._id); //this line will generate access and refresh tokens for the user
        const loggedInUser= await User.findById(user._id).select( //this line means we are finding the user by id and selecting all fields except password and refreshToken
            "-password -refreshToken"
        );

        const options= {
            httpOnly: true,
            secure:true
        };
        return res.status(200) // This whole block means we are setting the cookies and sending the response
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggedInUser, accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );
});

const logoutUser= asyncHandler(async(req,res)=>{
    //get user id from req.user
    //find the user from db
    //remove refresh token from db
    //clear cookies
    //send response
  await User.findByIdAndUpdate(
    req.user._id,
    {
        $set: {
            refreshToken: undefined
        }
    },
    {
        new: true
    }
  )
  const options= {    // This whole block means we are clearing the cookies and sending the response
            httpOnly: true,  //this line means the cookie cannot be accessed by client-side scripts so it's more secure
            secure:true  //this line means the cookie will only be sent over HTTPS connection
        }
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken=asyncHandler(async(req,res)=>{
    //get refresh token from cookies
    //validate refresh token
    //generate new access token
    //send response
    const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken  // This line means we are getting the refresh token from cookies or from request body

    if (!incomingRefreshToken) { 
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(  // This line means we are verifying the refresh token using the secret key
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)  // This line means we are finding the user by id from the decoded token
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)  // This line means we are generating new access and refresh tokens for the user
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})
});

export {registerUser, loginUser, logoutUser, refreshAccessToken}; // Exporting the registerUser, loginUser, and logoutUser functions for use in other parts of the application




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
