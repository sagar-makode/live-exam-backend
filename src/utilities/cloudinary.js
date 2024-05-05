const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const CLOUD_NAME = process.env.CLOUD_NAME
const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET

cloudinary.config({ 
    cloud_name: CLOUD_NAME, 
    api_key: API_KEY, 
    api_secret: API_SECRET
  });
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        let response = undefined;
        await cloudinary.uploader.upload(localFilePath, function(error, result) {
            if (error) {
                console.error(error);
            } else {
                response = result;
            }
        });

        fs.unlinkSync(localFilePath); // removing files once uploaded to Cloudinary
        return response;
    } catch (error) {
        console.error(error);
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation failed
        return null;
    }
};

module.exports = uploadOnCloudinary;
