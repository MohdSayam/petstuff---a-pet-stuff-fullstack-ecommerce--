const cloudinary = require('cloudinary').v2;

if (!process.env.CLOUDINARY_URL) {
  throw new Error("CLOUDINARY_URL is missing");
}

// helper functions to upload stream: multer uploads file buffer to the ram and  cloudinary gets from it 
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream( // it tells open a pipe i am sendinf data
                { 
                resource_type: "auto",   
                 folder: "pet-stuff-store",
                 }, // folder name in cloudinary
            (error, result) => {  
                if (error) {
                    reject(error)
                } else {
                    resolve({
                        url : result.secure_url,
                        public_id: result.public_id
                    });
                }
            }
        );
        // acutaul send closing pipe and push the data into it
        uploadStream.end(fileBuffer)
    })
}

// when we delete product the images stil in cloudinary so we have to delete here too
const deleteFromCloudinary = (publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error){
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}

module.exports = {uploadToCloudinary, deleteFromCloudinary}