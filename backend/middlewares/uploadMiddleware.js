const multer = require('multer');

// we use memorystorage so the file is stored in ram (buffer) temporarily. this is better for deployment as compare to disk.
const storage = multer.memoryStorage();

const upload = multer({
    storage : storage,
    limits : {fileSize : 5 * 1024 *1024}  // limit 5 mb
})

module.exports = upload;