const { promisify } = require('util');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const mimeType = require('mime-types')
const sharpMulter = require('sharp-multer');

const uploadDir = path.resolve(process.env.UPLOAD_DIR);
let fileExt = "";

let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
            console.log('created directory');
        }
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        return callback(null, moment(new Date()).format('YYYYMMDDHHmmss'));
    }
});

let storageResize = sharpMulter ({
    destination: (req, file, callback) => {
        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
            console.log('created directory');
        }
        fileExt = path.extname(file.originalname||'').split('.');
        file.originalname = moment(new Date()).format('YYYYMMDDHHmmss') + '.' + fileExt[1];
        file.filename = moment(new Date()).format('YYYYMMDDHHmmss')
        callback(null, uploadDir);
    },
    imageOptions:{
        fileFormat: fileExt,
        quality: 30,
        // resize: { width: 1920, height: 1080 },
    }
 });


const storageProfile =  
 sharpMulter ({
    destination: (req, file, callback) => {
        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
            console.log('created directory');
        }
        fileExt = path.extname(file.originalname||'').split('.');
        file.originalname = moment(new Date()).format('YYYYMMDDHHmmss') + '.' + fileExt[1];
        file.filename = moment(new Date()).format('YYYYMMDDHHmmss');
        callback(null, uploadDir);
    },
    imageOptions:{
        fileFormat: fileExt,
        quality: 40,
        // resize: { width: 500, height: 500 },
    }
 });
const limits = {
    fileSize: 52428800
};

function _imgFilter (req, file, cb) {
    if (!file.originalname.match(/\.(png|jpeg|jpg|gif|PNG|JPEG|JPG|GIF)/)) {
        cb(new Error('Only images are allowed'), false)
    }
    cb(null, true)
}

const upload = multer({ storage: storage });
const uploadImage = multer({ storage: storageResize, fileFilter: _imgFilter  });
const uploadPicture = multer({ storage: storage, fileFilter: _imgFilter });

module.exports = {
    uploadSingle,
    uploadArray,
    uploadFields,
    uploadProfilePic,
    uploadSingleImage
}

function uploadSingle () {
    return upload.single('file')
}

function uploadSingleImage () {
    return uploadImage.single('image')
}


function uploadArray () {
    return upload.array('files', 4) 
}

function uploadFields () {
    return upload.fields({
        name: 'avatar',
        maxCount: 1
    }, {
        name: 'gallery',
        maxCount: 5
    });
}
  
function uploadProfilePic () {
    return uploadPicture.single('image')
}