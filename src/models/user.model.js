import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";  // for generating tokens
import bcrypt from "bcryptjs";  // for hashing passwords
import { asyncHandler } from "../utils/asyncHandler.js";

const userSchema= new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,   // for faster search
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        avatar: {
            type: String, //cloudinary url
            required: true,
        },
        coverImage: {
            type: String, //cloudinary url
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId, // Reference to Video model
            ref: "Video", //
        }
    ],
    password: {
        type: String, 
        required: true,
    },
    refreshToken: {     // for JWT refresh token
        type: String,
    }
},
    {
    timestamps: true,
    }
)
userSchema.pre("save", async function () {  // Hash password before saving for example during registration
    if (!this.isModified("password"))   //when user has to udate their avatar of some other field then the password will also updated so to prevent that we use this condition 
        return;
    
    this.password= await bcrypt.hash(this.password, 10);
})
userSchema.methods.isPasswordCorrect= async function 
(password) {
    return await bcrypt.compare(password, this.password); // compare plain text password with hashed password
}
userSchema.methods.generateAccessToken= function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    ) 
}
userSchema.methods.generateRefreshToken= function () {
    return jwt.sign(
        {
            _Id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    ) 
}

export const User= mongoose.model("User", userSchema);