const cloudinary = require('cloudinary').v2;

// configuration
cloudinary.config({
    cloudinary_url : process.env.CLOUDINARY_URL,
})

// helper functions to upload stream
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto", folder: "pet-stuff-store", }, // folder name in cloudinary
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve({
                        url : result.secure_url,
                        publicId: result.public_id
                    });
                }
            }
        );
        // buffer to the stream 
        uploadStream.end(fileBuffer)
    })
}

module.exports = {uploadToCloudinary}