const asyncHandler = (requestHandler) => (req, res, next) => {
    return Promise.resolve(requestHandler(req, res, next)).catch((err)=> next(err));
}

//this function takes a requestHandler function as input and returns a new function that wraps the original requestHandler in a Promise. If the Promise is rejected (i.e., if an error occurs during the execution of the requestHandler), the error is caught and passed to the next middleware function using next(err). This allows for centralized error handling in Express applications.
//in this we dont need to use try catch block in every async request handler function instead we can just wrap that function with asyncHandler and it will take care of catching errors and passing them to next middleware
export {asyncHandler}