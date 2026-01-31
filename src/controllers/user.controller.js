import {asyncHandler} from '../utils/asyncHandler.js';

const registerUser=asyncHandler(async(req,res)=>{
     res.status(200).json({
        message:"Ok"    
    })
});

export {registerUser};  // Exporting the registerUser function for use in other parts of the application

//In app.js we defined a route for user registration using userRouter which is imported from
// user.routes.js. In user.routes.js, we defined a POST route "/register" that 
// calls the registerUser function from user.controller.js when a request is made 
// to that route. The registerUser function is wrapped with asyncHandler to handle
// any asynchronous errors properly.