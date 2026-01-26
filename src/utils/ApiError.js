class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went Wrong!",
        errors=[],
        stack=null
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.message = message;
        this.errors=errors;

        if(stack){ //
            this.stack=stack;
        }else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
}

export {ApiError}

// ApiError class is a custom error class that extends the built-in Error class in JavaScript. It is used to create error objects that contain additional information such as statusCode, data, success, and message. This class can be used in an application to standardize error handling and provide more context about errors that occur.
//by not using it so in every file you will send error message manaually but by using this class you can create an object of this class and send it as error response