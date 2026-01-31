import {Router} from 'express';
import { registerUser } from '../controllers/user.controller.js';

const router=Router();

router.route("/register").post(registerUser);  // Defining a POST route for user registration
//router.route("/login").post(registerUser);  // Defining a POST route for user registration
export default router;