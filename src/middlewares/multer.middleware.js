import multer from 'multer';

//multer is a middleware for handling multipart/form-data, which is primarily used for uploading files. 
//Multer stores files in uploads/ and renames them using a unique timestamp.


 const storage = multer.diskStorage({  // Configure how and where uploaded files will be stored
  destination: function (req, file, cb) {       // Destination to store the uploaded files
    cb(null, "./public/temp"); // Specify the destination directory and cb null means no error so file will be stored cb is callback function
    },
    filename: function (req, file, cb) {   //// Set custom file name to avoid duplicates    
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);  // Create a unique suffix for the file name // unique id
        cb(null, file.fieldname + '-' + uniqueSuffix); // Specify the file name
    }
});
export const upload = multer({ storage: storage });   // create multer middleware     