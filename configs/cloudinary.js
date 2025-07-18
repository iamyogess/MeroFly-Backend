import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const verificationDocumentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "merofly/users/verification-documents",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "merofly/users/profile",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  },
});

export const uploads = {
  verificationDocument: multer({
    storage: verificationDocumentStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFilter,
  }),
  userProfile: multer({
    storage: profileStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFilter,
  }),
};
