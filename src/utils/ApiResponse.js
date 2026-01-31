class ApiResponse{
    constructor(statusCode, data, message="Sucess"){
        this.statusCode=statusCode;
        this.data=data;
        this.success=statusCode < 400;
        this.message=message;
    }}

    export {ApiResponse}; // by exporting this class we can use it in other files

    // ApiResponse class is a utility class used to standardize the structure of API responses in a web application. It takes in a statusCode, data, and an optional message (defaulting to "Success") as parameters. The class sets the success property based on whether the statusCode is less than 400 (indicating a successful response). This class can be used to create consistent API responses throughout an application.