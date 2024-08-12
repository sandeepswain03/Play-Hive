import { v2 as cloudinary } from "cloudinary";
import logger from "./logger.js";
import chalk from "chalk";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        //upload image to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // auto detects the type
        });
        //file has been uploaded successfully
        logger.info(
            chalk.yellow.bold.italic("File uploaded successfully") +
                response.url
        );
        fs.unlinkSync(localFilePath); //delete uploaded file
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); //delete uploaded file
        return null;
    }
};

const deleteOnCloudinary = async (public_id, resource_type = "image") => {
    try {
        if (!public_id) return null;
        const response = await cloudinary.uploader.destroy(public_id, {
            resource_type: `${resource_type}`
        });
        logger.info(
            chalk.yellow.bold.italic("File deleted successfully")
        );

        return response;
    } catch (error) {
        logger.error(
            chalk.red.bold.italic("Error deleting image from cloudinary") +
                error
        );
        return error;
    }
};
export { uploadOnCloudinary, deleteOnCloudinary };
