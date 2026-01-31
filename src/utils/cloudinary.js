import {v2 as cloudinary} from "cloudinary";
import fs from "fs" //file system module to delete the local file after uploading to cloudinary

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => { // path of the file on local system
    try {
        if(!localFilePath) return null;  // if no file path is provided, return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // auto-detect the file type (image, video, etc.)
        })   
    //   console.log("File uploaded successfully:", response.url);
    fs.unlinkSync(localFilePath); // delete the local file after successful upload to free up space  
    return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // delete the local file in case of error to free up space
        return null;
    }
};

export {uploadOnCloudinary};    