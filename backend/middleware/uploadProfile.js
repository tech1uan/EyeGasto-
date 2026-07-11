import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination(req,file,cb) {

    cb(null,"uploads/profiles")
    },

    filename(req,file,cb) {
        
     const uniqueName = Date.now() + path.extname(file.originalname);

     cb(null, uniqueName);
    }
}) 

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error("Only JPG, PNG, and WEBP images are allowed.");
    error.status = 400;
    cb(error);
  }
};

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 2 * 1024 * 1024

    }

});

export default upload;