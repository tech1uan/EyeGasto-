import multer from 'multer'
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from '../services/cloudinary.js';


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "gastoo-profiles",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});

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