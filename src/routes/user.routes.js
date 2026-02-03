import {Router} from 'express';
import { loginUser,registerUser, logoutUser, refreshAccessToken } from '../controllers/user.controller.js';
import {upload} from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"; 
const router=Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser);  // Defining a POST route for user registration
//router.route("/login").post(registerUser);  // Defining a POST route for user registration
router.route("/login").post(loginUser);  // Defining a POST route for user login
router.route("/logout").post(verifyJWT, logoutUser);  //This line means we are defining a POST route for user logout and we are using verifyJWT middleware to protect this route
router.route("/refresh-token").post(refreshAccessToken);  // This line means we are defining a GET route for refreshing access token
export default router;